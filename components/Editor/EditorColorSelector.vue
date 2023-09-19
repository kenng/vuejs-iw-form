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
    },
    /*
     * Show a 'bx:block' icon for removing current colour
     *
     * An invisible colour will be returned (E.g. '#fff0').
     * {@link Color.isTransparent} may be used to check if the colour is returned.
     */
    showClearColor: {
        type: Boolean,
        default: true,
    }
})


let currentSelection = ref(new IwFormColor('#ff0'))

const defaultColorList: IwFormColor[] = [
    new IwFormColor(0x1ABC9C, 'Strong Cyan'),
    new IwFormColor(0x2ECC71, 'Emerald'),
    new IwFormColor(0x3498DB, 'Bright Blue'),
    new IwFormColor(0x9B59B6, 'Amethyst'),
    new IwFormColor(0x4E5F70, 'Grayish Blue'),
    new IwFormColor(0xF1C40F, 'Vivid Yellow'),
    new IwFormColor(0x16A085, 'Dark Cyan'),
    new IwFormColor(0x27AE60, 'Dark Emerald'),
    new IwFormColor(0x2980B9, 'Strong Blue'),
    new IwFormColor(0x8E44AD, 'Dark Violet'),
    new IwFormColor(0x2C3E50, 'Desaturated Blue'),
    new IwFormColor(0xF39C12, 'Orange'),
    new IwFormColor(0xE67E22, 'Carrot'),
    new IwFormColor(0xE74C3C, 'Pale Red'),
    new IwFormColor(0xECF0F1, 'Bright Silver'),
    new IwFormColor(0x95A5A6, 'Light Grayish Cyan'),
    new IwFormColor(0xDDDDDD, 'Light Gray'),
    new IwFormColor(0xFFFFFF, 'White'),
    new IwFormColor(0xD35400, 'Pumpkin'),
    new IwFormColor(0xC0392B, 'Strong Red'),
    new IwFormColor(0xBDC3C7, 'Silver'),
    new IwFormColor(0x7F8C8D, 'Grayish Cyan'),
    new IwFormColor(0x999999, 'Dark Gray'),
    new IwFormColor(0x000000, 'Black'),
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
        new IwFormColor(color.value, color.label)
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
    colorListInUse.value.push(new IwFormColor(color))

    if (document.getSelection()?.toString?.()) {
        switchColor(color)

        ev.preventDefault() // Prevent text selection being unselected
    }
}

/**
 * Handles color icons click event
 */
function switchColor(value: string) {
    currentSelection.value = new IwFormColor(value)
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
                <li class="border border-px hover:!rounded-4 rounded-md transition-all"
                    :style="{
                        backgroundColor: color.toHex(),
                        borderColor: color.saturatingSub(new IwFormColor('#222')).toHex()
                    }"
                    :key="key"
                    :title="color.label ?? color.toHex()"
                    v-for="(color, key) in colorListInUse"
                    @click="(ev: Event) => switchColor((ev.target as HTMLLIElement).style.backgroundColor)">
                </li>
                <li title="Clear"
                    v-if="props.showClearColor"
                    @click="(ev: Event) => switchColor('#fff0')">
                    <Icon class="!block !color-slate-700 h-full w-full"
                          icon="bx:block"
                          ref="clearColorRef"
                          :onLoad="/*todo: trim excess padding*/clearColorRef?.setAttribute?.('viewBox', '2 2 20 20')" />
                </li>
            </ul>
            <tippy class="h-5 m-auto !mt-2 w-8"
                   content="Choose and press 'Enter ↵' to add colour"
                   placement="right">
                <input class="cursor-pointer w-full h-full"
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

ul>* {
    cursor: pointer;
    width: 1rem;
    height: 1rem;
}
</style>
