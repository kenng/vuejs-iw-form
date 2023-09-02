<script setup lang='ts'>
import IwFormSampleBasicIndex from './IwFormSampleBasicIndex.vue';
import IwFormSampleSelectIndex from './selectDropDown/IwFormSampleSelectIndex.vue';
import IwFormSampleDateIndex from './datetime/IwFormSampleDateIndex.vue';

interface Choice {
    label: string
    component: any
}

const choices: Choice[] = [
    {
        label: 'Basic Example',
        component: IwFormSampleBasicIndex
    },
    {
        label: 'Date Example',
        component: IwFormSampleDateIndex
    },
    {
        label: 'Select Dropdown Example',
        component: IwFormSampleSelectIndex
    },
]

const selected = ref(0)
</script>

<template>
    <div>
        <section class="m-4 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl">
            <h3 class="ml-4 mt-4 text-2xl">Select Demo Example</h3>
            <div v-for="(choice, key) in choices"
                 class="flex items-center m-4">
                <input :id="'choice-' + key"
                       type="radio"
                       :value="key"
                       v-model="selected"
                       name="default-radio"
                       class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label :for="'choice-' + key"
                       class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> {{ choice.label }}</label>
            </div>
        </section>
        <component :is="choices[selected].component"></component>
    </div>
</template>
