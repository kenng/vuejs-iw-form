import IwFormInputSelectConfig from "./IwFormInputSelectConfig";

export enum IwFormType {
    AUTOCOMPLETE = 'autocomplete',
    BUTTON = 'button',
    CHECKBOX = 'checkbox',
    COMPONENT = 'component',
    DATE = 'date',
    EDITOR = 'editor',
    LABEL = 'label',
    OPTION_GROUP = 'option_group',
    SELECT = 'select',
    SEPARATOR = 'separator',
    SWITCH = 'switch',
    TEXTGROUP_EMAIL = 'email',
    TEXTGROUP_NUMBER = 'number',
    TEXTGROUP_PASSWORD = 'password',
    TEXTGROUP_TEXT = 'text',
    TEXTGROUP_TEXTAREA = 'textarea',
    TIME = 'time',
    UPLOADER = 'uploader',
}

export default class IwFormConfig {
    public renderCallBack: Function | null = null

    name?: string;
    cssForm: string;
    formData: object = {};
    formGroups: Array<IwFormGroup>;
    // formInputs: Array<IwFormInput>;
    onError: IwFormOnError | undefined;
    onSuccess: IwFormOnSuccess | undefined;
    rethrowErrorOnSubmit: boolean;
    mySkipFormData: Array<IIwFormType> = [
        IwFormType.SEPARATOR,
        IwFormType.LABEL,
        IwFormType.BUTTON,
    ];

    constructor({
        name,
        cssForm = '',
        formData = {},
        formGroups,
        skipFormData,
        rethrowErrorOnSubmit = false,
        onError,
        onSuccess,
    }: {
        name?: string;
        cssForm?: string;
        formData?: object;
        formGroups: Array<IwFormGroup>;
        skipFormData?: Array<IIwFormType>;
        onError?: IwFormOnError;
        onSuccess?: IwFormOnSuccess;
        rethrowErrorOnSubmit?: boolean;
    }) {
        this.name = name;
        this.cssForm = cssForm;
        this.formData = formData;
        this.formGroups = formGroups;
        if (skipFormData) this.mySkipFormData = skipFormData;
        for (const group of formGroups) {
            this.buildFormData(group.formInputs);
        }
        this.rethrowErrorOnSubmit = rethrowErrorOnSubmit;
        this.onError = onError;
        this.onSuccess = onSuccess;
    }

    /**
  * Locate the IwFormInput in the form with the given name
  */
    locateSelectInput(name: string): IwFormInputSelect | null {
        let theInput
        for (let i = 0; i < this.formGroups.length; i++) {
            const group = this.formGroups[i]
            theInput = group.formInputs.find(
                (input: IwFormInput) => (input as IwFormInputCore).name === name
            )

            if (theInput) return theInput as IwFormInputSelect
        }
        return null
    }

    /**
     * To patch update a select input options. Usually used when this select
     * input options is changed based on another input in the form
     *
     * ### Example:
     * ```
     * const cfg = new IwFormInputSelectConfig([], {
     *   multiple: true, // default is false
     *   showLoading: true,
     * })
     *
     * // After loading $cfg into form
     * form.patchSelectInput('{nameInForm}', { showLoading: false })
     * // cfg == { multiple: true, showLoading: false }
     * ```
     *
     * @param name
     * @param config
     * @returns
     *
     * @see updateSelectInput to replace the config of an IwFormInput
     */
    patchSelectInput(name: string, config: Partial<IwFormInputSelectConfig>): IwFormInputSelect | IwFormInputAutocomplete | null {
        const theInput = this.locateSelectInput(name)

        if (theInput) {
            theInput.selectConfig?.patch?.(null, config)
            // this.markAsDirty(theInput.name)
        }

        return theInput
    }

    /**
     * To update a select input options. Usually used when this select input
     * options is changed based on another input in the form
     * @param name
     * @param config
     * @returns
     */
    updateSelectInput(name: string, config: IwFormInputSelectConfig) {
        const theInput = this.locateSelectInput(name)

        if (theInput) {
            theInput!.selectConfig = config
            this.markAsDirty(theInput.name)
        }
    }

    markAsDirty(name: string) {
        if (this.renderCallBack) {
            this.renderCallBack(name)
        }
    }

    buildFormData(formInputs: Array<IwFormInput>) {
        for (const theOption of formInputs) {
            const theName = (theOption as IwFormInputCore).name
            if (typeof this.formData[theName] === 'undefined') {
                if (!theName) {
                    continue
                }
                if (this.mySkipFormData.indexOf(theOption.type) >= 0) continue;
                this.formData[theName] = null;
            }
        }
    }
}
