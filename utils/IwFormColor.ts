class IwFormColor {
    /** The value of the alpha channel (opacity) (Range: [0, 255]) */
    alphaValue = 0xFF
    /** The name of the colour */
    label?: string
    /** The value of the colour in number */
    rawValue = 0

    constructor(colorStr?: IwFormColorHexString | IwFormColorRgbString | string, label?: string)
    constructor(rgbArray?: IwFormColorRgbArray, label?: string)
    constructor(oldInstance?: IwFormColor, label?: string)
    constructor(rawHex?: number | bigint, label?: string)
    constructor(value?: any, label?: string) {
        if (IwFormColor.isValidHex(value)) {
            // Convert hex string
            [this.rawValue, this.alphaValue] = IwFormColor.hexToValue(value)
        } else if (/^\s*RGB/i.test(value)) {
            // Convert RGB string
            const parsed = value.match(/[0-9.]+/g)
            if (IwFormColor.isRgbArray(parsed)) {
                [this.rawValue, this.alphaValue] = IwFormColor.rgbToValue(parsed)
            }
        } else if (IwFormColor.isRgbArray(value)) {
            // Convert RGB array
            [this.rawValue, this.alphaValue] = IwFormColor.rgbToValue(value)
        } else if (value instanceof IwFormColor) {
            // Convert from IwFormColor instance
            this.alphaValue = value.alphaValue
            this.label = value.label
            this.rawValue = value.rawValue
        } else if (0 <= value && value <= 0xFFFFFF) {
            // Set value only
            this.rawValue = Number(value)
        } else if (0xFFFFFFn < value && value <= 0xFF_FF_FF_FFn) {
            // Set value and alpha
            if (typeof value == 'number') {
                this.rawValue = value >> 8
                this.alphaValue = value & 0xFF
            } else {
                this.rawValue = Number(value >> 8n)
                this.alphaValue = Number(value & 0xFFn)
            }
        } else {
            console.warn(`Received invalid color value of '${value}'(type: ${typeof value})`)
        }

        this.label = label?.trim?.()
    }

    clone(opacity = 1): IwFormColor {
        return new IwFormColor(this.toHexNoOpacity() + (Math.round(opacity * 0xFF)).toString(16))
    }
    /**
     * Convert hex string value to number form
     *
     * Example:
     * ```
     * IwFormColor.hexToValue('#fba')      // returns: [0xffbbaa, 0xFF]
     * IwFormColor.hexToValue('#ffbbaa')   // returns: [0xffbbaa, 0xFF]
     * IwFormColor.hexToValue('#ffbbaa88') // returns: [0xffbbaa, 0x88]
     * ```
     *
     * @param hexString Hex in string form
     *
     * @returns [rawColourValue, alphaValue] The colour in number form and the opacity
     */
    static hexToValue(hexString: string): [number, number] {
        let hex = hexString.replace(/[^0-9A-F]/gi, '')

        if (hex.length == 3 || hex.length == 4) {
            hex = hex.replace(/./g, (c) => c + c)
        }

        if (hex.length == 6 || hex.length == 8) {
            return [
                Number.parseInt(hex.substring(0, 6), 16),
                Number.parseInt(hex.substring(6) || 'FF', 16)
            ]
        }

        return [0x000000, 0xFF]
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
     * Convert RGB(A) array values to hex value in number form
     *
     * @param rgbArray An array of values for [Red, Green, Blue, Alpha?]
     *
     * @returns [rawColourValue, alphaValue] The colour in number form and the opacity
     */
    static rgbToValue(rgbArray: IwFormColorRgbArray): [number, number] {
        const rgbPartsLength = 3
        const rgbWithAlphaPartsLength = 4
        const octet = 8
        let curValue = 0

        for (let i = 0; i < rgbPartsLength; ++i) {
            const valueClamped = Math.min(
                Math.max(0, rgbArray[i]) // Clamp value to 0 or above
                , 255) // Clamp value to 255 or below
                || 0 // Fallback to 0

            /**
             * Shift colour octet for each iteration
             *
             * Example for rgbArray = [0xDB, 0xA3, 0x6D]
             * ---
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
            curValue <<= octet
            curValue += valueClamped
        }

        // Get alpha channel value
        let alphaValue = 0xFF
        if (rgbArray.length == rgbWithAlphaPartsLength) {
            const alphaClamped = Math.min(
                Math.max(
                    0,
                    rgbArray[rgbWithAlphaPartsLength - 1]
                ),
                1
            )
            alphaValue = Math.round(alphaClamped * 255)
        }

        return [curValue, alphaValue]
    }
    /**
     * Sum or subtract instances of IwFormColor class, and saturates at the boundary of the colour values
     *
     * @param c1 A IwFormColor instance
     * @param c2 A IwFormColor instance
     * @param opsType The type of operation (Add or Subtract)
     * @returns A new IwFormColor instance
     */
    static saturatingOps(c1: IwFormColor, c2: IwFormColor, opsType: '-' | '+' = '+'): IwFormColor {
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

        return new IwFormColor(rgb)
    }
    /**
     * Sum the current IwFormColor instance with another IwFormColor instance
     *
     * @param other Another IwFormColor instance
     * @returns A new IwFormColor instance
     */
    saturatingSum(other: IwFormColor): IwFormColor {
        return IwFormColor.saturatingOps(this, other, '+')
    }
    /**
     * Subtract the current IwFormColor instance with another IwFormColor instance
     *
     * @param other Another IwFormColor instance
     * @returns A new IwFormColor instance
     */
    saturatingSub(other: IwFormColor): IwFormColor {
        return IwFormColor.saturatingOps(this, other, '-')
    }

    /**
     * Convert hex number to hex string with '#' prefix
     *
     * ### Example
     * ```ts
     * new IwFormColor('#FBA8').toHex() // returns: '#FFBBAA88' (with opacity)
     * new IwFormColor('#FBA').toHex()  // returns: '#FFBBAA' (opacity omittedd)
     * ```
     *
     * @returns '#'-prefixed hex with opacity
     */
    toHex(): string {
        return this.toHexNoOpacity() + (
            this.alphaValue == 0xFF
                ? ''
                : this.alphaValue.toString(16).toUpperCase().padStart(2, '0')
        )
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
    toHexNoOpacity(): string {
        return '#' + this.rawValue.toString(16).toUpperCase().padStart(6, '0')
    }
}

export { IwFormColor }
