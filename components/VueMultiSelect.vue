<script setup lang='ts'>
import { ref, PropType } from 'vue'
import IwFormInputSelectConfig from '../utils/IwFormInputSelectConfig';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css'

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
        const selected = props.config.selected
        if (typeof selected === 'object' && null == selected['value']) {
            console.error(selected)
            console.error('selected value should not be null')
            return
        }
        selectedOption.value = props.config.options.find(
            option => option[keyName] == selected
        )

        emit('changed', { value: getSelectedKeys() }, selectedOption.value)
    }
}

function getSelectedKeys(): IwFormInputSelectedKeys {
    if (!Array.isArray(selectedOption.value)) {
        return selectedOption.value![keyName]
    } else {
        const keys: any = []
        selectedOption.value.forEach(item => keys.push(item[keyName]))
        return keys
    }
}

function onSelect(selected: IwFormInputSelectOption, id: any) {
    emit('changed', getSelectedKeys(), selectedOption.value, selected)
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
                    :selectLabel="props.config.selectLabel"
                    :taggable="props.config.taggable"
                    :tagPlaceholder="props.config.tagPlaceholder" />
</template>
