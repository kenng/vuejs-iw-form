import HardBreak from '@tiptap/extension-hard-break'

export default HardBreak.extend({
    addKeyboardShortcuts() {
        return {
            ...this.parent?.(),
            'Enter': () => {
                return this.editor.commands.first(({ commands }) => [
                    () => commands.newlineInCode(),
                    () => commands.setHardBreak(),
                ])
            }
        }
    },
})
