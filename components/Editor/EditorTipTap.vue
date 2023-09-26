<script setup lang='ts'>
///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////
import { Editor, EditorContent } from '@tiptap/vue-3'
import { Color as ExtColor } from '@tiptap/extension-color'
import ExtFontSize from './extensions/EditorTipTapFontSize'
import { highlightList as extractedHighlightList, default as ExtHighlight } from './extensions/TextStyleHighlight'
import ExtImage from '@tiptap/extension-image'
import ExtPlaceholder from '@tiptap/extension-placeholder'
import ExtUnderline from '@tiptap/extension-underline'
import ExtStarterKit from '@tiptap/starter-kit'
import { TextAlign as ExtTextAlign } from '@tiptap/extension-text-align'
import ExtTextStyle from '@tiptap/extension-text-style'
import ExtYoutube from '@tiptap/extension-youtube'
import { Icon } from '@iconify/vue'
import type { EditorView } from 'prosemirror-view/dist'
import type { Slice } from 'prosemirror-model/dist'
import EditorColorSelector from './EditorColorSelector.vue'
import EditorVideoEmbed from './EditorVideoEmbed.vue'
import { IwFormColor } from '../../utils/IwFormColor'
import { IwFormRule } from '../../utils/IwFormRule'
import { directive as vTippy } from 'vue-tippy'

///////////////////////////////////////////@  Props, Emits & Variables
//////////////////////////////////////////////////////////////////////
const emit = defineEmits(['change'])

const props = defineProps({
    config: {
        type: Object as PropType<IwFormEditorConfig>,
        required: true
    },
    formInput: {
        type: Object as PropType<IwFormInputEditor>,
        required: true,
    },
})

const defaultConfig: IwFormEditorConfig = {
    maxImageUploadPixel: 3000,
    maxImageSizeInMb: 2,
    placeholder: 'Write something ...',
    showLabel: false
}
const config: IwFormEditorConfig = Object.assign({}, defaultConfig, props.config)

const theEditor = ref<Editor>()
/** Indicates the current size of the content */
const contentLength = ref<number>(0)
const contentLimit = computed(() => props.config.maxContentSizeInBytes)
/**
 * Indicates the remaining size of the content before reaching the limit
 *
 * - Positive values if the limit is not reached.
 * - Negative values if the limit has been surpassed.
 * - `Infinity` if the limit is not defined.
 */
const contentRemaining = computed(() =>
    contentLimit.value != null
        ? contentLimit.value - contentLength.value
        : Infinity
)
const contentInfoTooltip = computed(() => {
    if (contentRemaining.value < Infinity) {
        const absNum = Math.abs(contentRemaining.value)
        const nounSuffix = absNum == 1 ? '' : 's'
        const status = contentRemaining.value < 0 ? 'over limit' : 'remaining'

        return `${absNum} byte${nounSuffix} ${status}. (${contentLength.value} / ${contentLimit.value})`
    }
    return ''
})

let fontColor = ref<string>('#000000')
let fontSize = ref<number>(12)
const fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 36, 48, 72]

/** Used for indicating the current highlight colour on the cursor */
const highlightIndicatorStyle = computed(() => {
    const transparent = IwFormColor.transparent.toHex()
    const color = highlightColorObj.value.toHex()

    return `linear-gradient(to bottom, ${transparent} 80%, ${color} 80%, ${color} 90%, ${transparent} 90%)`
})
const highlightColorObj = ref<IwFormColor>(IwFormColor.transparent)
const showHighlightDropdown = ref(false)

let menus: IwFormEditorMenus[]

const youtubePreview = ref()
const showEmbedDropdown = ref(false)
/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////
/**
 * Used for invoking editor's internal highlight module to highlight content
 */
function applyHighlightToContent() {
    const bgColor = highlightColorObj.value
    const builder = theEditor.value!.chain().focus()

    if (bgColor.isTransparent()) {
        builder.unsetHighlight().run()
    } else {
        builder.setHighlight({ color: bgColor.toHex() }).run()
    }
}

/**
 * Return the number of bytes occupied by a string of text converted to UTF-8
 */
