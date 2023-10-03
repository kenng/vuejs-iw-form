<script setup lang='ts'>
import { PropType } from 'vue'
import IwFormInputSelectConfig from '../utils/IwFormInputSelectConfig';
import VueMultiselect from 'vue-multiselect';
import useVueMultiSelect from '../composables/useVueMultiSelect';

///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////


///////////////////////////////////////////@  Props, Emits & Variables
//////////////////////////////////////////////////////////////////////
const emit = defineEmits(['changed', 'removed', 'searchChanged'])

const props = defineProps({
    attributes: {
        type: Object,
        default: {},
    },
    config: {
        type: Object as PropType<IwFormInputSelectConfig>,
        required: true,
    },
    disabled: { type: Boolean, default: false },
    id: {
        type: String,
    },
})

const selectRef = ref<VueMultiselect>()

const {
    // variables
    keyName,
    selectedOption,

    // functions
    getLabelBy,
    getSelectedKeys,
    getTrackBy,
    initSelected,
    onInput,
    onReset,
} = useVueMultiSelect(props)


const options = computed(() => props.config.options)
const showLoading = computed(() => props.config.showLoading)
/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////

function debounce(func: Function, delay: number) {
    let timeout: any
    return function (this: unknown, ...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    }
}

const onSearchChange = debounce((query: string) => {
    emit('searchChanged', query)
}, 1000)

function onSelect(selected: IwFormInputSelectOption, id: any) {
    emit('changed', getSelectedKeys(), selectedOption.value, selected)
}

function onRemove(removed: IwFormInputSelectOption, id: any) {
    emit('removed', getSelectedKeys(), selectedOption.value, removed)
}

function init() {
    if (props.config.selected) {
        initSelected();
        emit('changed', getSelectedKeys(), selectedOption.value, selectedOption.value)
    }
}


/////////////////////////////////////////////////////////@  Lifecycles
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////@ Initialization
//////////////////////////////////////////////////////////////////////

init()

////////////////////////////////////////////////////@  Export & Expose
//////////////////////////////////////////////////////////////////////
defineExpose({
    activate: computed(() => selectRef.value?.activate),
    deactivate: computed(() => selectRef.value?.deactivate),
    onReset,
})
</script>

<template>
    <VueMultiselect v-model="selectedOption"
                    @select="onSelect"
                    @remove="onRemove"
                    @input="onInput"
                    @searchChange="onSearchChange"
                    :label="getLabelBy(props.config)"
                    :track-by="getTrackBy(props.config)"
                    :allowEmpty="props.config.allowEmptySelect"
                    :closeOnSelect="props.config.closeOnSelect"
                    :disabled="props.disabled"
                    :hideOnSelect="props.config.hideOnSelect"
                    :id="id"
                    :loading="showLoading"
                    :options="options"
                    :optionsLimit="props.config.optionsLimit"
                    :placeholder="props.attributes.placeholder ?? props.config.placeholder"
                    :preventAutofocus="props.attributes.preventAutofocus ?? !props.config.autofocus"
                    :max="props.config.maxSelected"
                    :multiple="props.config.multiple"
                    ref="selectRef"
                    :searchable="props.config.searchable"
                    :selectLabel="props.config.selectLabel"
                    :showNoResults="props.config.showNoResults"
                    :taggable="props.config.taggable"
                    :tagPlaceholder="props.config.tagPlaceholder">
        >
        <template v-if="props.config.searchFailedText"
                  #noResult>
            <p>{{ props.config.searchFailedText }}</p>
        </template>
    </VueMultiselect>
</template>
