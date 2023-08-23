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
        <h3>This is dynamic component</h3>
        <hr><br>
        Props FormData: {{ formData }}
    </div>
</template>
