<script setup lang='ts'>
import IwFormInputSelectConfig from '../utils/IwFormInputSelectConfig';
import VueMultiselect from 'vue-multiselect';

///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////


///////////////////////////////////////////@  Props, Emits & Variables
//////////////////////////////////////////////////////////////////////
const emit = defineEmits(['changed'])

const props = defineProps({
    config: {
        type: Object as PropType<IwFormInputSelectConfig>,
        required: true,
    },
    disabled: { type: Boolean, default: false }
})

const selectedOption = ref()
if (props.config.selected) selectedOption.value = props.config.selected

/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////
function onSelect(selected: any, id: any) {
    emit('changed', selected)
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

////////////////////////////////////////////////////@  Export & Expose
//////////////////////////////////////////////////////////////////////
</script>

<template>
    <VueMultiselect v-model="selectedOption"
                    @select="onSelect"
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
