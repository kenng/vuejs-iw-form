<script setup lang='ts'>
import { ref } from 'vue'
import IwForm from '../components/IwForm.vue';
import FormCard from './components/FormCard.vue';
import IwFormConfig from '../utils/IwFormConfig';
import '../css/EditorTipTap.css'
import '../css/IwForm.css'
import '../css/EditorTipTap.css'

const refForm = ref()
const editor: IwFormInputEditor = {
    type: 'editor',
    name: 'editor',
    config: {
        content: 'Hello world.....',
    }
}
const myForm = new IwFormConfig({
    formGroups: [
        {
            css: '',
            formInputs: [
                editor,
            ]
        }
    ]
})
</script>

<template>
    <FormCard title="Basic Form"
              :refForm="refForm">
        <IwForm ref="refForm"
                :myForm="myForm" />

    </FormCard>
</template>

<style scoped>
</style>
