<script setup lang='ts'>
import { PropType } from 'vue'

defineProps({
    formInput: {
        type: Object as PropType<IwFormInput>,
        required: true,
    },
    formData: {
        type: Object,
        required: true,
    }
})
</script>

<template>
    <div>
        FormInput: {{ formInput }}<br>
        <hr><br>
        FormData: {{ formData }}
    </div>
</template>

<style scoped>
</style>
