<script setup lang='ts'>
///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////
import { Icon } from '@iconify/vue'
import { Tippy } from 'vue-tippy'
import { IwFormColor } from '../../utils/IwFormColor'

type ColorObj = {
    /** The colour in string form (E.g. '#fff', 'rgb(0,0,0)', 'rgba(0,0,0,0.5)') */
    value: string,
    /** The name of the colour (E.g. 'Red') */
    label?: string,
}
///////////////////////////////////////////@  Props, Emits & Variables
//////////////////////////////////////////////////////////////////////
const emit = defineEmits(['change'])

const props = defineProps({
    /** A list of color to be displayed. (E.g. colorList: ['#fff', 'rgb(0,0,0)', '#ffffff88']) */
    colorList: {
        type: Array as PropType<Array<ColorObj>>,
        default: [],
    },
    /**
     * Show or hide the ColorSelector component
     */
    hidden: {
        type: Boolean,
        default: true,
    },
    /**
     * Whether to replace the default colour list with the supplied colorList
     *
     * Default: `false`
     */
    replaceDefault: {
        type: Boolean,
        default: false,
    },
    /**
     * Show a 'bx:block' icon for removing the currently applied colour
     *
     * An invisible colour will be returned (E.g. '#fff0').
     * {@link Color.isTransparent} may be used to check if the colour is returned.
     */
    showClearColor: {
        type: Boolean,
        default: true,
    }
})


let currentSelection = ref(new IwFormColor(0xFFFF00))

const defaultColorList: IwFormColor[] = [
    new IwFormColor(0x1ABC9C, 0xFF, 'Strong Cyan'),
    new IwFormColor(0x2ECC71, 0xFF, 'Emerald'),
    new IwFormColor(0x3498DB, 0xFF, 'Bright Blue'),
    new IwFormColor(0x9B59B6, 0xFF, 'Amethyst'),
    new IwFormColor(0x4E5F70, 0xFF, 'Grayish Blue'),
    new IwFormColor(0xF1C40F, 0xFF, 'Vivid Yellow'),
    new IwFormColor(0x16A085, 0xFF, 'Dark Cyan'),
    new IwFormColor(0x27AE60, 0xFF, 'Dark Emerald'),
    new IwFormColor(0x2980B9, 0xFF, 'Strong Blue'),
    new IwFormColor(0x8E44AD, 0xFF, 'Dark Violet'),
    new IwFormColor(0x2C3E50, 0xFF, 'Desaturated Blue'),
    new IwFormColor(0xF39C12, 0xFF, 'Orange'),
    new IwFormColor(0xE67E22, 0xFF, 'Carrot'),
    new IwFormColor(0xE74C3C, 0xFF, 'Pale Red'),
    new IwFormColor(0xECF0F1, 0xFF, 'Bright Silver'),
    new IwFormColor(0x95A5A6, 0xFF, 'Light Grayish Cyan'),
    new IwFormColor(0xDDDDDD, 0xFF, 'Light Gray'),
    new IwFormColor(0xFFFFFF, 0xFF, 'White'),
    new IwFormColor(0xD35400, 0xFF, 'Pumpkin'),
    new IwFormColor(0xC0392B, 0xFF, 'Strong Red'),
    new IwFormColor(0xBDC3C7, 0xFF, 'Silver'),
    new IwFormColor(0x7F8C8D, 0xFF, 'Grayish Cyan'),
    new IwFormColor(0x999999, 0xFF, 'Dark Gray'),
    new IwFormColor(0x000000, 0xFF, 'Black'),
]

const colorListInUse: Ref<Array<IwFormColor>> = ref([])
const clearColorRef = ref()
/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////
/**
 * Used for converting colour passed in by props from parent component
 *
 * @param colorList The list of colour
 */
function convertCustomColorList(colorList: Array<ColorObj>): IwFormColor[] {
    return colorList.map(color =>
        IwFormColor.initFromString(color.value, color.label)
    )
}
/**
 * Handles custom colour picker change. New colour will be added to the list.
 *
 * If a text is selected, the colour will be automatically applied.
 */
function insertColor(ev: Event) {
    const color = (ev.target as HTMLInputElement).value
    // TODO: check if a color exist before appending
    colorListInUse.value.push(IwFormColor.initFromString(color))

    if (document.getSelection()?.toString?.()) {
        switchColor(color)

        ev.preventDefault() // Prevent text selection being unselected
    }
}

/**
 * Handles color icons click event
 */
function switchColor(value: string) {
    currentSelection.value = IwFormColor.initFromString(value)
    emit('change', currentSelection.value)
}
/////////////////////////////////////////////////////////@  Lifecycles
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////@ Initialization
//////////////////////////////////////////////////////////////////////
onMounted(() => {
    const customColorList = convertCustomColorList(props.colorList)

    // Check to replace or join the colour lists
    colorListInUse.value = props.replaceDefault
        ? customColorList
        : defaultColorList.concat(customColorList)
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
             class="iw-form-editor-menu-dropdown translate-x-1/2"
             title=""> <!-- Stop title inheritance -->
            <ul class="iw-form-editor-menu-dropdown-colorlist">
                <li v-for="(color, key) in colorListInUse"
                    :style="{
                        backgroundColor: color.toHex(),
                        borderColor: color.darkenBy(IwFormColor.initFromHex('#222')).toHex()
                    }"
                    :key="key"
                    :title="color.label ?? color.toHex()"
                    @click="(ev: Event) => switchColor((ev.target as HTMLLIElement).style.backgroundColor)">
                </li>
                <li v-if="props.showClearColor"
                    title="Clear"
                    @click="(ev: Event) => switchColor('#fff0')">
                    <Icon class="!block hover:!color-slate-500 !color-slate-700 h-full w-full transition-all"
                          icon="bx:block"
                          ref="clearColorRef"
                          :onLoad="/*todo: trim excess padding*/clearColorRef?.setAttribute?.('viewBox', '2 2 20 20')" />
                </li>
            </ul>
            <tippy class="iw-form-editor-menu-dropdown-custom-color"
                   content="Choose and press 'Enter ↵' to add colour"
                   placement="right">
                <input class="cursor-pointer h-full w-full"
                       name="Custom color"
                       type="color"
                       value="#ffffff"
                       @change="insertColor" />
            </tippy>
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
</style>
