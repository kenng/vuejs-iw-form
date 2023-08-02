<script setup lang='ts'>
import { ref } from 'vue'
import IwFormConfig, { IwFormType } from '../utils/IwFormConfig';
import IwForm from '../components/IwForm.vue'

const isLoading = ref(false)
const form = new IwFormConfig({
    formGroups: [{
        formInputs: [
            {
                name: 'company_name',
                label: 'Company Name',
                type: IwFormType.TEXTGROUP_TEXT,
            },
        ]
    }]
})

function submit(formData: Record<string, any>) {
    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
    }, 4000)
}
</script>

<template>
    <IwForm :my-form="form"
            :onSubmit="submit">
        <template v-slot:submitBtn>
            <ButtonSpinner :isLoading="isLoading"
                           label="Start Download">
            </ButtonSpinner>
        </template>
    </IwForm>
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

