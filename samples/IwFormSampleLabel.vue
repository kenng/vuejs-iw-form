<script setup lang='ts'>
import { ref } from 'vue'
import FormCard from './components/FormCard.vue';
import IwFormConfig from '../utils/IwFormConfig';
import IwForm from '../components/IwForm.vue';
import IwFormInputSelectConfig from '../utils/IwFormInputSelectConfig';

const refForm = ref()
const form = new IwFormConfig({
    formGroups: [{
        css: 'grid md:grid-cols-1',
        formInputs: [
            {
                type: 'text',
                name: 'username',
                label: 'User Name',
                required: true,
                tooltip: 'Type your username'
            },
            {
                type: 'select',
                hasLabelForAttr: false,
                name: 'leftHander',
                label: 'Left-handed',
                required: true,
                tooltip: 'Tell us if you are left-handed',
                selectConfig: new IwFormInputSelectConfig(
                    [
                        { label: 'Yes', value: 'Y' },
                        { label: 'No', value: 'N' },
                    ]
                ),
            },
            {
                type: 'textarea',
                name: 'bio',
                label: 'Biography',
                required: true,
                tooltip: 'Tell us something about yourself'
            },
        ],
    }],
})
</script>

<template>
    <div>
        <FormCard title="Basic Form"
                  :refForm="refForm">
            <IwForm ref="refForm"
                    data-test="iw-form-basic"
                    :myForm="form"></IwForm>
        </FormCard>
    </div>
</template>
