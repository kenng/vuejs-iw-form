<script setup lang='ts'>
import IwForm from '../../components/IwForm.vue';
import IwFormCalendar from '../../utils/IwFormCalendar';
import IwFormConfig from '../../utils/IwFormConfig';

const form = new IwFormConfig({
    formGroups: [
        {
            formInputs: [
                {
                    type: 'date',
                    name: 'Start Date',
                    label: 'Start Date',
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
    <IwForm :myForm="form"></IwForm>
</template>
