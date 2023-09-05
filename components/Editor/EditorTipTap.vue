<script setup lang='ts'>
///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////
import { Editor, EditorContent } from '@tiptap/vue-3'
import { Color as ExtColor } from '@tiptap/extension-color'
import ExtDropcursor from '@tiptap/extension-dropcursor'
import ExtFontSize from './extensions/EditorTipTapFontSize'
import ExtHighlight from '@tiptap/extension-highlight'
import ExtImage from '@tiptap/extension-image'
import ExtPlaceholder from '@tiptap/extension-placeholder'
import ExtUnderline from '@tiptap/extension-underline'
import ExtStarterKit from '@tiptap/starter-kit'
import { TextAlign as ExtTextAlign } from '@tiptap/extension-text-align'
import ExtTextStyle from '@tiptap/extension-text-style'
import ExtTextStyleExtraAttributes from './extensions/TextStyleExtraAttributes'
import ExtYoutube from '@tiptap/extension-youtube'
import { Icon } from '@iconify/vue'
import type { EditorView } from 'prosemirror-view/dist'
import type { Slice } from 'prosemirror-model/dist'


///////////////////////////////////////////@  Props, Emits & Variables
//////////////////////////////////////////////////////////////////////
const emit = defineEmits(['change'])

const props = defineProps({
    config: {
        type: Object as PropType<IwFormEditorConfig>,
        required: true
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

let fontColor = ref<string>('#000000')
let fontSize = ref<number>(12)
const fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 36, 48, 72]
let menus: IwFormEditorMenus[]


/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////

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
            ExtDropcursor,
            ExtFontSize,
            ExtHighlight.configure({
                HTMLAttributes: {
                    class: 'iw-form-editor-highlight',
                },
            }),
            ExtImage.configure({
                allowBase64: true,
                inline: true,
            }),
            ExtPlaceholder.configure({ placeholder: config.placeholder, }),
            ExtStarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                history: { newGroupDelay: 1000, }
            }),
            ExtTextAlign,
            ExtTextStyle,
            ExtTextStyleExtraAttributes,
            ExtUnderline.configure({
                HTMLAttributes: {
                    class: 'iw-form-editor-underline',
                },
            }),
            ExtYoutube.configure({
                enableIFrameApi: true,
            }),
        ],
        content: toRaw(config.content),
        onSelectionUpdate: ({ editor }) => {
            fontColor.value = rgbToHex(editor.getAttributes('textStyle').color)
            onSelectUpdateFontSize(editor as Editor)
        },
        onUpdate: ({ editor }) => {
            const content = editor.getHTML()
            emit('change', content)
        }
    })
}

function initMenu(editor: Editor) {

    fontColor.value = rgbToHex(editor.getAttributes('textStyle').color)
    menus = [
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
            label: 'material-symbols:format-quote',
            markOption: ['blockquote'],
            shortcutKey: 'C-S-B',
            toggleable: true,
            icon: 'material-symbols:format-quote',
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
        throw new Error("Invalid RGB color format");
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
/////////////////////////////////////////////////////////@  Lifecycles
//////////////////////////////////////////////////////////////////////
onMounted(() => {
    theEditor.value = initEditor()
    initMenu(theEditor.value)

    if (config.content) {
        emit('change', theEditor.value.getHTML())
    }
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
    <div class="iw-form-editor">
        <div class="iw-form-editor-menus"
             v-if="theEditor">

            <span class="iw-form-editor-menu">
                <input type="color"
                       @input="onColorInput"
                       :value="fontColor">
            </span>
            <span class="iw-form-editor-menu mr-1">
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
                          class="iw-form-editor-menu iw-form-editor-menu-btn"
                          :class="getCss(menu)">
                        <Icon :icon="menu.icon" />
                        <span v-if="config.showLabel">
                            {{ menu.label }}
                        </span>
                    </span>
                </template>
                <template v-else-if="'input' == menu.type">
                    <span class="iw-form-editor-menu">
                        <input :type="menu.inputType"
                               @input="menu.onInput"
                               :value="menu.value">
                    </span>
                </template>
                <template v-else>
                    <span class="divider"></span>
                </template>
            </template>

        </div>
        <editor-content :editor="theEditor"
                        class="iw-form-editor-content" />
    </div>
</template>
