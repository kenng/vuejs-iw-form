<script setup lang='ts'>
///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////
import { Icon } from '@iconify/vue'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'


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

const editor = new Editor({
    extensions: [
        StarterKit,
        Underline.configure({
            HTMLAttributes: {
                class: 'iw-form-editor-underline',
            },
        }),
        Placeholder.configure({
            placeholder: props.placeholder,
        })
    ],
    content: props.content
})

interface IwFormEditorMenu {
    css?: Record<'is-active', boolean>
    disabled?: () => boolean
    icon: string,
    label: string
    onClick: () => void
    shortcutKey?: string,
    type?: ''
}

interface IwFormEditorMenuSeparator {
    type: 'separator'
}

type IwFormEditorMenus = IwFormEditorMenu | IwFormEditorMenuSeparator

const menus: IwFormEditorMenus[] = [
    {
        onClick: () => editor.chain().focus().toggleBold().run(),
        disabled: () => !editor.can().chain().focus().toggleBold().run(),
        css: { 'is-active': editor.isActive('bold') },
        label: 'bold',
        shortcutKey: 'C-B',
        icon: 'material-symbols:format-bold',
    },
    {
        onClick: () => editor.chain().focus().toggleItalic().run(),
        disabled: () => !editor.can().chain().focus().toggleItalic().run(),
        css: { 'is-active': editor.isActive('italic') },
        label: 'italic',
        shortcutKey: 'C-I',
        icon: 'material-symbols:format-italic',
    },
    {
        onClick: () => editor.chain().focus().toggleUnderline().run(),
        disabled: () => !editor.can().chain().focus().toggleUnderline().run(),
        css: { 'is-active': editor.isActive('underline') },
        label: 'underline',
        shortcutKey: 'C-U',
        icon: 'material-symbols:format-underlined',
    },
    {
        onClick: () => editor.chain().focus().toggleStrike().run(),
        disabled: () => !editor.can().chain().focus().toggleStrike().run(),
        css: { 'is-active': editor.isActive('strike') },
        label: 'strike',
        shortcutKey: 'C-S-X',
        icon: 'material-symbols:strikethrough-s-rounded',
    },
    {
        onClick: () => editor.chain().focus().toggleCode().run(),
        disabled: () => !editor.can().chain().focus().toggleCode().run(),
        css: { 'is-active': editor.isActive('code') },
        label: 'code',
        shortcutKey: 'C-E',
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
        // disabled: () => !editor.can().chain().focus().toggleStrike().run(),
        css: { 'is-active': editor.isActive('heading', { level: 1 }) },
        label: 'h1',
        shortcutKey: 'C-A-1',
        icon: 'gridicons:heading-h1',
    },
    {
        onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        css: { 'is-active': editor.isActive('heading', { level: 2 }) },
        label: 'h2',
        shortcutKey: 'C-A-2',
        icon: 'gridicons:heading-h2',
    },
    {
        onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        css: { 'is-active': editor.isActive('heading', { level: 3 }) },
        label: 'h3',
        shortcutKey: 'C-A-3',
        icon: 'gridicons:heading-h3',
    },
    {
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        css: { 'is-active': editor.isActive('orderedList') },
        label: 'ordered list',
        shortcutKey: 'C-S-7',
        icon: 'material-symbols:format-list-numbered',
    },
    {
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        disabled: () => !editor.can().chain().focus().toggleBulletList().run(),
        css: { 'is-active': editor.isActive('bulletList') },
        label: 'bullet list',
        shortcutKey: 'C-S-8',
        icon: 'material-symbols:format-list-bulleted',
    },
    {
        onClick: () => editor.chain().focus().toggleBlockquote().run(),
        css: { 'is-active': editor.isActive('blockquote') },
        label: 'material-symbols:format-quote',
        shortcutKey: 'C-S-B',
        icon: 'material-symbols:format-list-numbered',
    },
    {
        onClick: () => editor.chain().focus().setHorizontalRule().run(),
        label: 'horizontal rule',
        icon: 'material-symbols:code',
    },
    {
        type: 'separator',
    },
    {
        onClick: () => {
            editor.chain().focus().unsetAllMarks().run()
            editor.chain().focus().clearNodes().run()
        },
        label: 'clear format',
        icon: 'icon-park-outline:clear',
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

/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////@  Lifecycles
//////////////////////////////////////////////////////////////////////
onUnmounted(() => {
    editor.destroy()
})

//////////////////////////////////////////////////////@ Initialization
//////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////@  Export & Expose
//////////////////////////////////////////////////////////////////////
</script>

<template>
    <div class="iw-form-editor">
        <div v-if="editor">
            <template v-for="(menu, key) in menus"
                      :key="key">
                <tempalate v-if="menu.type != 'separator'">
                    <button @click="menu.onClick"
                            :disabled="menu.disabled ? menu.disabled() : false"
                            :title="menu.label + (menu.shortcutKey ? ` (${menu.shortcutKey})` : '')"
                            :class="menu.css">
                        <Icon :icon="menu.icon" />
                        <span v-if="showLabel">
                            {{ menu.label }}
                        </span>
                    </button>
                </tempalate>
                <template v-else>
                    <Icon icon="tabler:minus-vertical" />
                </template>
            </template>

        </div>
        <editor-content :editor="editor" />
    </div>
</template>
