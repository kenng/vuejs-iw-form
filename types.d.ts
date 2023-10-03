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
    /** Extract label text using the given key from the data object */
    labelKey?: string,
    showAll?: boolean,
    showNull?: boolean,
    /** Extract value text using the given key from the data object */
    valueKey?: string,
}

type IwFormSelectOptionParamWithCustomLabel =
    Omit<IwFormSelectOptionParam, 'labelKey'>
    & {
        /**
         * Generate a new custom label for dropdown options
         *
         * For usage example, see: {@link mapToDropdownOptionsWithCustomLabel}
         *
         * @param dataKey The key of the raw data object
         * @param dataVal The value of the raw data object
         * @returns A string for the new label
         */
        customLabel?(dataKey: string, dataVal: any): string
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

interface IwFormOnChangeUpdateInput {
    linkedInputName: string,
    newSelectConfig: IwFormInputSelectConfig
}

/**
 * TODO: components below is not yet ready
 * - autocomplete
 * - button
 * - switch
 * - time
 * - uploader
 */
type IIwFormType = 'autocomplete' |
    'button' |
    'checkbox' |
    'component' |
    'date' |
    'editor' |
    'email' |
    'label' |
    'number' |
    'password' |
    'select' |
    'separator' |
    'switch' |
    'text' |
    'textarea' |
    'time' |
    'uploader'

interface IwFormInputCore {
    // essential
    name: string;

    // optional
    autocomplete?: string;
    cssInput?: string;
    cssTextColor?: string;
    cssWrapper?: string;
    disabled?: boolean;  // disabled data is not sent. see shouldDehydrate to submit disabled data
    errorText?: string;
    foldable?: boolean;
    hasLabelForAttr?: boolean
    helperText?: string;
    isVisible?: boolean | Function;
    label?: string;
    onBlur?: Function;
    onChange?: Function;
    onChangeUpdateInput?: (item: IwFormInputCore, value: any, ...extra: any[]) => Promise<IwFormOnChangeUpdateInput>;
    onClickFn?: Function;
    optionGroupInline?: boolean;
    placeholder?: string;
    prefixIcon?: string;
    query?: ViPaginatedTableFilterInput;
    ref?: string;
    required?: boolean;
    rules?: Array<Function>;
    shouldDehydrate?: boolean;
    showPrefixIcon?: boolean;
    showSuffixIcon?: boolean;
    suffixIcon?: string;
    tooltip?: string | Object
    value?: any
    visibleOnData?: string[] // visible only if the form data is set
}

interface IwFormInputCheckbox extends IwFormInputCore {
    type: 'checkbox'

    checkBoxTrueValue?: string;
    checkBoxFalseValue?: string;
}

interface IwFormInputComponent extends IwFormInputCore {
    type: 'component'
    component: VueComponent;
}

interface IwFormInputDate extends IwFormInputCore {
    type: 'date'

    dateOptions?: IwFormCalendar;
    allowedDate?: Array<any>;
    allowedDateFn?: Function | string;
}

interface IwFormInputEditor extends IwFormInputCore {
    type: 'editor'

    config: IwFormEditorConfig
}

interface IwFormInputLabel {
    type: 'label',
    label: string
    cssWrapper?: string
}

interface IwFormInputSelect extends IwFormInputCore {
    type: 'select'
    selectConfig: IwFormInputSelectConfig
}

interface IwFormInputSeparator {
    type: 'separator'
    cssWrapper?: string
}

interface IwFormInputText extends IwFormInputCore {
    type: 'text' | 'email' | 'number' | 'password';
    clearable?: boolean
}

interface IwFormInputTextArea extends IwFormInputCore {
    type: 'textarea'

    textAreaRows?: number;
}

interface IwFormInputUploader extends IwFormInputCore {
    type: 'uploader'

    config: IwFormUploaderConfig
}

type IwFormInput = IwFormInputComponent
    | IwFormInputCheckbox
    | IwFormInputDate
    | IwFormInputEditor
    | IwFormInputLabel
    | IwFormInputSelect
    | IwFormInputSeparator
    | IwFormInputText
    | IwFormInputTextArea
    | IwFormInputUploader

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

interface IwFormEditorMenu {
    disabled?: () => boolean
    icon: string,
    markOption?: [name: string, attributes?: {}] | [attributes: {}]
    label: string
    markName?: 'blockquote' | 'bold' | 'bulletList' | 'italic' | orderedList | 'underline'
    onClick: () => void
    shortcutKey?: string,
    toggleable?: boolean
    type?: ''
}

interface IwFormEditorConfig {
    content?: string
    /** Edit content as plain text (HTML will not be parsed) */
    editAsPlainText?: boolean,
    maxContentSizeInBytes?: number
    maxImageUploadPixel?: number
    maxImageSizeInMb?: number
    onSave?: (content?: string) => void
    onImageUpload?: (file: File) => Promise<string>
    placeholder?: string
    showLabel?: boolean
}

interface IwFormEditorMenuColor extends IwFormEditorMenu {
    type: 'color'
    /** An array of colour names and values in hex or RGB string */
    colorList: Array<{ label?: string, value: string } | string>
    /* Whether to replace the default colour list with the supplied colorList */
    replaceDefault?: boolean,
    /** @param value IwFormColor class from utils/IwFormColor.ts */
    onChange: (value: IwFormColor) => void
}

interface IwFormEditorMenuSeparator {
    type: 'separator'
}

interface IwFormEditorMenuInput {
    type: 'input'
    inputType: string,
    label?: string
    icon?: string
    onInput: ($event: MouseEvent) => void
    shortcutKey?: string
    value?: any
}

interface IwFormEditorMenuVideo extends IwFormEditorMenu {
    type: 'video',
    onInsert: () => void,
}

type IwFormEditorMenus = IwFormEditorMenu | IwFormEditorMenuColor | IwFormEditorMenuSeparator | IwFormEditorMenuInput | IwFormEditorMenuVideo

type IwFormUploadType = 'image' | 'file' | 'csv'
