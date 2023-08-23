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
    multiple: isMultiple,
    selected: 'F'
})

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
const colorSelectConfig = (selected?: IwFormInputSelectedKeys) => new IwFormInputSelectConfig(colorOptions, {
    multiple: true,
    selected,
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
                onChange: (item: any,
                    val: IwFormInputSelectedKeys,
                    selectedRaw: IwFormInputSelectedOption,
                    justSelected: IwFormInputSelectedOption,
                    theForm: IwFormConfig) => {
                    console.log(item)
                    console.log(val)
                    console.log(selectedRaw)
                    console.log(justSelected)

                    // --- update color dropdown
                    let selectedColor = 'blue'
                    if ('F' === val) {
                        selectedColor = 'red'
                    }
                    theForm.updateSelectInput('color', colorSelectConfig([selectedColor]))
                },
                rules: [IwFormRule.gender({})],
            },
            {
                name: 'color',
                label: 'color (changed based on gender)',
                type: IwFormType.SELECT,
                // selectIsMapOptionToLabel: true,
                selectConfig: colorSelectConfig(),
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
    <FormCard title="Select Dropdown (Linked Input using onChange)"
              :refForm="linkedForm1">
        <template #default>
            <IwForm ref="linkedForm1"
                    :my-form="formSelectGender"
                    :onSubmit="submit">
            </IwForm>
        </template>
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

