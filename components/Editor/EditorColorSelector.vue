<script setup lang='ts'>
///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////
type ColorObj = {
    /** The colour in string form (E.g. '#fff', 'rgb(0,0,0)', 'rgba(0,0,0,0.5)') */
    value: string,
    /** The name of the colour (E.g. 'Red') */
    label?: string,
}

type HexString = `#${string}`
type RgbArray = [number, number, number] | [number, number, number, number]
type RgbString = `${'RGB' | 'rgb'}(${number},${number},${number})`
    | `${'RGBA' | 'rgba'}(${number},${number},${number},${number})`
///////////////////////////////////////////@  Props, Emits & Variables
//////////////////////////////////////////////////////////////////////
const emit = defineEmits(['change'])

const props = defineProps({
    /** A list of color to be displayed. (E.g. colorList: ['#fff', 'rgb(0,0,0)', '#ffffff88']) */
    colorList: {
        type: Array as PropType<Array<ColorObj>>,
    },
    /**
     * Extended color list
     *
     * Used for extending the default colour list
     */
    extendedColorList: {
        type: Array as PropType<Array<ColorObj>>,
        default: [],
    },
    /**
     * Show or hide the ColorSelector component
     */
    hidden: {
        type: Boolean,
        default: true,
    }
})

class Color {
    /** The value of the alpha channel (opacity) (Range: [0, 255]) */
    alphaValue = 0xFF
    /** The name of the colour */
    label?: string
    /** The value of the colour in number */
    rawValue = 0

    static readonly #valueError = 0xFF00FF

    constructor(colorStr?: HexString | RgbString | string, label?: string)
    constructor(rgbArray?: RgbArray, label?: string)
    constructor(oldInstance?: Color, label?: string)
    constructor(rawHex?: number, label?: string)
    constructor(value?: any, label?: string) {
        if (Color.isValidHex(value)) {
            // Convert hex string
            [this.rawValue, this.alphaValue] = Color.hexToValue(value)
        } else if (/^\s*RGB/i.test(value)) {
            // Convert RGB string
            const parsed = value.match(/\d+/g)
            if (Color.isRgbArray(parsed)) {
                [this.rawValue, this.alphaValue] = Color.rgbToValue(parsed)
            }
        } else if (Color.isRgbArray(value)) {
            // Convert RGB array
            [this.rawValue, this.alphaValue] = Color.rgbToValue(value)
        } else if (value instanceof Color) {
            // Convert from Color instance
            this.alphaValue = value.alphaValue
            this.label = value.label
            this.rawValue = value.rawValue
        } else if (typeof value == 'number' && 0 <= value && value <= 0xFFFFFF) {
            // Set value only
            this.rawValue = value
        } else if (typeof value == 'number' && 0xFFFFFF < value && value <= 0xFF_FF_FF_FF) {
            // Set value and alpha
            const channelOctet = 8
            this.rawValue = value >> channelOctet
            this.alphaValue = value & 0xFF
        } else {
            console.warn(`Received invalid color value of '${value}'(type: ${typeof value})`)
        }

        this.label = label?.trim?.()
    }

    clone(opacity = 1): Color {
        return new Color(this.toHexNoOpacity() + (Math.round(opacity * 0xFF)).toString(16))
    }
    /**
     * Convert hex string value to number form
     *
     * Example:
     * ```
     * Color.hexToValue('#fba')      // returns: [0xffbbaa, 0xFF]
     * Color.hexToValue('#ffbbaa')   // returns: [0xffbbaa, 0xFF]
     * Color.hexToValue('#ffbbaa88') // returns: [0xffbbaa, 0x88]
     *
     * Color.hexToValue('#')         // returns: [0xFF00FF, 0xFF] (error)
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

        return [this.#valueError, 0xFF]
    }

    /**
     * Check if value is a valid hex string
     *
     * @param hexString The colour value in hex string form
     */
    static isValidHex(hexString: string): hexString is HexString {
        return /^#([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8})\s*$/i.test(hexString)
    }

