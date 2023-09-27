
<script setup lang='ts'>
///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////
import { Icon } from '@iconify/vue'
import { directive as vTippy } from 'vue-tippy';
///////////////////////////////////////////@  Props, Emits & Variables
//////////////////////////////////////////////////////////////////////
const props = defineProps({
    /** Show or hide the VideoEmbed component */
    hidden: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['insert'])

const preview = ref<HTMLIFrameElement>()

const aspectRatioLocked = ref(false)
const height = ref(320)
const insertButtonDisabled = ref(true)
const width = ref(640)
/////////////////////////////////////////////////@  Computed & Watches
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////@  Functions
//////////////////////////////////////////////////////////////////////
/**
 * Get the YouTube video ID part from the given link
 *
 * ### Example
 * ```
 * extractYoutubeVideoId('https://www.youtube.com/watch?v=jNQXAC9IVRw')
 * // returns: 'jNQXAC9IVRw'
 * ```
 */
function extractYoutubeVideoId(link: string | null): string | null {
    if (link) {
        const extracted = link.match(/(?<=youtu\.be\/|youtube\.com\/(watch\?v=|embed\/))[A-Z0-9_-]+/i)

        if (extracted) return extracted[0]
    }
    return null
}

/**
 * Handles input element's onInput for URL input
 *
 * @param url URL string
 */
function onInputUrl(url: string) {
    // Allowed hosts is matched greedily, as long as these prefixes exist in the text
    // NOTE: Subdomains (E.g. 'www') is omitted
    const allowedHosts = [
        'youtube.com',
        'youtu.be',
    ].map(l => l.trim().replace('.', '\\.'))

    const urlRegex = new RegExp(
        `(${allowedHosts.join('|')})` // Match hosts
        + '[-a-z\\d@:%._\\+~#?&=/]+', // Match path
        'gi'
    )
    const embedWidth = url.match(/(?<=width=")[\d.]+/)
    const embedHeight = url.match(/(?<=height=")[\d.]+/)

    const links = url.match(urlRegex)
    const fullUrl = links ? `https://${links[0]}` : null

    const youtubeVideoId = extractYoutubeVideoId(fullUrl)
    if (youtubeVideoId) {
        setPreviewVideo(`https://www.youtube.com/embed/${youtubeVideoId}`)
    } else {
        setPreviewVideo(fullUrl)
    }

    if (embedWidth && embedHeight) {
        width.value = +embedWidth
        height.value = +embedHeight
    }
}

/**
 * Set the IFrame src attribute
 */
function setPreviewVideo(url: string | null) {
    const previewElem = preview.value!
    if (url) {
        insertButtonDisabled.value = false

        previewElem.src = url
        previewElem.style.display = 'block'
    } else {
        insertButtonDisabled.value = true

        previewElem.removeAttribute('src')
        previewElem.style.display = 'none'
    }
}
/////////////////////////////////////////////////////////@  Lifecycles
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////@ Initialization
//////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////@  Export & Expose
//////////////////////////////////////////////////////////////////////
defineExpose({
    height,
    src: computed(() => preview.value?.src),
    width,
})
</script>

<template>
    <Transition name="fade">
        <div v-show="!props.hidden"
             class="iwFormEditorMenuDropdown text-xs"
             title=""> <!-- Stop title inheritance -->
            <label class="block my-1"
                   for="youtubeLink">
                YouTube Embed:
            </label>
            <input type="text"
                   autocomplete="off"
                   class="iwFormEditorMenuDropdownInputUrl"
                   name="youtubeLink"
                   placeholder="www.youtube.com  |  <iframe>...</iframe>"
                   size="43"
                   @input="(ev) => onInputUrl((ev.target as HTMLInputElement).value)" />

            <iframe v-show="preview?.src"
                    class="mx-auto my-1"
                    height="144"
                    ref="preview"
                    width="256">
            </iframe>

            <br />

            <!-- <section class="mx-auto grid grid-cols-[3fr_1fr_3fr] justify-items-center"> -->
            <section class="mx-auto grid grid-cols-2 justify-items-center">
                <span class="inline-block">
                    <label for="width">Width:</label>
                    <input type="number"
                           class="iwFormEditorMenuDropdownInput"
                           min="0"
                           name="width"
                           v-model="width" />
                </span>
                <Icon v-if="false"
                      class="iwFormEditorMenuDropdownAspectRatioLock"
                      height="1rem"
                      :class="{ 'active': aspectRatioLocked }"
                      icon="ic:twotone-link"
                      v-tippy="aspectRatioLocked ? 'Locked 🔒' : 'Unlocked 🔓'"
                      @click="() => aspectRatioLocked = !aspectRatioLocked" />
                <span>
                    <label for="height">Height:</label>
                    <input type="number"
                           class="iwFormEditorMenuDropdownInput"
                           min="0"
                           name="height"
                           v-model="height" />
                </span>
            </section>

            <input type="button"
                   class="iwFormEditorMenuDropdownBtn mx-auto mt-2"
                   :disabled="insertButtonDisabled"
                   value="Insert"
                   @mousedown.prevent="emit('insert')">
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .25s
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0
}
</style>
