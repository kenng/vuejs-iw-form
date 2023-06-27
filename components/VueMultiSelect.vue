<script setup lang='ts'>
import { ref, PropType } from 'vue';
import IwFormInputSelectConfig from '../utils/IwFormInputSelectConfig';
import VueMultiselect from 'vue-multiselect';

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

const keyName = props.config.keyName

const selectedOption = ref<IwFormInputSelectOption | Array<IwFormInputSelectOption>>()


/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////
function initSelected() {
    if (props.config.selected) {
        selectedOption.value = props.config.options.find(
            option => option[keyName] == props.config.selected
        )

        emit('changed', { value: getSelectedKeys() }, selectedOption.value)
    }
}

function getSelectedKeys() {
    if (!Array.isArray(selectedOption.value)) {
        return selectedOption.value![keyName]
    } else {
        const keys: any = []
        selectedOption.value.forEach(item => keys.push[item[keyName]])
        return selectedOption.value
    }
}

function onSelect(selected: IwFormInputSelectOption, id: any) {
    emit('changed', { value: getSelectedKeys() }, selectedOption.value, selected)
}

function onRemove(removed: IwFormInputSelectOption, id: any) {
    emit('removed', getSelectedKeys(), selectedOption.value, removed)
}

function onInput(value: any, id: any) {
}

function getTrackBy(config: IwFormInputSelectConfig) {
    return config.isOptionObject ? config.keyName : null
}

function getLabelBy(config: IwFormInputSelectConfig) {
    return config.isOptionObject ? config.labelName : null
}

/////////////////////////////////////////////////////////@  Lifecycles
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////@ Initialization
//////////////////////////////////////////////////////////////////////

initSelected();

////////////////////////////////////////////////////@  Export & Expose
//////////////////////////////////////////////////////////////////////
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
                    :taggable="props.config.taggable"
                    :tagPlaceholder="props.config.tagPlaceholder" />
</template>

<style scoped>
</style>