    /**
     * Check if the value given matches a RGB(A) value
     *
     * @param rgbArray An array of values for [Red, Green, Blue, Alpha?]
     */
    static isRgbArray(rgbArray: Array<any>): rgbArray is RgbArray {
        if (Array.isArray(rgbArray)) {
            // Make use of 'is' for rgbArray: any[]
            const matchRgbLength = rgbArray.length == 3
            const matchRgbaLength = rgbArray.length == 4
            const hasInvalidValue = rgbArray.slice(0, 3).includes((val: number) => val < 0 || val > 255)
            const validAlphaValue = 0 <= rgbArray.at(-1) && rgbArray.at(-1) <= 1

            return (matchRgbLength || (matchRgbaLength && validAlphaValue)) && !hasInvalidValue
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
    static rgbToValue(rgbArray: RgbArray): [number, number] {
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
     * Convert hex number to hex string with '#' prefix
     *
     * ### Example
     * ```ts
     * new Color('#FBA8').toHex() // returns: '#FFBBAA88' (with opacity)
     * new Color('#FBA').toHex()  // returns: '#FFBBAA' (opacity omittedd)
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
     * new Color('#FBA8').toHexNoOpacity() // returns: '#FFBBAA' (without opacity)
     * ```
     * @returns '#'-prefixed hex without opacity
     */
    toHexNoOpacity(): string {
        return '#' + this.rawValue.toString(16).toUpperCase().padStart(6, '0')
    }
}

let currentSelection = ref(new Color('#ff0'))

const defaultColorList: Color[] = [
    new Color(0xDBA36D, 'Primary'),
    new Color(0x000, 'Black'),
    new Color(0xFF0000, 'Red'),
    new Color(0xFFA500, 'Orange'),
    new Color(0xFFFF00, 'Yellow'),
    new Color(0x00FF00, 'Green'),
    new Color(0x0000FF, 'Blue'),
    new Color(0x00FFFF, 'Aqua'),
    new Color(0xFF00FF, 'Magenta'),
]

const colorListInUse: Ref<Array<Color>> = ref([])
/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////
/**
 * Used for converting colour passed in by props from parent component
 *
 * @param colorList The list of colour
 */
function convertCustomColorList(colorList: Array<ColorObj>): Color[] {
    return colorList.map(color =>
        new Color(color.value, color.label)
    )
}
/**
 * Handles color icons click event
 */
function switchColor(value: string) {
    currentSelection.value = new Color(value)
    emit('change', currentSelection.value)
}
/////////////////////////////////////////////////////////@  Lifecycles
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////@ Initialization
//////////////////////////////////////////////////////////////////////
onMounted(() => {
    // Select a colour list to use
    colorListInUse.value = props.colorList?.length
        ? convertCustomColorList(props.colorList)
        : defaultColorList.concat(convertCustomColorList(props.extendedColorList))
})
////////////////////////////////////////////////////@  Export & Expose
//////////////////////////////////////////////////////////////////////
defineExpose({
    value: computed(() => currentSelection.value.toHex()),
})
</script>

<template>
    <Transition name="fade">
        <div v-show="props.hidden"
             class="absolute bg-slate-100/95 cursor-default grid mt-8 p-2 rounded-sm shadow translate-x-1/2 translate-y-1/2 w-40"
             title=""> <!-- Stop title inheritance -->
            <ul class="grid grid-cols-6 place-content-center gap-2">
                <li class="outline outline-px hover:!rounded-4 rounded-md transition-all"
                    :style="{ backgroundColor: color.toHex(), outlineColor: color.clone(0.3).toHex() }"
                    :key="key"
                    :title="color.label ?? ''"
                    v-for="(color, key) in colorListInUse"
                    @click="(ev: Event) => switchColor((ev.target as HTMLLIElement).style.backgroundColor)">
                </li>
            </ul>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .25s
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0
}

ul>* {
    cursor: pointer;
    width: 1rem;
    height: 1rem;
}
</style>
