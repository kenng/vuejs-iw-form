<script setup lang="ts">
/////////////////////////////////////////////////////// Import & Types
//////////////////////////////////////////////////////////////////////
import { ref, PropType, watch, computed } from 'vue'
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
import IwFormInputSelectConfig from '../utils/IwFormInputSelectConfig'
import { Icon } from '@iconify/vue';

///////////////////////////////////////////// Props, Emits & Variables
//////////////////////////////////////////////////////////////////////
const emit = defineEmits(['changed'])

const props = defineProps({
    config: {
        type: Object as PropType<IwFormInputSelectConfig>,
        required: true,
    },
    disabled: { type: Boolean, default: false }
})

const selectedOption = ref()
if (props.config.selected) selectedOption.value = props.config.selected

///////////////////////////////////////////////// . Computed & Watches
//////////////////////////////////////////////////////////////////////
watch(selectedOption, (newValue) => emit('changed', newValue))

const label = computed(function (): string {
    if (!props.config.multiple) {
        if (!selectedOption.value) {
            return (props.config.placeholder ? props.config.placeholder : "Select")
        }

        const match = props.config.options.find(
            obj => (obj.value == selectedOption.value || obj.value == selectedOption.value.value))
        if (match) return match[props.config.labelName]
        return ''

    } else {
        if (!selectedOption.value || selectedOption.value.length == 0) {
            return (props.config.placeholder ? props.config.placeholder : "Select")
        }

        let labels: string[] = [];
        selectedOption.value?.forEach((item: IwFormInputSelectOption) => {
            labels.push(item.label)
        })

        let str = labels.join(', ');
        if (str.length > 27) {
            str.substring(0, 27) + '...'
        }
        return str
    }

})

////////////////////////////////////////////////////////// . Functions
//////////////////////////////////////////////////////////////////////
function onReset() {
    if (!props.config.multiple) {
        selectedOption.value = null
    } else {
        selectedOption.value = []
    }
}

/////////////////////////////////////////////////////. Export & Expose
//////////////////////////////////////////////////////////////////////
defineExpose({ onReset })
</script>

<template>
    <div>
        <Listbox v-model="selectedOption" :disabled="disabled" :multiple="config.multiple">
            <div class="relative mt-1">
                <ListboxButton class="iwFormInputDropdown">
                    <span class="block truncate">{{ label }}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <Icon icon="heroicons:chevron-up-down"></Icon>
                    </span>
                </ListboxButton>
                <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <ListboxOptions class="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <ListboxOption v-slot="{ active, selected }" v-for="option in config.options" :key="option[config.keyName]" :disabled="option.disabled" :value="option" as="template">
                            <li :class="[
                                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                                    'relative cursor-default select-none py-2 pl-10 pr-4',
                                ]">
                                <span :class="[
                                        selected ? 'font-medium' : 'font-normal',
                                        'block truncate',
                                    ]">{{ option[config.labelName] }}</span>
                                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                    <Icon icon="heroicons:check"></Icon>
                                </span>
                            </li>
                        </ListboxOption>
                    </ListboxOptions>
                </transition>
            </div>
        </Listbox>
    </div>
</template>
