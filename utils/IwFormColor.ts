class IwFormColor {
    /** The value of the alpha channel (opacity) (Range: [0, 255]) */
    alphaValue = 0xFF
    /** The name of the colour */
    label: string = ''
    /** The value of the colour in number */
    rawValue = 0

    // Default Colours
    static namedColors = {
        'aqua': 0x00FFFF,
        'aliceblue': 0xf0f8ff,
        'antiquewhite': 0xfaebd7,
        'aquamarine': 0x7fffd4,
        'azure': 0xf0ffff,
        'beige': 0xf5f5dc,
        'bisque': 0xffe4c4,
        'black': 0x000000,
        'blanchedalmond': 0xffebcd,
        'blue': 0x0000ff,
        'blueviolet': 0x8a2be2,
        'brown': 0xa52a2a,
        'burlywood': 0xdeb887,
        'cadetblue': 0x5f9ea0,
        'chartreuse': 0x7fff00,
        'chocolate': 0xd2691e,
        'coral': 0xff7f50,
        'cornflowerblue': 0x6495ed,
        'cornsilk': 0xfff8dc,
        'crimson': 0xdc143c,
        'cyan': 0x00ffff,
        'darkblue': 0x00008b,
        'darkcyan': 0x008b8b,
        'darkgoldenrod': 0xb8860b,
        'darkgray': 0xa9a9a9,
        'darkgreen': 0x006400,
        'darkgrey': 0xa9a9a9,
        'darkkhaki': 0xbdb76b,
        'darkmagenta': 0x8b008b,
        'darkolivegreen': 0x556b2f,
        'darkorange': 0xff8c00,
        'darkorchid': 0x9932cc,
        'darkred': 0x8b0000,
        'darksalmon': 0xe9967a,
        'darkseagreen': 0x8fbc8f,
        'darkslateblue': 0x483d8b,
        'darkslategray': 0x2f4f4f,
        'darkslategrey': 0x2f4f4f,
        'darkturquoise': 0x00ced1,
        'darkviolet': 0x9400d3,
        'deeppink': 0xff1493,
        'deepskyblue': 0x00bfff,
        'dimgray': 0x696969,
        'dimgrey': 0x696969,
        'dodgerblue': 0x1e90ff,
        'firebrick': 0xb22222,
        'floralwhite': 0xfffaf0,
        'forestgreen': 0x228b22,
        'fuchsia': 0xff00ff,
        'gainsboro': 0xdcdcdc,
        'ghostwhite': 0xf8f8ff,
        'gold': 0xffd700,
        'goldenrod': 0xdaa520,
        'gray': 0x808080,
        'green': 0x008000,
        'greenyellow': 0xadff2f,
        'grey': 0x808080,
        'honeydew': 0xf0fff0,
        'hotpink': 0xff69b4,
        'indianred': 0xcd5c5c,
        'indigo': 0x4b0082,
        'ivory': 0xfffff0,
        'khaki': 0xf0e68c,
        'lavender': 0xe6e6fa,
        'lavenderblush': 0xfff0f5,
        'lawngreen': 0x7cfc00,
        'lemonchiffon': 0xfffacd,
        'lightblue': 0xadd8e6,
        'lightcoral': 0xf08080,
        'lightcyan': 0xe0ffff,
        'lightgoldenrodyellow': 0xfafad2,
        'lightgray': 0xd3d3d3,
        'lightgreen': 0x90ee90,
        'lightgrey': 0xd3d3d3,
        'lightpink': 0xffb6c1,
        'lightsalmon': 0xffa07a,
        'lightseagreen': 0x20b2aa,
        'lightskyblue': 0x87cefa,
        'lightslategray': 0x778899,
        'lightslategrey': 0x778899,
        'lightsteelblue': 0xb0c4de,
        'lightyellow': 0xffffe0,
        'lime': 0x00ff00,
        'limegreen': 0x32cd32,
        'linen': 0xfaf0e6,
        'magenta': 0xff00ff,
        'maroon': 0x800000,
        'mediumaquamarine': 0x66cdaa,
        'mediumblue': 0x0000cd,
        'mediumorchid': 0xba55d3,
        'mediumpurple': 0x9370db,
        'mediumseagreen': 0x3cb371,
        'mediumslateblue': 0x7b68ee,
        'mediumspringgreen': 0x00fa9a,
        'mediumturquoise': 0x48d1cc,
        'mediumvioletred': 0xc71585,
        'midnightblue': 0x191970,
        'mintcream': 0xf5fffa,
        'mistyrose': 0xffe4e1,
        'moccasin': 0xffe4b5,
        'navajowhite': 0xffdead,
        'navy': 0x000080,
        'oldlace': 0xfdf5e6,
        'olive': 0x808000,
        'olivedrab': 0x6b8e23,
        'orange': 0xffa500,
        'orangered': 0xff4500,
        'orchid': 0xda70d6,
        'palegoldenrod': 0xeee8aa,
        'palegreen': 0x98fb98,
        'paleturquoise': 0xafeeee,
        'palevioletred': 0xdb7093,
        'papayawhip': 0xffefd5,
        'peachpuff': 0xffdab9,
        'peru': 0xcd853f,
        'pink': 0xffc0cb,
        'plum': 0xdda0dd,
        'powderblue': 0xb0e0e6,
        'purple': 0x800080,
        'red': 0xff0000,
        'rosybrown': 0xbc8f8f,
        'royalblue': 0x4169e1,
        'saddlebrown': 0x8b4513,
        'salmon': 0xfa8072,
        'sandybrown': 0xf4a460,
        'seagreen': 0x2e8b57,
        'seashell': 0xfff5ee,
        'sienna': 0xa0522d,
        'silver': 0xc0c0c0,
        'skyblue': 0x87ceeb,
        'slateblue': 0x6a5acd,
        'slategray': 0x708090,
        'slategrey': 0x708090,
        'snow': 0xfffafa,
        'springgreen': 0x00ff7f,
        'steelblue': 0x4682b4,
        'tan': 0xd2b48c,
        'teal': 0x008080,
        'thistle': 0xd8bfd8,
        'tomato': 0xff6347,
        'turquoise': 0x40e0d0,
        'violet': 0xee82ee,
        'wheat': 0xf5deb3,
        'white': 0xffffff,
        'whitesmoke': 0xf5f5f5,
        'yellow': 0xffff00,
        'yellowgreen': 0x9acd32,
    }
    /* An IwFormColor instance that is used for an indication of error */
    static #initError = new IwFormColor(0xFF00FF, 0xFF, 'ERR_COLOR')
    /** A completely transparent colour 'RGBA(255, 255, 255, 0)' | '#FFFFFF00' */
    static transparent = new IwFormColor(0xFFF, 0x0, 'Transparent')

    /**
     * Construct an IwFormColor instance from an array of values for each channel
     *
     * ### Example
     * ```
     * IwFormColor.initFromArray([0, 0, 0])
     * IwFormColor.initFromArray([255, 255, 255])
     * IwFormColor.initFromArray([0, 0, 0, 0.5])
     * IwFormColor.initFromArray([255, 255, 255, 1])
     *
     * IwFormColor.initFromArray([255, 255, 255], 'White')
     * ```
     *
     * @param values The colour in array format [Red, Blue, Green, Alpha?]
     * @param label The name of the colour
     */
    static initFromArray(rgbArray: IwFormColorRgbArray, label?: string): IwFormColor {
        const rgbPartsLength = 3
        const rgbWithAlphaPartsLength = 4
        const channelBitWidth = 8
        let curRawValue = 0

        for (let i = 0; i < rgbPartsLength; ++i) {
            const valueClamped = Math.min(
                Math.max(0, rgbArray[i]) // Clamp value to 0 or above
                , 255) // Clamp value to 255 or below
                || 0 // Fallback to 0, if NaN

            /**
             * Shift colour octet for each iteration
             *
             * Example for rgbArray = [0xDB, 0xA3, 0x6D]
             * ---
             * Initial value: 0x00
             *
             * i = 0:
             * value after SHL, 0x00
             * value after ADD, 0xDB
             *
             * i = 1:
             * value after SHL, 0xDB00
             * value after ADD, 0xDBA3
             *
             * i = 2:
             * value after SHL, 0xDBA300
             * value after ADD, 0xDBA36D
             */
            curRawValue <<= channelBitWidth
            curRawValue += valueClamped
        }

        // Get alpha channel value
        let alphaValue = 0xFF // Default value
        if (rgbArray.length == rgbWithAlphaPartsLength) {
            const opacityGiven = rgbArray[rgbWithAlphaPartsLength - 1]

            if (opacityGiven > 1) {
                console.warn(
                    `Invalid RGBA opacity value of ${opacityGiven} (Range: [0, 1]), from ${opacityGiven}.`
                    + '\nAlpha channel clamped to 1.'
                )
            }

            const alphaClamped = Math.min(
                Math.max(0, opacityGiven),
                1
            )
            alphaValue = Math.round(alphaClamped * 255)
        }

        return new IwFormColor(
            curRawValue,
            alphaValue,
            label
        )
    }

    /**
     * Construct an IwFormColor instance from a BigInt with optional opacity format
     *
     * ### Example
     * ```
     * IwFormColor.initFromBigInt(0xFFFn)
     * IwFormColor.initFromBigInt(0xFFF8n)
     * IwFormColor.initFromBigInt(0xFFFFFFn)
     * IwFormColor.initFromBigInt(0xFFFFFF88n)
     *
     * IwFormColor.initFromBigInt(0xFFFn, 'White')
     * ```
     *
     * @param hexString The colour in BigInt number format
     * @param label The name of the colour
     */
    static initFromBigInt(rawValue: bigint, label?: string): IwFormColor {
        if (0n <= rawValue && rawValue <= 0xFFFFFFn) {
            return new IwFormColor(
                Number(rawValue),
                0xFF,
                label
            )
        } else if (0xFFFFFFn <= rawValue && rawValue <= 0xFF_FF_FF_FFn) {
            return new IwFormColor(
                Number(rawValue >> 8n),
                Number(rawValue & 0xFFn),
                label
            )
        } else {
            return IwFormColor.#initError
        }
    }

    /**
     * Construct an IwFormColor instance from a hex string format
     *
     * ### Example
     * ```
     * IwFormColor.initFromHex('#FFF')
     * IwFormColor.initFromHex('#FFF8')
     * IwFormColor.initFromHex('#FFFFFF')
     * IwFormColor.initFromHex('#FFFFFF88')
     *
     * IwFormColor.initFromHex('#FFF', 'White')
     * ```
     *
     * @param hexString The colour in hex string format
     * @param label The name of the colour
     */
    static initFromHex(hexString: IwFormColorHexString, label?: string): IwFormColor {
        // Remove any non-hex characters (E.g. ' #0ff ' -> '0ff')
        let hex = hexString.replace(/[^0-9A-F]/gi, '')

        // Duplicate shortened hex syntax to full form
        if (hex.length == 3 || hex.length == 4) {
            hex = hex.replace(/./g, (c) => c + c)
        }

        if (hex.length == 6 || hex.length == 8) {
            return new IwFormColor(
                Number.parseInt(hex.substring(0, 6), 16),
                Number.parseInt(hex.substring(6) || 'FF', 16),
                label
            )
        } else {
            return IwFormColor.#initError
        }
    }

    /**
     * Construct an IwFormColor instance from a RGB and optional Alpha string format
     *
     * ### Example
     * ```
     * IwFormColor.initFromRgb('rgb(0, 0, 0)')
     * IwFormColor.initFromRgb('RGB(255, 255, 255)')
     * IwFormColor.initFromRgb('rgba(0, 0, 0, 0.5)')
     * IwFormColor.initFromRgb('RGBA(255, 255, 255, 1)')
     *
     * IwFormColor.initFromRgb('rgb(255, 255, 255)', 'White')
     * ```
     *
     * @param rgbString The colour in RGB(A) string format
     * @param label The name of the colour
     */
    static initFromRgb(rgbString: IwFormColorRgbString, label?: string): IwFormColor {
        // Extract each consecutive digits out.
        let rgbArray = rgbString.match(/[\d.]+/g)

        if (rgbArray && IwFormColor.isRgbArray(rgbArray)) {
            return IwFormColor.initFromArray(rgbArray, label)
        } else {
            return IwFormColor.#initError
        }
    }

    /**
     * Construct an IwFormColor instance from a non-literal string
     *
     * The purpose of this method is for handling string values that is
     * not acceptable by {@link IwFormColor.initFromHex} or
     * {@link IwFormColor.initFromRgb}.
     *
     * This is because those init methods only accepts string literals (E.g.
     * `IwFormColor.initFromHex('#fff')` but not
     * `const hexVar: string = '#fff'; IwFormColor.initFromHex(hexVar)`)
     *
     * ### Example
     * ```
     * const hex: string = '#fff'
     * IwFormColor.initFromString(hex)
     * IwFormColor.initFromString(hex, 'White')
     *
     * const rgb: string = 'rgb(0,0,0)'
     * IwFormColor.initFromString(rgb)
     * IwFormColor.initFromString(rgb, 'Black')
     * ```
     *
     * @see {@link IwFormColor.initFromHex} for valid hex values
     * @see {@link IwFormColor.initFromRgb} for valid RGB values
     *
     * @param genericString The colour in any acceptable string format
     * @param label The name of the colour
     */
    static initFromString(genericString: string, label?: string): IwFormColor {
        if (IwFormColor.isValidHex(genericString)) {
            return IwFormColor.initFromHex(genericString)
        } else if (/^\s*RGB/i.test(genericString)) {
            // Use .initFromRgb() to further process it
            return IwFormColor.initFromRgb(genericString as IwFormColorRgbString, label)
        } else if (IwFormColor.namedColors[genericString] != null) {
            return new IwFormColor(
                IwFormColor.namedColors[genericString],
                0xFF,
                genericString[0].toUpperCase() + genericString.substring(1)
            )
        } else {
            return IwFormColor.#initError
        }
    }

    /**
     * Construct an IwFormColor instance with processed values
     *
     * @param rawValue The raw colour value in number form
     * @param alphaValue The alpha channel value in number form
     * @param label The name of the colour
     */
    constructor(rawValue: number, alphaValue: number = 0xFF, label: string = '') {
        if (
            0 <= rawValue && rawValue <= 0xFFFFFF
            && 0 <= alphaValue && alphaValue <= 0xFF
        ) {
            this.rawValue = rawValue
            this.alphaValue = alphaValue
            this.label = label
        } else {
            Object.assign(this, IwFormColor.#initError)
        }
    }

    /**
     * Subtract the current IwFormColor instance with another IwFormColor instance
     * and return a new IwFormColor instance
     *
     * ### Example
     * ```
     * const c1 = new IwFormColor('#FFF')
     * const c2 = new IwFormColor('#111')
     *
     * c1.darkenBy(c2) // returns: IwFormColor('#EEE')
     * ```
     *
     * @param other Another IwFormColor instance
     * @returns A new IwFormColor instance
     */
    darkenBy(other: IwFormColor): IwFormColor {
        return IwFormColor.#saturatingMix(this, other, '-')
    }

    /**
     * Check if the value given matches a RGB(A) value
     *
     * @param rgbArray An array of values for [Red, Green, Blue, Alpha?]
     */
    static isRgbArray(rgbArray: Array<any>): rgbArray is IwFormColorRgbArray {
        if (Array.isArray(rgbArray)) {
            // Make use of 'is' for rgbArray: any[]
            const matchRgbLength = rgbArray.length == 3
            const matchRgbaLength = rgbArray.length == 4
            const validRgbValues = rgbArray
                .slice(0, 3)
                .every((val) => 0 <= val && val <= 255)
            const validAlphaValue = 0 <= rgbArray.at(-1) && rgbArray.at(-1) <= 1

            return (matchRgbLength || (matchRgbaLength && validAlphaValue)) && validRgbValues
        }
        return false
    }

    /**
     * Check if the current colour instance is completely transparent
     */
    isTransparent(): boolean {
        return this.alphaValue === 0
    }

    /**
     * Check if value is a valid hex string
     *
     * @param hexString The colour value in hex string form
     */
    static isValidHex(hexString: string): hexString is IwFormColorHexString {
        return /^\s*#([\dA-F]{3,4}|[\dA-F]{6}|[\dA-F]{8})\s*$/i.test(hexString)
    }

    /**
     * Sum the current IwFormColor instance with another IwFormColor instance
     * and return a new IwFormColor instance
     *
     * ### Example
     * ```
     * const c1 = new IwFormColor('#222')
     * const c2 = new IwFormColor('#111')
     *
     * c1.lightenBy(c2) // returns: IwFormColor('#333')
     * ```
     *
     * @param other Another IwFormColor instance
     * @returns A new IwFormColor instance
     */
    lightenBy(other: IwFormColor): IwFormColor {
        return IwFormColor.#saturatingMix(this, other, '+')
    }

    /**
     * Clone the colour instance and apply a new opacity
     *
     * @param opacity Opacity value of range from 0 to 1
     */
    opacity(opacity = 1): IwFormColor {
        return IwFormColor.initFromString(this.toHexNoOpacity() + (Math.round(opacity * 0xFF)).toString(16))
    }

    /**
     * Sum or subtract instances of IwFormColor class, and saturates at the boundary of the colour values
     *
     * ### Example
     * ```
     * const c1 = IwFormColor.initFromHex('#888')
     * const c2 = IwFormColor.initFromHex('#222')
     * const c3 = IwFormColor.initFromHex('#E27')
     *
     * IwFormColor.#saturatingMix(c1, c2) // returns IwFormColor('#AAA')
     * IwFormColor.#saturatingMix(c1, c2, '+') // returns IwFormColor('#AAA')
     * IwFormColor.#saturatingMix(c1, c2, '-') // returns IwFormColor('#666')
     *
     * // Saturating examples
     * IwFormColor.#saturatingMix(c1, c3) // returns IwFormColor('#FAF')
     * IwFormColor.#saturatingMix(c1, c3, '-') // returns IwFormColor('#061')
     * ```
     *
     * @param c1 An IwFormColor instance
     * @param c2 An IwFormColor instance
     * @param opsType The type of operation (Add '+', or Subtract '-')
     * @returns A new IwFormColor instance
     */
    static #saturatingMix(c1: IwFormColor, c2: IwFormColor, opsType: '-' | '+' = '+'): IwFormColor {
        const r1 = (c1.rawValue & 0xFF0000) >> 16
        const g1 = (c1.rawValue & 0x00FF00) >> 8
        const b1 = c1.rawValue & 0x0000FF

        const r2 = (c2.rawValue & 0xFF0000) >> 16
        const g2 = (c2.rawValue & 0x00FF00) >> 8
        const b2 = c2.rawValue & 0x0000FF

        const clamp = (val: number, ..._: any[]) => Math.min(Math.max(0, val), 255)

        const rgb: [number, number, number] = opsType == '+'
            ? [clamp(r1 + r2), clamp(g1 + g2), clamp(b1 + b2)]
            : [clamp(r1 - r2), clamp(g1 - g2), clamp(b1 - b2)]

        return IwFormColor.initFromArray(rgb as IwFormColorRgbArray)
    }

    /**
     * Convert hex number to hex string with '#' prefix
     *
     * ### Example
     * ```ts
     * new IwFormColor('#FBA8').toHex() // returns: '#FFBBAA88' (with opacity)
     * new IwFormColor('#FBA').toHex()  // returns: '#FFBBAA' (opacity omitted)
     * ```
     *
     * @returns '#'-prefixed hex with opacity
     */
    toHex(): IwFormColorHexString {
        return (
            this.toHexNoOpacity() + (
                this.alphaValue == 0xFF
                    ? ''
                    : this.alphaValue
                        .toString(16)
                        .toUpperCase()
                        .padStart(2, '0')
            )
        ) as IwFormColorHexString
    }

    /**
     * Convert hex number to hex string with '#' prefix, but without opacity
     *
     * ### Example
     * ```
     * new IwFormColor('#FBA8').toHexNoOpacity() // returns: '#FFBBAA' (without opacity)
     * ```
     * @returns '#'-prefixed hex without opacity
     */
    toHexNoOpacity(): IwFormColorHexString {
        return (
            '#' + this.rawValue
                .toString(16)
                .toUpperCase()
                .padStart(6, '0')
        ) as IwFormColorHexString
    }
}

export { IwFormColor }
