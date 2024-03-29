<script setup lang='ts'>

///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////
import { Icon } from '@iconify/vue'


///////////////////////////////////////////@  Props, Emits & Variables
//////////////////////////////////////////////////////////////////////
const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
    helperText: {
        type: String,
        default: '',
    },
    icon: {
        type: String,
    },
    id: {
        type: String,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
    },
    onClick: {
        type: Function as PropType<() => any>,
    },
    type: {
        type: String as PropType<IwFormBtnType>,
        default: 'submit'
    },
})

/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////@  Lifecycles
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////@ Initialization
//////////////////////////////////////////////////////////////////////
const btnId = props.id ?? (new Date()).getTime() + Math.random() * 10000

////////////////////////////////////////////////////@  Export & Expose
//////////////////////////////////////////////////////////////////////
</script>

<template>
    <div class="iwFormBtnWrapper">
        <div class="iwFormInputLabelInlineWrapper iwFormSubmitBtnLabel">
            <span class="iwFormInputLabelInline">
            </span>
        </div>
        <button :id="`${btnId}-submit-btn`"
                class="iwFormSubmitBtn"
                :class="{ 'iwFormBtnDisabled': disabled || isLoading }"
                :disabled="disabled || isLoading"
                :type="type"
                @click="ev => !isLoading && onClick">
            <span class="iwFormBtnLabel">
                <Icon v-if="icon"
                      :icon="icon"></Icon>
                {{ label }}
            </span>
            <span class="iwFormBtnSpinner">
                <svg v-show="isLoading"
                     class="w-5 h-5 text-white animate-spin absolute left-1/2 -ml-2.5 transform"
                     fill="none"
                     viewBox="0 0 24 24">
                    <circle class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"></circle>
                    <path class="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          fill="currentColor">
                    </path>
                </svg>
            </span>
        </button>
        <p class="iwFormInputHelperText">{{ helperText }}</p>
    </div>
</template>
