<script setup lang='ts'>
import { ref } from 'vue'
import IwFormConfig, { IwFormType } from '../../utils/IwFormConfig';
import IwForm from '../../components/IwForm.vue'
import IwFormInputSelectConfig from '../../utils/IwFormInputSelectConfig';
import IwFormRule from '../../utils/IwFormRule';
import FormCard from '../components/FormCard.vue';

const isLoading = ref(false)
const linkedForm1 = ref(null)
const gender = (isMultiple: boolean = false, selected?: IwFormInputSelectedKeys) => new IwFormInputSelectConfig([
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
    selected,
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
const color = (selected?: IwFormInputSelectedKeys) => new IwFormInputSelectConfig(colorOptions, {
    selected,
})


const formSelectGender: IwFormConfig = new IwFormConfig({
    formGroups: [{
        css: '',
        formInputs: [
            {
                name: 'gender',
                label: 'gender',
                type: 'select',
                // selectIsMapOptionToLabel: true,
                selectConfig: gender(false, 'M'),
                onChangeUpdateInput: (item: IwFormInput, val: any, ...extra: any[]) => {
                    let selected = 'blue'
                    if ('F' == val) selected = 'red'
                    const onChangedRes: IwFormOnChangeUpdateInput = {
                        linkedInputName: 'color',
                        newSelectConfig: color(selected)
                    }

                    return onChangedRes
                },
                rules: [IwFormRule.gender({})],
            },
            {
                name: 'color',
                label: 'color (changed based on gender)',
                type: 'select',
                // selectIsMapOptionToLabel: true,
                selectConfig: color(),
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
    <FormCard title="Select Dropdown (Linked Input using onChangeUpdateInput)"
              :refForm="linkedForm1">
        <IwForm ref="linkedForm1"
                :my-form="formSelectGender"
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