function calculateTextUtf8Length(content: string): number {
    return new TextEncoder().encode(content).length
}

function handleDropOntoEditor(view: EditorView, event: DragEvent, slice: Slice, moved: boolean) {
    if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
        let droppedFile = event.dataTransfer.files[0]; // the dropped file
        let filesize = Math.floor((droppedFile.size / 1024) / 1024)

        if ((droppedFile.type === "image/jpeg" || droppedFile.type === "image/png")
            && filesize < config.maxImageSizeInMb!) {
            let _URL = window.URL || window.webkitURL;
            let img = new Image();
            img.src = _URL.createObjectURL(droppedFile);

            img.onload = async function (onLoadEvent: Event) {
                const image = onLoadEvent.target as HTMLImageElement;
                const maxPixel = config.maxImageUploadPixel!
                if (image.width > maxPixel || image.height > maxPixel) {
                    throw new Error(`images need to be less than ${maxPixel} pixels in height and width.`);
                } else {
                    if (!config.onImageUpload) {
                        throw new Error('onImageUpload props is not defined.');
                    }

                    const imageUrl = await config.onImageUpload(droppedFile)
                    let image = new Image();
                    image.src = imageUrl;
                    // TODO: start the image loading spinner

                    image.onload = function () {
                        const { schema } = view.state;
                        const coordinates = view.posAtCoords({
                            left: event.clientX, top: event.clientY
                        });
                        const node = schema.nodes.image.create({ src: imageUrl });
                        if (coordinates) {
                            const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
                            // TODO: stop the image loading spinner
                            return view.dispatch(transaction);
                        } else {
                            console.error('could not find Editor view coordinates');
                        }
                    }

                }
            };

        } else {
            throw new Error("Images need to be in jpg or png format and less than 10mb in size.");
        }

        return true; // handled
    }

    return false; // not handled use default behaviour
}

function initEditor(): Editor {
    return new Editor({
        editorProps: {
            handleDrop: handleDropOntoEditor
        },
        extensions: [
            ExtColor,
            ExtFontSize,
            ExtHighlight.configure({
                multicolor: true,
                HTMLAttributes: {
                    class: 'iwFormEditorHighlight',
                },
            }),
            ExtImage
                .extend({
                    addAttributes() {
                        return {
                            ...this.parent?.(),
                            style: {
                                default: null
                            }
                        }
                    },
                })
                .configure({
                    allowBase64: true,
                    HTMLAttributes: {
                        class: 'iwFormEditorPreviewImg'
                    },
                    inline: true,
                }),
            ExtPlaceholder.configure({ placeholder: config.placeholder, }),
            ExtStarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                history: { newGroupDelay: 1000, }
            }),
            ExtTextAlign.configure({
                alignments: ['left', 'center', 'right', 'justify'],
                defaultAlignment: 'left',
                types: ['heading', 'paragraph'],
            }),
            ExtTextStyle,
            ExtUnderline.configure({
                HTMLAttributes: {
                    class: 'iwFormEditorUnderline',
                },
            }),
            ExtYoutube.extend({
                parseHTML() {
                    return [
                        {
                            tag: 'iframe'
                        }
                    ]
                }
            }).configure({
                enableIFrameApi: true,
            }),
        ],
        content: toRaw(config.content),
        onSelectionUpdate: ({ editor }) => {
            fontColor.value = rgbToHex(editor.getAttributes('textStyle').color)
            highlightColorObj.value = IwFormColor.initFromString(
                editor.getAttributes('highlight').color
                || IwFormColor.transparent.toHex()
            )

            onSelectUpdateFontSize(editor as Editor)
        },
        onUpdate: ({ editor }) => {
            const content = editor.getHTML()

            if (config.maxContentSizeInBytes) {
                contentLength.value = calculateTextUtf8Length(content)
            }

            emit('change', content)
        }
    })
}

