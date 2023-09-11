<script setup lang="ts">
import { ref, PropType, onMounted } from 'vue'
import { easepick, Core } from '@easepick/core'
import { RangePlugin } from "@easepick/range-plugin"
import { AmpPlugin } from "@easepick/amp-plugin"
import { TimePlugin } from "@easepick/time-plugin"
// import { KbdPlugin } from "@easepick/kbd-plugin"
import { PresetPlugin } from "@easepick/preset-plugin"
import { LockPlugin } from "@easepick/lock-plugin"
import type { IPickerConfig } from "@easepick/core/dist/types"
import type { ILockConfig } from "@easepick/lock-plugin/dist/interface"
import type { IAmpPlugin } from "@easepick/amp-plugin/dist/interface"
import dayjs from 'dayjs'
import IwFormCalendar from '../utils/IwFormCalendar'
import { Icon } from '@iconify/vue';

export type IwCalendarInputType = 'date' | 'dateTime';

const props = defineProps({
    disabled: Boolean,
    id: {
        type: String,
    },
    options: {
        type: Object as PropType<IwFormCalendar>,
        required: true,
    },
    type: {
        type: String as PropType<IwCalendarInputType>,
        default: 'dateTime',
    },
})

const emit = defineEmits(['change', 'reset'])

// const calendarRef = computed(() => 'easePick-' + props.options.id)
const easepickRef = ref<HTMLElement>()
let calendar: Core;

//////////////////////////////////////////////////////////////////////
// . Function
//////////////////////////////////////////////////////////////////////
function onReset() {
    calendar.clear();
}

function createCalendar(options: IPickerConfig) {
    calendar = new easepick.create(options)
    return calendar
}
//////////////////////////////////////////////////////////////////////
// . Lifecycle
//////////////////////////////////////////////////////////////////////

onMounted(() => {
    const plugins: any = [
        AmpPlugin,
        LockPlugin,
        // KbdPlugin,
    ];

    const css: any = [
        // 'https://cdn.jsdelivr.net/npm/@easepick/core@1.2.1/dist/index.css',
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css"
        // "/vendor/easepick-bundle-1.2.1.min.css"
    ];

    if (props.options.enableTimePicker) {
        plugins.push(TimePlugin)
        // css.push('https://cdn.jsdelivr.net/npm/@easepick/time-plugin@1.2.1/dist/index.css',)
    }

    if (props.options.enableRangePicker) {
        plugins.push(RangePlugin)
        // css.push('https://cdn.jsdelivr.net/npm/@easepick/range-plugin@1.2.1/dist/index.css')
    }

    if (props.options.enablePresetPicker) {
        plugins.push(PresetPlugin)
        // css.push('https://cdn.jsdelivr.net/npm/@easepick/preset-plugin@1.2.1/dist/index.css')
    }

    const options: IPickerConfig = {
        css,
        element: easepickRef.value!,
        format: props.options.format,
        readonly: props.options.readonly,
        PresetPlugin: {
            position: 'left',
        },
        zIndex: 1,
        setup(picker: any) {
            picker.on('change', (e: any) => {
                const selectedDateTime = dayjs(calendar.getDate()).format(props.options.format)
                emit('change', [selectedDateTime])
            });

            picker.on('select', (e: any) => {
                if (e.detail.date) {
                    emit('change', [e.detail.date])
                } else if (e.detail.start) {
                    // cater to range selection
                    let startDateTime = e.detail.start
                    let endDateTime = e.detail.end

                    if ('dateTime' === props.type) {
                        if (startDateTime.isSame(endDateTime)) {
                            endDateTime = dayjs(endDateTime).endOf('day').format(props.options.format);
                        }
                    } else {
                        startDateTime = startDateTime.format()
                        endDateTime = endDateTime.format()
                    }

                    emit('change', [startDateTime, endDateTime])
                }
            });

            picker.on('clear', (e: any) => {
                emit('reset')
            })
        },
        plugins,
    }

    const AmpPluginOpts: IAmpPlugin = { dropdown: {} }
    const LockPluginOpts: ILockConfig = {}

    if (props.options.enableMonthDropdown) AmpPluginOpts.dropdown!.months = true
    if (props.options.enableYearDropdown) AmpPluginOpts.dropdown!.years = true
    if (props.options.isDarkMode) AmpPluginOpts.darkMode = true
    if (props.options.showResetBtn) AmpPluginOpts.resetButton = true

    if (props.options.minDate) LockPluginOpts.minDate = props.options.minDate
    if (props.options.maxDate) LockPluginOpts.maxDate = props.options.maxDate

    options.AmpPlugin = AmpPluginOpts
    const calendar = createCalendar(options)

    if (props.options.value) {
        calendar.setDate(props.options.value);
        if (props.options.enableTimePicker) {
            const dateTime = props.options.value as string
            const splitted = dateTime.split(" ")
            if (splitted.length == 2) {
                calendar.setTime(splitted[1]);
            }
        }

        // emit back just in case the value is not set to initial formData
        emit('change', [props.options.value])
    } else if (props.options.showValueAsToday) {
        calendar.setDate(new Date());
    }
})

//////////////////////////////////////////////////////////////////////
// . Export & Expose
//////////////////////////////////////////////////////////////////////
defineExpose({ onReset })
</script>

<template>
    <div class="relative">
        <div class="iwFormInputCalendarIcon">
            <Icon icon="heroicons:calendar-20-solid"></Icon>
        </div>
        <input ref="easepickRef"
               type="text"
               :id="id"
               :class="disabled ? 'iwFormInputCalendarDisabled' : 'iwFormInputCalendar'"
               :placeholder="options.placeholder"
               :disabled="disabled">
    </div>
</template>

<style scoped>
</style>
