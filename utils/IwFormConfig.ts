import IwFormInputSelectConfig from "./IwFormInputSelectConfig";

export enum IwFormType {
    LABEL = 'label',
    SEPARATOR = 'separator',
    TEXTGROUP_TEXT = 'text',
    TEXTGROUP_EMAIL = 'email',
    TEXTGROUP_NUMBER = 'number',
    TEXTGROUP_PASSWORD = 'password',
    TEXTGROUP_TEXTAREA = 'textarea',
    SELECT = 'select',
    SELECT_MULTI = 'select_multi',
    AUTOCOMPLETE = 'autocomplete',
    OPTION_GROUP = 'option_group',
    CHECKBOX = 'checkbox',
    SWITCH = 'switch',
    TIME = 'time',
    DATE = 'date',
    BUTTON = 'button',
    UPLOADER = 'uploader',
    COMPONENT = 'component',
}

export default class IwFormConfig {
    name?: string;
    cssForm: string;
    formData: object = {};
    formGroups: Array<IwFormGroup>;
    // formInputs: Array<IwFormInput>;
    onError: IwFormOnError | undefined;
    onSuccess: IwFormOnSuccess | undefined;
    rethrowErrorOnSubmit: boolean;
    mySkipFormData: Array<IwFormType> = [
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
        skipFormData?: Array<IwFormType>;
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
        for (const group of (this.formGroups)) {
            theInput = group.formInputs.find(
                (input) => input.name === name
            )
            if (!theInput) {
                console.error(`${name} not found`, group.formInputs)
                return
            }
        }


        theInput!.selectConfig = config
    }

    buildFormData(formInputs: Array<IwFormInput>) {
        for (const theOption of formInputs) {
            if (typeof this.formData[theOption.name] === 'undefined') {
                if (this.mySkipFormData.indexOf(theOption.type)) continue;
                this.formData[theOption.name] = null;
            }
        }
    }
}
