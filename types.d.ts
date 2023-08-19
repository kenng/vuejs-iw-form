/// <reference types="@easepick/core/dist/types" />
/// <reference types="@easepick/lock-plugin/dist/interface" />
/// <reference types="@easepick/amp-plugin/dist/interface" />

type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;


interface IwFormUseConfig {
    myForm: IwFormConfig,
    onSubmit?: IwFormOnSubmit | undefined,
    onReset?: Function,
    resetIgnored?: IwFormResetIgnored,
}

interface IwFormSubmit {
    (formData: any, formExtra?: any, ...param: any): any;
}

interface IwFormOnError {
    (msg: string): any;
}

interface IwFormOnSuccess {
    (msg?: string): any;
}

type IwFormOnSubmit = (data: { [key: string]: any }) => void

type IwFormResetIgnored = string[] | (() => string[])

type IwFormInputSelectOption = {
    label: string;
    value: string | number;
    color?: string
    // operator?: ViPaginatedFilterOps
    operator?: any
    disabled?: boolean
}

type IwFormInputSelectedOption = { value: number | string, label: string } | undefined

type IwFormInputSelectedKeys = number | number[] | string | string[] | undefined

interface IwFormSelectOptionParam {
    showAll?: boolean,
    showNull?: boolean,
}
type IwFormSelectOptionParamWithKey = IwFormSelectOptionParam & {
    keyName?: string
}

interface IwFormSelectProps {
    config: typeof IwFormInputSelectConfig,
    disabled?: boolean
}

interface IwFormGroup {
    css?: string;
    label?: string;
    formInputs: Array<IwFormInput>;
    showSubmitBtn?: boolean;
    submitBtn?: {
        css?: string
        label?: string
    }
}

interface IwFormInputBtn {
    type: 'submit-btn',
}

interface IwFormInput {
    // name in type will be the formData variable name as well
    foldable?: boolean;
    autocomplete?: string;
    name: string;
    ref?: string;
    type: IwFormType;
    disabled?: boolean;
    rules?: Array<Function>;
    required?: boolean;
    query?: ViPaginatedTableFilterInput;

    label?: string;
    placeholder?: string;
    helperText?: string;
    errorText?: string;

    cssTextColor?: string;
    cssWrapper?: string;
    cssInput?: string;

    textAreaRows?: number;

    showPrefixIcon?: boolean;
    prefixIcon?: string;
    showSuffixIcon?: boolean;
    suffixIcon?: string;

    component?: VueComponent;

    dateOptions?: IwFormCalendar;

    optionGroupInline?: boolean;

    checkBoxTrueValue?: string;
    checkBoxFalseValue?: string;

    allowedDate?: Array<any>;
    allowedDateFn?: Function | string;

    /**
     * @attr onBlurRevalidate will trigger validate() again if attribute `ref` is set
     */
    onBlur?: Function;
    onChange?: Function;
    onChangeUpdateInput?: (item: IwFormInput, value: any, ...extra: any[]) => Promise<IwFormOnChangeResponse>;
    onClickFn?: Function;
    isVisible?: boolean | Function;
    // visible only if the form data is set
    visibleOnData?: string[]

    selectConfig?: IwFormInputSelectConfig

    /**
     * @attr uploadedFilenameKey to specify the form data key
     * e.g. uploadedFilenameKey: "my_profile_photo"
     * after uploaded, this will be output as "my_profile_photo": "xxxx-uploaded-filename.jpg"
     * @attr uploadHeaders to set the HTTP header, e.g.
     * [{name: 'Content-Type', value: 'application/json'}, {name: 'Accept', value: 'application/json'}]
     * () => [{name: 'X-Custom-Timestamp', value: Date.now()}]
     * files => [{name: 'X-Custom-Count', value: files.length}]
     * @attr uploadFactoryFn this can be set to override `url, method, headers, formFields, fieldName, withCredentials, sendRaw`
     * e.g. uploadFactoryFn: function(files) {
     *   return new Promise((resolve) => {
     *     // simulating a delay of 2 seconds
     *     setTimeout(() => {
     *       resolve({
     *         url: 'http://localhost:4444/upload'
     *         method: xxx
     *         headers: xxx
     *       })
     *     }, 2000)
     *   })
     * }
     */
    uploadedFilenameKey?: string; // after uploaded, this will be populate the filename
    uploadURL?: string;
    /** @attr uploadAccept: '.jpg, .pdf, image' */
    uploadAccept?: string;
    uploadHeaders?: Array<object> | Function;
    uploadAutoUpload?: boolean;
    uploadIsMultiple?: boolean;
    uploadHasNoThumbnail?: boolean;
    uploadFactoryFn?: Function;
}

interface IwFormStyle {
    cssSubmitBtnWrapper?: string,
    cssResetBtnWrapper?: string,
    cssShowFoldBtnWrapper?: string,
}

interface IRuleData {
    value: any;
    myFormData?: any | undefined;
}

interface IIwFormRule {
    errMsg?: string;
    minLength?: number;
    required?: boolean;
    requireLetter?: boolean;
    requireNumber?: boolean;
    requireSymbol?: boolean;
}

type IwFormRuleResponse = (data: IRuleData) => boolean | string
type IwFormMethod = (data: any) => IwFormRuleResponse

type IwFormBtnType = 'button' | 'submit' | 'reset'
