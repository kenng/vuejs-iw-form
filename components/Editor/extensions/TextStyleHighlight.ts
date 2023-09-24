import ExtHigh from "@tiptap/extension-highlight";

let highlightList: Array<string> = []

function getHighlightStyle(value: string | HTMLElement): null | false | Record<string, any> {
    if (typeof value == 'string') {
        value = value.trim()

        // 'color' is used internally in extension-highlight's renderHTML
        // (https://github.com/ueberdosis/tiptap/commit/a966059dc04635f64fe25a1e249cd709eca1ba02#diff-3040088c2da5517846975495066c436490c0d1bafcecd97e79f8a2e7dd2bfce4R54)
        if (value) {
            highlightList.push(value)
            return { color: value }
        }
    }
    return false
}

const TextStyleHighlight = ExtHigh.extend({
    /**
     * Initialise highlightList with empty data on each editor close.
     *
     * This is needed to not carry over previous highlightList content to the
     * new editor, as the highlightList is persistent for each session until
     * page reload.
     */
    onDestroy() {
        highlightList = []
    },
    parseHTML() {
        /**
         * These HTML tags or CSS styles are processed by extension-highlight if,
         * getAttrs method returns null or if getAttrs is not defined.
         *
         * getAttrs also can return an object containing an attribute key[^1] and
         * the corresponding value that will be used in the HTML element render.
         *
         * [^1] The attribute key will be used by the
         * `addAttributes > * > renderHTML` function attribute parameter.
         *
         * TipTap Docs source: https://tiptap.dev/guide/custom-extensions/#parse-html
         */
        return [
            {
                tag: 'mark',
                getAttrs: (elem) => {
                    if (elem instanceof HTMLElement) {
                        highlightList.push(elem.style.background || elem.style.backgroundColor)
                    }
                    return null
                },
            },
            {
                style: 'background-color',
                getAttrs: getHighlightStyle,
            },
            {
                style: 'background',
                getAttrs: getHighlightStyle,
            },
        ]
    },
});

export default TextStyleHighlight
export { highlightList, TextStyleHighlight }
