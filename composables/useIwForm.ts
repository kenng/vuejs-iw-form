import { ref, defineEmits } from 'vue'
import IwObject from '../utils/IwObject';

export const useIwForm = (config: IwFormUseConfig) => {

    let totalSubmission = 0;
    // let canSubmitAgain = config.canSubmitAgain;
    // let dialogIsOpen = false;

    // refs
    const myFormData = ref({})
    const errors = ref({})
    const formErrorMsg = ref('')
    const inputRefs = ref([])


    function getAriaLabel(item: IwFormInput): string {
        if (item.disabled) return 'Input disabled';
        return 'form input'
    }

    function getCss(item: IwFormInput): string {
        return item.cssInput ?? ''
    }

    function getInputCss(item: IwFormInput): string {
        let css;
        if (item.disabled) {
            css = 'iwFormInputDisabled'
        } else {
            css = 'iwFormInputText'
        }

        if (item.showPrefixIcon) css += ' iwFormPrefixIconPadding'

        return css + ' ' + item.cssInput
    }

    function validate(item: IwFormInput, data: any) {
        if (item.rules) {
            for (const rule of item.rules) {
                const param = { value: data, myFormData: myFormData.value } as IRuleData
                const err = rule(param)
                if (typeof err === 'string') {
                    errors.value[item.name] = err
                    return false
                    break
                }
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

    function onInput(item: IwFormInput, val: any) {
        const key = item.name
        myFormData.value[key] = val
        if (errors.value[key]) {
            if (validate(item, val)) {
                delete errors.value[key]
            }
        }
    }


    function onBlur(item: IwFormInput, data: any) {
        validate(item, data)

        if (typeof item.onBlur == 'function') {
            return item.onBlur(myFormData);
        }
    }

    function onFocus(item: IwFormInput, data: any) {
        // validate(item, data)
    }


    function setLabel(item: IwFormInput) {
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

    function getCssWrapper(cssParam: Function | string | undefined, isReadOnly: boolean = false) {
        let readOnlyCSS = isReadOnly ? ' iwFormReadOnly ' : '';
        if (typeof cssParam === 'function') return readOnlyCSS + cssParam();
        else if (typeof cssParam === 'string') return readOnlyCSS + cssParam;
        else return readOnlyCSS + 'iwFormInputWrapper ';
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
            group.formInputs.forEach((item: IwFormInput) => {
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

    function initFormData() {
        if (config.myForm.formData && Object.keys(config.myForm.formData).length >= 1) {
            myFormData.value = JSON.parse(JSON.stringify(config.myForm.formData))
        }

        for (const group of (config.myForm.formGroups)) {
            for (const item of group.formInputs) {
                if (!myFormData.value[item.name]) myFormData.value[item.name] = null
            }
        }
    }


    return {
        // variables
        myFormData,
        errors,
        totalSubmission,
        formErrorMsg,

        // functions
        getAriaLabel,
        getCss,
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
        getCssWrapper,
        getFormData,
        formOnReset,
        removeDisabledInputValue,
        formOnSubmit,
        initFormData,
    }

}

export default useIwForm