function initMenu(editor: Editor) {

    fontColor.value = rgbToHex(editor.getAttributes('textStyle').color)
    menus = [
        {
            type: 'color',
            onClick() {
                showHighlightDropdown.value = !showHighlightDropdown.value
            },
            onChange: function (color: IwFormColor) {
                // If the same colour is being applied, remove the highlight
                if (color.toHex() == highlightColorObj.value.toHex()) {
                    color = IwFormColor.transparent
                }
                highlightColorObj.value = color

                applyHighlightToContent()
                showHighlightDropdown.value = false
            },
            colorList: extractedHighlightList,
            icon: 'material-symbols:ink-highlighter-outline',
            label: 'highlight',
        },
        {
            onClick: () => editor.chain().focus().toggleBold().run(),
            markOption: ['bold'],
            label: 'bold',
            shortcutKey: 'C-B',
            toggleable: true,
            icon: 'material-symbols:format-bold',
        },
        {
            onClick: () => editor.chain().focus().toggleItalic().run(),
            markOption: ['italic'],
            label: 'italic',
            shortcutKey: 'C-I',
            toggleable: true,
            icon: 'material-symbols:format-italic',
        },
        {
            onClick: () => editor.chain().focus().toggleUnderline().run(),
            markOption: ['underline'],
            label: 'underline',
            shortcutKey: 'C-U',
            toggleable: true,
            icon: 'material-symbols:format-underlined',
        },
        {
            onClick: () => editor.chain().focus().toggleStrike().run(),
            markOption: ['strike'],
            label: 'strike',
            shortcutKey: 'C-S-X',
            toggleable: true,
            icon: 'material-symbols:strikethrough-s-rounded',
        },
        {
            onClick: () => editor.chain().focus().toggleCodeBlock().run(),
            markOption: ['codeBlock'],
            label: 'codeBlock',
            shortcutKey: 'C-E',
            toggleable: true,
            icon: 'material-symbols:code',
        },

        // paragraph: {
        //     onClick: () => editor.chain().focus().setParagraph().run(),
        //     disabled: () => !editor.can().chain().focus().setParagraph().run(),
        //     css: { 'is-active': editor.isActive('paragraph') },
        //     label: 'paragraph',
        //     icon: 'mdi:format-paragraph',
        // },
        {
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            markOption: ['heading', { level: 1 }],
            label: 'h1',
            shortcutKey: 'C-A-1',
            toggleable: true,
            icon: 'gridicons:heading-h1',
        },
        {
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            markOption: ['heading', { level: 2 }],
            label: 'h2',
            shortcutKey: 'C-A-2',
            toggleable: true,
            icon: 'gridicons:heading-h2',
        },
        {
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            label: 'h3',
            markOption: ['heading', { level: 3 }],
            shortcutKey: 'C-A-3',
            toggleable: true,
            icon: 'gridicons:heading-h3',
        },
        {
            onClick: () => editor.commands.setTextAlign('left'),
            label: 'align left',
            markOption: [{ textAlign: 'left' }],
            shortcutKey: 'C-S-L',
            icon: 'akar-icons:text-align-left',
        },
        {
            onClick: () => editor.commands.setTextAlign('center'),
            label: 'align center',
            markOption: [{ textAlign: 'center' }],
            shortcutKey: 'C-S-E',
            icon: 'akar-icons:text-align-center',
        },
        {
            onClick: () => editor.commands.setTextAlign('right'),
            label: 'align right',
            markOption: [{ textAlign: 'right' }],
            shortcutKey: 'C-S-R',
            icon: 'akar-icons:text-align-right',
        },
        {
            onClick: () => editor.commands.setTextAlign('justify'),
            label: 'align justify',
            markOption: [{ textAlign: 'justify' }],
            shortcutKey: 'C-S-J',
            icon: 'akar-icons:text-align-justified',
        },
        {
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            label: 'ordered list',
            markOption: ['orderedList'],
            shortcutKey: 'C-S-7',
            toggleable: true,
            icon: 'material-symbols:format-list-numbered',
        },
        {
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            label: 'bullet list',
            markOption: ['bulletList'],
            toggleable: true,
            shortcutKey: 'C-S-8',
            icon: 'material-symbols:format-list-bulleted',
        },
        {
            onClick: () => editor.chain().focus().toggleBlockquote().run(),
            label: 'block quote',
            markOption: ['blockquote'],
            shortcutKey: 'C-S-B',
            toggleable: true,
            icon: 'material-symbols:format-quote',
        },
        {
            type: 'video',
            onClick: () => {
                showEmbedDropdown.value = !showEmbedDropdown.value
            },
            onInsert() {
                editor.commands.setYoutubeVideo({
                    src: youtubePreview.value!.src,
                    width: +youtubePreview.value!.width,
                    height: +youtubePreview.value!.height,
                })

                showEmbedDropdown.value = false
            },
            label: 'embed YouTube video',
            markOption: ['youtube'],
            icon: 'mingcute:youtube-line',
        },
        {
            onClick: () => editor.chain().focus().setHorizontalRule().run(),
            label: 'horizontal rule',
            icon: 'material-symbols:horizontal-rule',
        },
        {
            type: 'separator',
        },
        {
            onClick: () => {
                editor.chain().focus().unsetAllMarks().run()
                editor.chain().focus().clearNodes().run()
                editor.commands.unsetFontSize()
            },
            label: 'clear format',
            icon: 'tabler:clear-formatting',
        },
        {
            onClick: () => editor.chain().focus().undo().run(),
            label: 'undo',
            icon: 'material-symbols:undo',
            shortcutKey: 'C-Z',
        },
        {
            onClick: () => editor.chain().focus().redo().run(),
            label: 'redo',
            shortcutKey: 'C-S-Z',
            icon: 'material-symbols:redo',
        },
    ]

}

