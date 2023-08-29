/** source: https://gist.github.com/gregveres/973e8d545ab40dc375b47ebc63f92846 */
import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";

export type TextStyleExtraAttributes = {
    types: string[];
};


const TextStyleExtraAttributes = Extension.create<TextStyleExtraAttributes>({
    addGlobalAttributes() {
        return [
            {
                types: [
                    'heading',
                    'paragraph',
                    'span',
                ],
                attributes: {
                    backgroundColor: {
                        default: null,
                        parseHTML: (element) =>
                            element.style.backgroundColor.replace(/['"]+/g, ""),
                        renderHTML: (attributes) => {
                            if (!attributes.backgroundColor) {
                                return {};
                            }

                            return {
                                style: `background-color: ${attributes.backgroundColor}`,
                            };
                        },
                    },
                    textAlign: {
                        default: 'left',
                        parseHTML: element => element.style.textAlign || 'left',
                        renderHTML: attributes => ({
                            style: `text-align: ${attributes.textAlign}`,
                        }),
                    },
                },
            },
        ];
    },
});

export default TextStyleExtraAttributes
