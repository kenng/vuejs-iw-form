/** @unocss-include */
import { ref, defineEmits } from 'vue'
import IwObject from '../utils/IwObject';
import IwFormConfig, { IwFormType } from '../utils/IwFormConfig';
import IwFormRule from '../utils/IwFormRule';

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
            if (formInput.name) {
                keys.value[formInput.name] = `${formInput.name}-${Date.now()}-${Math.random() * 10000}`
            }
        })
    })

    function getAriaLabel(item: IwFormInput): string {
        if (item.disabled) return 'Input disabled';
        return 'form input'
    }

    function getInputCss(item: IwFormInput, defaultCss?: string): string {
        let css;
        if (item.disabled) {
            css = 'iwFormInputDisabled'
        } else {
            css = defaultCss ?? 'iwFormInputText'
        }

        if (item.showPrefixIcon) css += ' iwFormPrefixIconPadding'

        return css + ' ' + item.cssInput
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

    function validate(item: IwFormInput, data: any) {
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
            const err = IwFormRule.required()({ value: date })
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
                    validated = false
                }
            }
        }

        return validated;
    }

    function onInput(item: IwFormInputCore, val: any) {
        const key = item.name
        myFormData.value[key] = val
        if (errors.value[key]) {
            if (validate(item, val)) {
                delete errors.value[key]
            }
        }
    }


    function onBlur(item: IwFormInputCore, data: any) {
        validate(item, data)

        if (typeof item.onBlur == 'function') {
            return item.onBlur(myFormData);
        }
    }

    function onFocus(item: IwFormInput, data: any) {
        // validate(item, data)
    }


    function setLabel(item: IwFormInputCore) {
        let label = item.label
        if (!label) label = item.name

        return label.charAt(0).toUpperCase() + label.slice(1)
    }

    function setRequired(item: IwFormInput) {
        if (item.required) return true
        return false
    }

    function getRef(item: IwFormInput) {
        if (item.ref) return item.ref;
    }

    function isDisabled(disabled: boolean | undefined, isReadOnly: boolean) {
        return disabled || isReadOnly
    }

    function getCss(item: IwFormInput, param?: { cssArray?: string[], cssObj?: Record<string, boolean> }) {
        let extraCss: string = ''

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
        }

        if (typeof item.isVisible == 'function') {
            const hidden = item.isVisible(myFormData) ? '' : ' hidden'
            extraCss += hidden
        }

        return `${extraCss}`
    }

    function getFormData() {
        return myFormData.value;
    }

    function toggleReadOnly() {
        // this.isReadOnly = !this.isReadOnly;
        // if (this.isReadOnly) this.formTitle = `Edit ${this.title}`;
        // else this.formTitle = this.title;
        // this.$emit('toggleReadOnly', this.myFormData, this.formExtra);
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

    function removeDisabledInputValue(): Object {
        const formData = {}
        for (const group of (config.myForm.formGroups)) {
            group.formInputs.forEach((item: IwFormInputCore) => {
                if (!item.disabled) {
                    const name = item.name
                    formData[name] = myFormData.value[name]
                }
            })
        }

        return formData
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

    function submitConfirmed() {
        // getMyForm()
        //   .validate()
        //   .then((success: boolean) => {
        //     if (!success) {
        //       return $store.dispatch(
        //         'showSnackbarError',
        //         'Missing or invalid input value',
        //       );
        //     }
        //     $emit('submit', myFormData, formExtra);
        //     // if (resetOnSubmit) reset();

        //     setCanSubmitAgain(null);
        //   })
        //   .catch(() => {
        //     $store.dispatch(
        //       'showSnackbarError',
        //       'Missing or invalid input value',
        //       // eslint-disable-next-line @typescript-eslint/no-empty-function
        //     );
        //     // console.log($refs.myform);
        //   });
    }

    //   function setCanSubmitAgain(canSubmitAgainParam: boolean) {
    //     if (canSubmitAgainParam) {
    //       canSubmitAgain = canSubmitAgainParam
    //     } else if (config.canSubmitAgain) {
    //       canSubmitAgain = true;
    //     }
    //   }


    function getVisibility(item: IwFormInput) {
        if (typeof item.isVisible === 'boolean') return item.isVisible
        if (typeof item.isVisible === 'function') return item.isVisible(item, myFormData)

        return true
    }

    function isVisible(item: IwFormInput): boolean {
        if (null != item.visibleOnData) {
            return isVisibleOnData(item)
        }
        return getVisibility(item)
    }

    function isVisibleOnData(item: IwFormInput): boolean {
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

    function initRenderCallback() {
        myForm.renderCallBack = (name: string) => {
            keys.value[name] = `${name}-${Date.now()}-${Math.random() * 10000}`
            myFormData.value[name] = null
        }
    }

    function initFormData() {
        for (const group of (config.myForm.formGroups)) {
            group.formInputs.forEach((item: IwFormInput) => {
                if (typeof item.value != 'undefined'
                    && !item.disabled) {
                    const name = item.name
                    if (name) myFormData.value[name] = item.value
                }
            })
        }

        if (config.myForm.formData && Object.keys(config.myForm.formData).length >= 1) {
            myFormData.value = JSON.parse(JSON.stringify(config.myForm.formData))
        }

        for (const group of (config.myForm.formGroups)) {
            for (const item of group.formInputs) {
                if (item.name && !myFormData.value[item.name]) myFormData.value[item.name] = null
            }
        }
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
        getAriaLabel,
        getCss,
        getFormGroupSubmitLabel,
        getInputCss,
        validate,
        validateAll,
        onInput,
        onBlur,
        onFocus,
        setLabel,
        setRequired,
        getRef,
        isDisabled,
        getFormData,
        formOnReset,
        removeDisabledInputValue,
        formOnSubmit,
        getVisibility,
        isVisible,
        initRenderCallback,
        initFormData,
    }

}

export default useIwForm