function getCss(menu: IwFormEditorMenu) {
    let css = ''
    if (typeof menu.markOption !== 'undefined') {
        // @ts-ignore : typescript unable to recognize menu.markOption could be
        // resolved to "name" or "name, attributes"
        const isActive = theEditor.value!.isActive(...menu.markOption)
        css += isActive ? ' active' : ''

        if (menu.toggleable) {
            css += ' toggleable'
        }
    }
    return css
}

function onFontSizeChange() {
    theEditor.value!.chain().focus().setFontSize(fontSize.value + 'px').run()
}

function rgbToHex(rgbColor: string) {
    if (!rgbColor) return '#000000';

    if (rgbColor.startsWith('#')) {
        return rgbColor;
    }

    const values = rgbColor.match(/\d+/g);
    if (!values || values.length !== 3) {
        console.warn("Invalid RGB color format. Using IwFormColor...")

        return IwFormColor.initFromString(rgbColor).toHex()
    }

    const hexValues = values.map(value => {
        const hex = parseInt(value).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    });

    return "#" + hexValues.join("").toUpperCase();
}

function onSelectUpdateFontSize(editor: Editor) {
    let size = editor.getAttributes('textStyle').fontSize
    if (!size) size = '16'
    fontSize.value = size.replace('px', '')
}

function onColorInput($event: Event) {
    const color = rgbToHex(($event.target as HTMLInputElement)?.value)
    theEditor.value!.chain().focus().setColor(color).run()
    fontColor.value = color
}

/**
 * Shorten bytes value by approximating to their decimal Metric (SI) prefix
 *
 * ### Example
 * ```
 * shortenBytesToStr(123) // returns: '123B'
 * shortenBytesToStr(12345) // returns: '12KB'
 * shortenBytesToStr(12345, 1) // returns: '12.3KB'
 *
 * shortenBytesToStr(-1_000_000) // returns: '-1MB'
 * ```
 */
function shortenBytesToStr(num: number, decimalPoints = 0): string {
    const kilo = 1e3
    const mega = 1e6
    const giga = 1e9
    const tera = 1e12
    const absNum = num < 0 ? -num : num

    const convert = (exp: number) => (num / exp).toFixed(decimalPoints)

    if (absNum >= tera) {
        return `${convert(tera)}TB`
    } else if (absNum >= giga) {
        return `${convert(giga)}GB`
    } else if (absNum >= mega) {
        return `${convert(mega)}MB`
    } else if (absNum >= kilo) {
        return `${convert(kilo)}kB`
    } else {
        return `${convert(1)}B`
    }
}
/////////////////////////////////////////////////////////@  Lifecycles
//////////////////////////////////////////////////////////////////////
onMounted(() => {
    theEditor.value = initEditor()
    initMenu(theEditor.value)

    if (config.content) {
        emit('change', theEditor.value.getHTML())
    }

    if (config.maxContentSizeInBytes != null) {
        const lengthRule = IwFormRule.maxSizeInBytes({
            max: config.maxContentSizeInBytes,
            errMsg: 'The size of content exceeds the size limit'
        })

        if (props.formInput.rules) {
            props.formInput.rules.push(lengthRule)
        } else {
            props.formInput.rules = [lengthRule]
        }
    }

    // Populate content's length
    contentLength.value = calculateTextUtf8Length(theEditor.value.getHTML())
})

