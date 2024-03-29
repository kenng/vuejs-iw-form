/** @unocss-include */
import { ref, defineEmits } from 'vue'
import IwObject from '../utils/IwObject';
import IwFormConfig, { IwFormType } from '../utils/IwFormConfig';
import IwFormRule from '../utils/IwFormRule';

export function setLabel(item: IwFormInputCore) {
    let label = item.label
    if (undefined === label) label = item.name

    return label.charAt(0).toUpperCase() + label.slice(1)
}

export function setRequired(item: IwFormInputCore) {
    if (item.required) return true
    return false
}


export const useIwForm = (config: IwFormUseConfig) => {

    let totalSubmission = 0;
    // let canSubmitAgain = config.canSubmitAgain;
    // let dialogIsOpen = false;

    // refs
    const myFormData = ref({})
    const errors = ref({})
    const formErrorMsg = ref('')
    const inputRefs = ref([])
    const keys = ref<string[]>([])
    const submitIsLoading = ref<boolean>(false)

    const myForm: IwFormConfig = config.myForm
    myForm.formGroups.forEach(group => {
        group.formInputs.forEach(formInput => {
            const name = (formInput as IwFormInputCore).name
            if (name) {
                keys.value[name] = `${name}-${Date.now()}-${Math.random() * 10000}`
            }
        })
    })

    // ------------------------------------------------------

    function clearErrorsIfValidated(item: IwFormInputCore, val: any) {
        if (errors.value[item.name]) {
            if (validate(item, val)) {
                delete errors.value[item.name]
            }
        }
    }

    function getCss(item: IwFormInput, param?: { cssArray?: string[], cssObj?: Record<string, boolean>, default?: string }) {
        let extraCss: string = ''

        const isVisible = (item as IwFormInputCore).isVisible
        if (typeof isVisible === 'function') {
            const isItemVisible = isVisible(myFormData)
            if (false === isItemVisible) {
                extraCss += ' hidden'
            } else {
                extraCss += ' ' + isItemVisible
            }
        } else if (false === isVisible) {
            extraCss += ' hidden'
        }

        if (param) {
            if (param.cssArray) {
                for (const css of param.cssArray) {
                    extraCss += ` ${css}`
                }
            }

            if (param.cssObj) {
                for (const [key, isTrue] of Object.entries(param.cssObj)) {
                    if (isTrue) extraCss += ` ${key} `
                }
            }

            if (!extraCss && param.default) extraCss = param.default
        }

        return `${extraCss}`
    }

    function getRef(item: IwFormInput) {
        if (item.ref) return item.ref;
    }

    function formOnReset() {
        let resetIgnored: string[];
        if (typeof config.resetIgnored === 'function') {
            resetIgnored = config.resetIgnored()
        } else {
            resetIgnored = []
        }

        // trigger input component rest function
        inputRefs.value.forEach(function (theInput: any) {
            if (theInput.onReset) theInput.onReset()
        });

        // reset data
        new IwObject(myFormData.value).reset(resetIgnored);
        for (const key of Object.keys(myFormData.value)) {
            myFormData.value[key] = null
        }

        // setCanSubmitAgain(false);
        if (config.onReset) config.onReset()
    }

    async function formOnSubmit(ev: Event) {
        if (!validateAll()) return

        if (totalSubmission == 0) {
            try {
                if (config.onSubmit) {
                    // clear previous error if any
                    formErrorMsg.value = ''

                    // prepare the data
                    const data = removeDisabledInputValue()
                    await config.onSubmit(data)
                    if (config.myForm.onSuccess) config.myForm.onSuccess()
                }
            } catch (err: any) {
                console.error(err)
                formErrorMsg.value = err.message
                // TODO:
                if (config.myForm.onError) config.myForm.onError(err.message)
                if (config.myForm.rethrowErrorOnSubmit) throw err
            }
            // Prompt Dialog
            // dialogIsOpen = true;
            // } else if (canSubmitAgain) {
            //   submitConfirmed();
        }
    }

    function getAriaLabel(item: IwFormInputCore): string {
        if (item.disabled) return 'Input disabled';
        return 'form input'
    }

    function getFormData() {
        return myFormData.value;
    }

    function getFormGroupSubmitLabel(group: IwFormGroup, defaultLabel: string) {
        const submitBtn = group.submitBtn
        if (submitBtn) {
            if (submitBtn.label) {
                return submitBtn.label
            }
        }

        return defaultLabel
    }

    function getInputCss(item: IwFormInputCore, defaultCss?: string): string {
        let css;
        if (item.disabled) {
            css = 'iwFormInputDisabled'
        } else {
            css = defaultCss ?? 'iwFormInputText'
        }

        if (item.showPrefixIcon) css += ' iwFormPrefixIconPadding'

        if (item.cssInput) css = css + ' ' + item.cssInput

        return css
    }

    function getVisibility(item: IwFormInputCore) {
        if (typeof item.isVisible === 'boolean') return item.isVisible
        if (typeof item.isVisible === 'function') return item.isVisible(item, myFormData)

        return true
    }

    function isDisabled(disabled: boolean | undefined, isReadOnly: boolean) {
        return disabled || isReadOnly
    }

    function initFormData() {
        if (config.myForm.formData && Object.keys(config.myForm.formData).length >= 1) {
            // clone formData to myFormData
            myFormData.value = JSON.parse(JSON.stringify(config.myForm.formData))
        }

        // set value if inputX.value is defined, and myFormData is yet to be defined for inputX
        for (const group of (config.myForm.formGroups)) {
            group.formInputs.forEach((item: IwFormInput) => {
                const name = (item as IwFormInputCore).name
                if (name && null === config.myForm.formData[name]) {
                    const val = (item as IwFormInputCore).value
                    if (val !== 'undefined') {
                        myFormData.value[name] = val
                    }
                }
            })
        }
    }

    function initRenderCallback() {
        myForm.renderCallBack = (name: string) => {
            keys.value[name] = `${name}-${Date.now()}-${Math.random() * 10000}`
            myFormData.value[name] = null
        }
    }

    function isVisible(item: IwFormInputCore): boolean {
        if (null != item.visibleOnData) {
            return isVisibleOnData(item)
        }
        return getVisibility(item)
    }

    function isVisibleOnData(item: IwFormInputCore): boolean {
        if (item.visibleOnData) {
            for (const dataKey of item.visibleOnData) {
                const val = myFormData.value[dataKey]
                if (!val || 0 == val) {
                    return false
                }
            }
            return true
        }

        return false
    }

    function onBlur(item: IwFormInputCore, val: any) {
        if (validate(item, val)) {
            delete errors.value[item.name]
        }

        if (typeof item.onBlur == 'function') {
            return item.onBlur(myFormData);
        }
    }

    async function onChange(item: IwFormInputCore, val: any, ...extra: any[]) {
        const key = item.name
        myFormData.value[key] = val
        clearErrorsIfValidated(item, val)

        if (item.onChange) item.onChange(item, val, ...extra)
        if (item.onChangeUpdateInput) {
            const res = await item.onChangeUpdateInput(item, val, ...extra)
            myForm.updateSelectInput(res.linkedInputName, res.newSelectConfig)
        }
    }

    function onFocus(item: IwFormInput, data: any) {
        // validate(item, data)
    }

    function onInput(item: IwFormInputCore, val: any) {
        const key = item.name
        myFormData.value[key] = val
        clearErrorsIfValidated(item, val)
    }

    function removeDisabledInputValue(): Object {
        const formData = {}
        for (const group of (config.myForm.formGroups)) {
            group.formInputs.forEach((item: IwFormInputCore) => {
                if (!item.disabled || true === item.shouldDehydrate) {
                    const name = item.name
                    formData[name] = myFormData.value[name]
                }
            })
        }

        return formData
    }



    function validate(item: IwFormInputCore, data: any) {
        if (item.rules) {
            for (const rule of item.rules) {
                const param: IRuleData = { value: data, myFormData: myFormData.value }
                const err = rule(param)
                if (typeof err === 'string') {
                    errors.value[item.name] = err
                    return false
                    break
                }
            }
        }

        if (item.required) {
            const err = IwFormRule.required()({ value: data })
            if (typeof err === 'string') {
                errors.value[item.name] = err
                return false
            }
        }
        return true
    }

    function validateAll(): boolean {
        let validated = true;

        for (const group of (config.myForm.formGroups)) {
            for (const item of group.formInputs) {
                if (!validate(item, myFormData.value[item.name])) {
                    if (myForm.onError) {
                        myForm.onError(`value of ${item.label} is invalid`)
                    }
                    validated = false
                }
            }
        }

        return validated;
    }

    return {
        // variables
        errors,
        formErrorMsg,
        inputRefs,
        keys,
        myFormData,
        submitIsLoading,
        totalSubmission,

        // functions
        clearErrorsIfValidated,
        formOnReset,
        formOnSubmit,
        getAriaLabel,
        getCss,
        getFormData,
        getFormGroupSubmitLabel,
        getInputCss,
        getRef,
        getVisibility,
        initFormData,
        initRenderCallback,
        isDisabled,
        isVisible,
        onBlur,
        onChange,
        onFocus,
        onInput,
        removeDisabledInputValue,
        validate,
        validateAll,
    }

}

export default useIwForm
