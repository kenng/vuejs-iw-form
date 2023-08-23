<script setup lang='ts'>
import { ref } from 'vue'
import IwForm from '../../components/IwForm.vue';
import IwFormCalendar from '../../utils/IwFormCalendar';
import IwFormConfig from '../../utils/IwFormConfig';
import FormCard from '../components/FormCard.vue';

const refForm = ref()
const form = new IwFormConfig({
    formGroups: [
        {
            formInputs: [
                {
                    type: 'date',
                    name: 'Start Date',
                    label: 'Start Date',
                    required: true,
                    dateOptions: new IwFormCalendar({
                        value: '2023-08-21'
                    })
                }
            ]
        },
    ]
})
</script>

<template>
    <FormCard title="Date Time (Basic)"
              :refForm="refForm">
        <IwForm ref="refForm"
                :myForm="form"></IwForm>
    </FormCard>
</template>