onUnmounted(() => {
    theEditor.value?.destroy()
})

//////////////////////////////////////////////////////@ Initialization
//////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////@  Export & Expose
//////////////////////////////////////////////////////////////////////
</script>

<template>
    <div class="iwFormEditor">
        <div class="iwFormEditorMenus"
             v-if="theEditor">

            <span class="iwFormEditorMenu">
                <input class="m-auto"
                       type="color"
                       @input="onColorInput"
                       :value="fontColor">
            </span>
            <span class="iwFormEditorMenu mr-2">
                <select v-model="fontSize"
                        @change="onFontSizeChange">
                    <option v-for="size in fontSizeOptions">{{ size }}</option>
                </select>
            </span>
            <template v-for="(menu, key) in menus"
                      :key="key">
                <template v-if="!menu.type">
                    <span @click="() => menu.onClick()"
                          :disabled="menu.disabled ? menu.disabled() : false"
                          :title="menu.label + (menu.shortcutKey ? ` (${menu.shortcutKey})` : '')"
                          class="iwFormEditorMenu iwFormEditorMenuBtn"
                          :class="getCss(menu)">
                        <Icon :icon="menu.icon" />
                        <span v-if="config.showLabel">
                            {{ menu.label }}
                        </span>
                    </span>
                </template>
                <template v-else-if="'color' == menu.type">
                    <span class="iwFormEditorMenu iwFormEditorMenuBtn iwFormEditorMenuHighlightIndicator toggleable"
                          :class="{ 'active': !highlightColorObj.isTransparent() }"
                          :style="{ 'backgroundImage': highlightIndicatorStyle }"
                          :title="menu.label + (menu.shortcutKey ? ` (${menu.shortcutKey})` : '')"
                          @mousedown.self.prevent="() => menu.onClick()">
                        <Icon :icon="menu.icon"
                              @mousedown.prevent="() => menu.onClick()" />
                        <EditorColorSelector :colorList="menu.colorList"
                                             :hidden="showHighlightDropdown"
                                             :hintSelectedColor="highlightColorObj.toHex()"
                                             :replaceDefault="menu.replaceDefault"
                                             @change="(val) => menu.onChange(val)" />
                    </span>
                </template>
                <template v-else-if="'input' == menu.type">
                    <span class="iwFormEditorMenu">
                        <input :type="menu.inputType"
                               @input="menu.onInput"
                               :value="menu.value">
                    </span>
                </template>
                <template v-else-if="'video' == menu.type">
                    <span class="iwFormEditorMenu iwFormEditorMenuBtn toggleable"
                          :class="getCss(menu as unknown as IwFormEditorMenu)"
                          :title="menu.label + (menu.shortcutKey ? ` (${menu.shortcutKey})` : '')"
                          @mousedown.self.prevent="() => menu.onClick()">
                        <Icon :icon="menu.icon"
                              @mousedown.prevent="() => menu.onClick()" />
                        <EditorVideoEmbed :hidden="!showEmbedDropdown"
                                          :ref="(el) => youtubePreview = el"
                                          @insert="menu.onInsert" />
                    </span>
                </template>
                <template v-else>
                    <span class="divider"></span>
                </template>
            </template>

        </div>
        <editor-content :editor="theEditor"
                        class="iwFormEditorContent" />

    </div>
    <div class="iwFormEditorLengthInfo"
         :class="{ 'error': contentRemaining < 0 }"
         v-tippy="contentInfoTooltip">
        {{ shortenBytesToStr(contentLength, 1) }}
    </div>
</template>
