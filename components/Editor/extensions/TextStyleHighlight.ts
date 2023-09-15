import ExtHigh from "@tiptap/extension-highlight";

const TextStyleHighlight = ExtHigh.extend({
    parseHTML() {
        return [
            {
                tag: 'mark',
            },
            {
                tag: 'span',
                getAttrs: (elem) => {
                    if (elem.style.backgroundColor?.trim()) {
                        // return null to indicate that the element matches
                        return null
                    }
                    return false
                }
            },
        ]
    },
});

export default TextStyleHighlight
