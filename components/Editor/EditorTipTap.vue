<script setup lang='ts'>
///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////
import { Editor, EditorContent } from '@tiptap/vue-3'
import { Color } from '@tiptap/extension-color'
import Dropcursor from '@tiptap/extension-dropcursor'
import FontSize from './extensions/EditorTipTapFontSize'
import Highlight from '@tiptap/extension-highlight'
import { Icon } from '@iconify/vue'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import TextStyleExtraAttributes from './extensions/TextStyleExtraAttributes'
import Youtube from '@tiptap/extension-youtube'


///////////////////////////////////////////@  Props, Emits & Variables
//////////////////////////////////////////////////////////////////////
const props = defineProps({
    content: {
        type: String
    },
    placeholder: {
        type: String,
        default: 'Write something ...'
    },
    showLabel: {
        type: Boolean,
        default: false,
    }
})


const theEditor = ref<Editor>()


let fontColor = ref<string>('#000000')
let fontSize = ref<number>(12)
const fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 36, 48, 72]
let menus: IwFormEditorMenus[]

function initEditor(): Editor {
    return new Editor({
        extensions: [
            Color,
            Dropcursor,
            FontSize,
            Highlight.configure({
                HTMLAttributes: {
                    class: 'iw-form-editor-highlight',
                },
            }),
            Image.configure({
                allowBase64: true,
                inline: true,
            }),
            Placeholder.configure({ placeholder: props.placeholder, }),
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                history: { newGroupDelay: 1000, }
            }),
            TextAlign,
            TextStyle,
            TextStyleExtraAttributes,
            Underline.configure({
                HTMLAttributes: {
                    class: 'iw-form-editor-underline',
                },
            }),
            Youtube.configure({
                enableIFrameApi: true,
            }),
        ],
        content: toRaw(props.content),
        onSelectionUpdate(ev) {
            fontColor.value = rgbToHex(ev.editor.getAttributes('textStyle').color)
            onSelectUpdateFontSize(ev.editor as Editor)
        },
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

/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////
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
                    <div @click="() => menu.onClick()"
                         :disabled="menu.disabled ? menu.disabled() : false"
                         :title="menu.label + (menu.shortcutKey ? ` (${menu.shortcutKey})` : '')"
                         class="iw-form-editor-menu"
                         :class="getCss(menu)">
                        <Icon :icon="menu.icon" />
                        <span v-if="showLabel">
                            {{ menu.label }}
                        </span>
                    </div>
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
