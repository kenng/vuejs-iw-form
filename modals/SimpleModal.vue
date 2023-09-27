<script setup lang='ts'>
// @unocss-include
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

///////////////////////////////////////////@  Props, Emits & Variables
//////////////////////////////////////////////////////////////////////
const emit = defineEmits(['close', 'left-btn-click', 'right-btn-click'])

const props = defineProps({
    height: {
        type: String,
        default: '',
    },
    icon: {
        type: String,
    },
    iconColor: {
        type: String,
        default: '',
    },
    isVisible: {
        type: Boolean,
        default: false,
    },
    leftBtnLabel: {
        type: String,
        default: 'Cancel',
    },
    leftBtnIsPrimary: {
        type: Boolean,
        default: false,
    },
    rightBtnLabel: {
        type: String,
        default: 'Yes',
    },
    rightBtnIsPrimary: {
        type: Boolean,
        default: true,
    },
    showFooter: {
        type: Boolean,
        default: true,
    },
    title: {
        type: String,
    },
    width: {
        type: String,
        default: '!max-w-60%',
    },
})

const closed = ref(false)

function onModalClose() {
    emit('close')
    closed.value = true
}

function onLeftBtnClick() {
    emit('left-btn-click');
}

function onRightBtnClick() {
    emit('right-btn-click');
}
</script>

<template>
    <div v-if="isVisible && !closed"
         tabindex="-1"
         class="iwFormModalBackdrop">
        <div :class="`iwFormModalScreen ${width} ${height}`">

            <div @click.stop
                 class="iwFormModal">
                <div class="iwFormModalTitle">

                    <button @click="onModalClose"
                            type="button"
                            class="iwFormModalCloseBtn">
                        <Icon icon="material-symbols:close"
                              class="iwFormModalCloseBtnIcon"></Icon>
                        <span>Close modal</span>
                    </button>
                </div>

                <div class="iwFormModalBody">
                    <div v-if="icon"
                         class="iwFormModalBodyIconWrapper">
                        <Icon :class="'iwFormModalBodyIcon ' + iconColor"
                              :icon="icon" />
                    </div>

                    <h3 class="iwFormModalBodyTitle">
                        {{ title }}
                    </h3>
                    <slot></slot>
                </div>

                <template v-if="showFooter">
                    <div class="iwFormModalFooter">
                        <slot name="footer-buttons">
                            <button type="button"
                                    class="iwFormModalFooterBtn"
                                    @click="onLeftBtnClick"
                                    :class="{ 'primaryBtn': leftBtnIsPrimary }">
                                {{ leftBtnLabel }}
                            </button>
                            <button type="button"
                                    class="iwFormModalFooterBtn"
                                    :class="{ 'primaryBtn': rightBtnIsPrimary }"
                                    @click="onRightBtnClick">
                                {{ rightBtnLabel }}
                            </button>
                        </slot>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
