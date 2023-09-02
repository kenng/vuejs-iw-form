<script setup lang='ts'>
import { ref } from 'vue'
import FormCard from './components/FormCard.vue';
import IwFormConfig from '../utils/IwFormConfig';
import IwFormRule from '../utils/IwFormRule';
import IwForm from '../components/IwForm.vue';

const refForm = ref()
const form = new IwFormConfig({
    formData: {
        // company_name is defined, the company_name varialbe will be kept
        company_name: 'ABC Company',
        password: 'password123',
        password_confirmed: 'password123',
        newUser: '1',
    },
    formGroups: [{
        css: 'grid md:grid-cols-2',
        formInputs: [
            {
                type: 'text',
                name: 'username',
                label: 'User Name',
                cssWrapper: 'col-span-full',
                required: true,
                rules: [IwFormRule.minLength({ minLength: 3 })],
            },
            {
                type: 'password',
                name: 'password',
            },
            {
                type: 'password',
                name: 'password_confirmed',
                ref: 'ref_password_confirmed',
                label: 'Confirm Password',
                rules: [IwFormRule.match({
                    errMsg: 'value must match to password',
                    formName: 'password',
                })],
            },
            {
                type: 'separator',
                cssWrapper: 'col-span-full my-4',
            },
            {
                name: 'email',
                label: 'email',
                type: 'email',
                required: true,
                rules: [IwFormRule.required, IwFormRule.email({ required: true })],
            },
            {
                name: 'number',
                label: 'number not null',
                type: 'number',
                rules: [
                    IwFormRule.minLength({ minLength: 3 }),
                    IwFormRule.notNull({}),
                    IwFormRule.isNumber({}),
                ],
            },
            {
                type: 'separator',
                cssWrapper: 'col-span-full my-4',
            },
            {
                type: 'label',
                label: 'Additional Info',
                cssWrapper: 'col-span-full text-2xl mb-4',
            },
            {
                type: 'textarea',
                name: 'remarks',
                cssWrapper: 'col-span-full',
            },
            {
                type: 'checkbox',
                name: 'newUser',
                label: 'Is New User',
                checkBoxTrueValue: '1',
                checkBoxFalseValue: '0',
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
