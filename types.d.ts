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

interface IwFormOnChangeUpdateInput {
    linkedInputName: string,
    newSelectConfig: IwFormInputSelectConfig
}

type IIwFormType = 'label' | 'separator' | 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'autocomplete' | 'option_group' | 'checkbox' | 'switch' | 'time' | 'date' | 'button' | 'uploader' | 'component'

interface IwFormInputCore {
    // essential
    name: string;
    type: Exclude<IIwFormType, 'checkbox' | 'component' | 'date' | 'select' | 'submit-btn' | 'textarea'>

    // optional
    autocomplete?: string;
    cssInput?: string;
    cssTextColor?: string;
    cssWrapper?: string;
    disabled?: boolean;
    errorText?: string;
    foldable?: boolean;
    helperText?: string;
    isVisible?: boolean | Function;
    label?: string;
    onBlur?: Function;
    onChange?: Function;
    onChangeUpdateInput?: (item: IwFormInput, value: any, ...extra: any[]) => Promise<IwFormOnChangeUpdateInput>;
    onClickFn?: Function;
    optionGroupInline?: boolean;
    placeholder?: string;
    prefixIcon?: string;
    query?: ViPaginatedTableFilterInput;
    ref?: string;
    required?: boolean;
    rules?: Array<Function>;
    showPrefixIcon?: boolean;
    showSuffixIcon?: boolean;
    suffixIcon?: string;
    value?: any
    visibleOnData?: string[] // visible only if the form data is set

}
interface IwFormInputComponent extends IwFormInputCore {
    type: 'component'

    component?: VueComponent;
}

interface IwFormInputDate extends IwFormInputCore {
    type: 'date'

    dateOptions?: IwFormCalendar;
    allowedDate?: Array<any>;
    allowedDateFn?: Function | string;
}

interface IwFormInputCheckbox extends IwFormInputCore {
    type: 'checkbox'

    checkBoxTrueValue?: string;
    checkBoxFalseValue?: string;
}

interface IwFormInputSelect extends IwFormInputCore {
    type: 'select'
    selectConfig: IwFormInputSelectConfig
}

interface IwFormInputTextArea extends IwFormInputCore {
    type: 'textarea'

    textAreaRows?: number;
}

interface IwFormInputUploader extends IwFormInputCore {
    type: 'uploader'

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

type IwFormInput = IwFormInputCore | IwFormInputComponent | IwFormInputCheckbox | IwFormInputDate | IwFormInputSelect | IwFormInputTextArea

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
