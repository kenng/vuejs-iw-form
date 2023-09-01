<script setup lang='ts'>
import { ref } from 'vue'
import IwFormConfig, { IwFormType } from '../../utils/IwFormConfig';
import IwForm from '../../components/IwForm.vue'
import IwFormInputSelectConfig from '../../utils/IwFormInputSelectConfig';
import IwFormRule from '../../utils/IwFormRule';
import FormCard from '../components/FormCard.vue'

const isLoading = ref(false)
const demo01 = ref(null)

const countries = (isMultiple: boolean, selected: IwFormInputSelectedKeys) => new IwFormInputSelectConfig([
    {
        label: 'Malaysia',
        value: 'MY',
    },
    {
        label: 'Singapore',
        value: 'SG',
    },
    {
        label: 'Other',
        value: 'O',
    },
], {
    multiple: isMultiple,
    selected,
})

const demoSelectMultiple: IwFormConfig = new IwFormConfig({
    formGroups: [{
        css: '',
        formInputs: [
            {
                name: 'countries',
                type: IwFormType.SELECT,
                label: 'Select country',
                selectConfig: countries(false, 'MY'),
                rules: [IwFormRule.required]
            },
            {
                name: 'countries_related',
                type: IwFormType.SELECT,
                label: 'Select all the related countries (multiple choices)',
                selectConfig: countries(true, ['MY', 'SG']),
                rules: [IwFormRule.required]
            }
        ],
    }
    ]
})


function submit(formData: Record<string, any>) {
    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
    }, 4000)
}
</script>

<template>
    <FormCard title="Select Dropdown (Simple)"
              :refForm="demo01">
        <IwForm ref="demo01"
                :my-form="demoSelectMultiple"
                :onSubmit="submit">
        </IwForm>
    </FormCard>
</template>

<style scoped>
.viBtn {
    position: relative;
    margin: 0.25rem;
    display: inline-flex;
    align-items: center;
    border-radius: 0.5rem;
    background-color: rgba(2, 132, 199, 1);
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    text-align: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
}

.viBtn:hover {
    --un-bg-opacity: 1;
    background-color: rgb(1, 99, 149);
}
</style>

