import { ref } from 'vue'
import IwFormInputSelectConfig from "../utils/IwFormInputSelectConfig"

const useVueMultiSelect = (props: IwFormSelectProps) => {
    const keyName = props.config.keyName
    const selectedOption = ref<IwFormInputSelectOption | Array<IwFormInputSelectOption>>()

    function initSelected() {
        if (props.config.selected) {
            const selected = props.config.selected

            if (Array.isArray(selected)) {
                if (!props.config.multiple) {
                    console.error('selected value passed as an array however "multiple" option is false')
                    return
                }

                selectedOption.value = []
                for (const item of selected) {
                    const found = props.config.options.find(
                        (option: IwFormInputSelectOption) => option[keyName] == item
                    )
                    if (found) {
                        selectedOption.value.push(found)
                    } else {
                        console.error(`${item} not found in options`)
                        console.error(props.config.options)
                    }
                }

            } else {
                selectedOption.value = undefined
                selectedOption.value = props.config.options.find(
                    (option: IwFormInputSelectOption) => option[keyName] == selected
                )
            }


        }
    }

    function getSelectedKeys(): IwFormInputSelectedKeys {
        if (!Array.isArray(selectedOption.value)) {
            return selectedOption.value![keyName]
        } else {
            const keys: any = []
            selectedOption.value.forEach(item => keys.push(item[keyName]))
            return keys
        }
    }

    function onInput(value: any, id: any) {
    }

    function getTrackBy(config: IwFormInputSelectConfig) {
        return config.isOptionObject ? config.keyName : null
    }

    function getLabelBy(config: IwFormInputSelectConfig) {
        return config.isOptionObject ? config.labelName : null
    }

    return {
        // variables
        keyName,
        selectedOption,

        // functions
        initSelected,
        getSelectedKeys,
        onInput,
        getTrackBy,
        getLabelBy
    }
}

export default useVueMultiSelect
