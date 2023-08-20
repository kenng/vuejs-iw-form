<script setup lang='ts'>
import { ref } from 'vue'
import IwFormConfig, { IwFormType } from '../../utils/IwFormConfig';
import IwForm from '../../components/IwForm.vue'
import IwFormInputSelectConfig from '../../utils/IwFormInputSelectConfig';
import IwFormRule from '../../utils/IwFormRule';

const isLoading = ref(false)
const linkedForm1 = ref(null)
const gender = (isMultiple: boolean = false) => new IwFormInputSelectConfig([
    {
        label: 'Male',
        value: 'M',
    },
    {
        label: 'Female',
        value: 'F',
    },
    {
        label: 'Other',
        value: 'O',
    },
], {
    multiple: isMultiple
})

let selectedColorIndex = 0
const colorOptions = [
    {
        label: 'Red',
        value: 'red',
    },
    {
        label: 'Blue',
        value: 'blue',
    },
]
const color = new IwFormInputSelectConfig(colorOptions, {
    multiple: true,
})


const formSelectGender: IwFormConfig = new IwFormConfig({
    formGroups: [{
        css: '',
        formInputs: [
            {
                name: 'gender',
                label: 'gender',
                type: IwFormType.SELECT,
                // selectIsMapOptionToLabel: true,
                selectConfig: gender(),
                onChangeUpdateInput: (item: IwFormInput, val: any, ...extra: any[]) => new Promise((resolve) => {
                    const onChangedRes: IwFormOnChangeUpdateInput = {
                        linkedInputName: 'color',
                        newSelectConfig: color
                    }
                    resolve(onChangedRes)
                }),
                rules: [IwFormRule.gender({})],
            },
            {
                name: 'color',
                label: 'color (changed based on gender)',
                type: IwFormType.SELECT,
                // selectIsMapOptionToLabel: true,
                selectConfig: color,
                rules: [],
            },
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
    <Card title="Select Dropdown (Linked Input using onChangeUpdateInput)"
          :refForm="linkedForm1">
        <template #left>
            <IwForm ref="linkedForm1"
                    :my-form="formSelectGender"
                    :onSubmit="submit">
                <template v-slot:submitBtn>
                    <ButtonSpinner :isLoading="isLoading"
                                   label="Start Download">
                    </ButtonSpinner>
                </template>
            </IwForm>
        </template>
    </Card>
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

