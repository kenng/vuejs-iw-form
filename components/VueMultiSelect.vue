<script setup lang='ts'>
import { PropType } from 'vue'
import IwFormInputSelectConfig from '../utils/IwFormInputSelectConfig';
import VueMultiselect from 'vue-multiselect';
import useVueMultiSelect from '../composables/useVueMultiSelect';

///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////


///////////////////////////////////////////@  Props, Emits & Variables
//////////////////////////////////////////////////////////////////////
const emit = defineEmits(['changed', 'removed'])

const props = defineProps({
    config: {
        type: Object as PropType<IwFormInputSelectConfig>,
        required: true,
    },
    disabled: { type: Boolean, default: false }
})


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

/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////

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
defineExpose({ onReset })
</script>

<template>
    <VueMultiselect v-model="selectedOption"
                    @select="onSelect"
                    @remove="onRemove"
                    @input="onInput"
                    :label="getLabelBy(props.config)"
                    :track-by="getTrackBy(props.config)"
                    :allowEmpty="props.config.allowEmptySelect"
                    :closeOnSelect="props.config.closeOnSelect"
                    :disabled="props.disabled"
                    :hideOnSelect="props.config.hideOnSelect"
                    :loading="props.config.showLoading"
                    :options="props.config.options"
                    :optionsLimit="props.config.optionsLimit"
                    :placeholder="props.config.placeholder"
                    :max="props.config.maxSelected"
                    :multiple="props.config.multiple"
                    :searchable="props.config.searchable"
                    :selectLabel="props.config.selectLabel"
                    :taggable="props.config.taggable"
                    :tagPlaceholder="props.config.tagPlaceholder" />
</template>
