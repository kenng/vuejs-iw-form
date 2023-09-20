<script setup lang='ts'>
///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////
import { Icon } from '@iconify/vue';
import IwFormUploaderConfig from '../utils/IwFormUploaderConfig'

//////////////////////////////////////////////////////@  Props & Emits
//////////////////////////////////////////////////////////////////////
const emit = defineEmits(['change'])
const props = defineProps({
    id: {
        type: String,
        default: 'iwFormUploader'
    },
    config: {
        type: Object as PropType<IwFormUploaderConfig>,
        required: true
    },
})

const _imageSrc = ref(props.config.imageSrc)
let userOnImageLoaded: Function
let userOnUploadedFunc: Function

//////////////////////////////////////////////////////////@  Variables
//////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////
function init() {
    if ('image' == props.config.type) {
        overrideCallerOnImageLoaded()
        overrideCallerOnUploaded()
    }
}

function onChange(ev: Event) {
    if (props.config.onUploadFileChange) {
        props.config.onUploadFileChange(ev)
    } else {
        props.config._onUploadFileChange(ev)
    }
    emit('change', ev)
}

function onDragOver(ev: Event) {
    if (props.config.onDragOver) {
        props.config.onDragOver(ev)
    }
    emit('change', ev)
}

function onDrop(ev: DragEvent) {
    if (props.config.onDrop) {
        props.config.onDrop(ev)
    } else {
        props.config._onDrop(ev)
    }
    emit('change', ev)
}


function onImageLoaded(src: string) {
    _imageSrc.value = src

    if (userOnImageLoaded) {
        userOnImageLoaded(src)
    }
}

async function onRemoveImage() {
    if (props.config.onRemoveImage) {
        const imageRemoved = await props.config.onRemoveImage()
        if (imageRemoved) {
            _imageSrc.value = '';
        }
    } else {
        _imageSrc.value = '';
    }

    emit('change', null)
}

function onUploadeded(res: UploadResponse | string) {
    if (res) {
        if ((res as UploadResponse).url) {
            const uploadRes = res as UploadResponse
            _imageSrc.value = uploadRes.url
            emit('change', uploadRes.url)
        } else {
            if (typeof res == 'string') _imageSrc.value = res as string
            emit('change', res)
        }
    }

    if (userOnUploadedFunc) {
        userOnUploadedFunc(res)
    }

}

function overrideCallerOnImageLoaded() {
    if (typeof props.config.onImageLoaded == 'function') {
        userOnImageLoaded = props.config.onImageLoaded
    }

    props.config.onImageLoaded = onImageLoaded
}

function overrideCallerOnUploaded() {
    if (typeof props.config.onUploaded == 'function') {
        userOnUploadedFunc = props.config.onUploaded
    }

    props.config.onUploaded = onUploadeded
}
/////////////////////////////////////////////////////////@  Lifecycles
//////////////////////////////////////////////////////////////////////
init()

//////////////////////////////////////////////////////@ Initialization
//////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////@  Export & Expose
//////////////////////////////////////////////////////////////////////
</script>

<template>
    <div class="iwFormUploadWrapper"
         v-if="config">
        <section>
            <div v-if="config.sampleDownloadLink"
                 class="text-right my-2">
                <a :href="config.sampleDownloadLink"
                   class="cursor-pointer text-blue-600 underline dark:text-blue-300">
                    {{ config.sampleDownloadLinkLabel }}
                </a>
            </div>

            <div v-if="_imageSrc">
                <img class="m-auto"
                     :class="config.maxHeight"
                     :src="_imageSrc">
                <div class="iwFormUploadRemoveImageBtnWrapper"
                     @click="onRemoveImage">
                    <Icon icon="heroicons-outline:x"
                          class="iwFormUploadRemoveImageBtn" />
                </div>
            </div>
            <label v-else
                   :for="'iwform-upload-' + id"
                   @dragover.prevent="onDragOver"
                   @drop.prevent="onDrop"
                   class="iwformUploadlabel">
                <div class="iwFormUploadIconWrapper">
                    <Icon :icon="config.icon"
                          class="iwFormUploadIcon" />
                    <p class="iwFormUploadLabelText">{{ config.label }}
                    </p>
                </div>
                <input :id="'iwform-upload-' + id"
                       type="file"
                       :accept="config.getAcceptedFileTypes()"
                       class="hidden"
                       @change="onChange" />
            </label>
        </section>
    </div>
</template>

<style scoped>
</style>
