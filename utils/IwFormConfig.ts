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
     * To update a select input options. Usually used when this select input
     * options is changed based on another input in the form
     * @param name
     * @param config
     * @returns
     */
    updateSelectInput(name: string, config: IwFormInputSelectConfig) {
        let theInput;
        for (let i = 0; i < this.formGroups.length; i++) {
            const group = this.formGroups[i]
            theInput = group.formInputs.find(
                (input) => input.name === name
            )

            if (theInput) {
                theInput!.selectConfig = config
                this.markAsDirty(theInput.name)
                break
            }
        }
    }

    markAsDirty(name: string) {
        if (this.renderCallBack) {
            this.renderCallBack(name)
        }
    }

    buildFormData(formInputs: Array<IwFormInput>) {
        for (const theOption of formInputs) {
            if (typeof this.formData[theOption.name] === 'undefined') {
                if (!theOption.name) {
                    continue
                }
                if (this.mySkipFormData.indexOf(theOption.type) >= 0) continue;
                this.formData[theOption.name] = null;
            }
        }
    }
}
