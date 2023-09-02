<script setup lang='ts'>
import { Ref } from 'vue'
import IwForm from '../components/IwForm.vue'

type IRefForm = InstanceType<typeof IwForm>

defineProps<{
    title: string,
    refForm?: IRefForm,
}>()

</script>

<template>
    <div class="m-2 pt-6">
        <h3 class="font-sans text-3xl pb-4"> {{ title }} </h3>

        <div class="grid grid-cols-12 gap-1 bg-slate-200 rounded ">
            <div class="p-10 col-span-7">
                <div class="relative w-full max-w-xl h-full md:h-aut mx-auto">
                    <div class="relative bg-white rounded-lg shadow-slate-50 drop-shadow-xl dark:bg-gray-800 sm:p-5">
                        <slot name="default"></slot>
                    </div>
                </div>
            </div>

            <div class="p-10 col-span-5">
                <div class="bg-white rounded-lg shadow-slate-50 drop-shadow-xl dark:bg-gray-800 sm:p-5">
                    <h4 class="text-xl text-center">Output</h4>
                    <div v-if="refForm">
                        <div class="ml-4 pt-4 italic iwform-output"
                             v-if="refForm">
                            <div v-for="(item, key) in refForm.getFormData()">
                                {{ `${key}: ${item}` }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
