<script setup lang='ts'>
///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////
import { Icon } from '@iconify/vue';
import IwFormUploadConfig from '../utils/IwFormUploadConfig'

//////////////////////////////////////////////////////@  Props & Emits
//////////////////////////////////////////////////////////////////////

const props = defineProps({
    id: {
        type: String,
        default: 'iwFormUploader'
    },
    config: {
        type: Object as PropType<IwFormUploadConfig>,
        required: true
    }
})

const uploadObj = ref(props.config)

//////////////////////////////////////////////////////////@  Variables
//////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////
const imageSrc = computed(() => uploadObj.value.imageSrc)

/////////////////////////////////////////////////////////@  Lifecycles
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////@ Initialization
//////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////@  Export & Expose
//////////////////////////////////////////////////////////////////////
</script>

<template>
    <div class="mb-10"
         v-if="config">
        <section>
            <div v-if="config.sampleDownloadLink"
                 class="text-right my-2">
                <a :href="config.sampleDownloadLink"
                   class="cursor-pointer text-blue-600 underline dark:text-blue-300">{{ config.sampleDownloadLinkLabel
                   }}</a>
            </div>

            <div v-if="imageSrc"
                 class="absolute">
                <img class="m-auto"
                     :class="config.maxHeight"
                     :src="imageSrc">
            </div>
            <label v-else
                   :for="id"
                   @dragover.prevent="(ev: DragEvent) => config.onDragOver ? config.onDragOver(ev) : null"
                   @drop.prevent="(ev: DragEvent) => config.onDrop ? config.onDrop(ev) : config._onDrop(ev)"
                   class="iwformUploadlabel">
                <div class="iwFormUploadIconWrapper">
                    <Icon :icon="config.icon"
                          class="iwFormUploadIcon" />
                    <p class="iwFormUploadLabelText">{{ config.label }}
                    </p>
                </div>
                <input :id="id"
                       type="file"
                       name="receiptCsvFile"
                       :accept="config.getAcceptedFileTypes()"
                       class="hidden"
                       @change="(ev: Event) => config.onUploadFileChange ? config.onUploadFileChange(ev) : config._onUploadFileChange(ev)" />
            </label>
        </section>
    </div>
</template>

<style scoped>
</style>
