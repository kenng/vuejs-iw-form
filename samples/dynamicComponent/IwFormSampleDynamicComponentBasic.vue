<script setup lang='ts'>
import { ref } from 'vue'
import IwFormSampleDynamicComponent from './IwFormSampleDynamicComponent.vue';
import IwForm from '../../components/IwForm.vue';
import IwFormConfig from '../../utils/IwFormConfig';
import FormCard from '../components/FormCard.vue';

const form = new IwFormConfig({
    formGroups: [
        {
            css: '',
            formInputs: [
                {
                    name: 'formWithDynamicComponent',
                    type: 'component',
                    component: IwFormSampleDynamicComponent,
                },
            ],
        }
    ]
})
const refForm = ref()
</script>

<template>
    <FormCard title="Form With Dynamic Component"
              :refForm="refForm">
        <IwForm ref="refForm"
                :myForm="form" />
    </FormCard>
</template>
