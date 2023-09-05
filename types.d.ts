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
    shouldDehydrate?: boolean;
    showPrefixIcon?: boolean;
    showSuffixIcon?: boolean;
    suffixIcon?: string;
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

interface IwFormInputLabel extends IwFormInputCore {
    type: 'label',
    name?: string
}

interface IwFormInputSelect extends IwFormInputCore {
    type: 'select'
    selectConfig: IwFormInputSelectConfig
}

interface IwFormInputSeparator extends IwFormInputCore {
    type: 'separator',
    name?: string
}

interface iwFormInputText extends IwFormInputCore {
    type: 'text' | 'email' | 'number' | 'password';
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

type IwFormInput = IwFormInputCore & (
    IwFormInputComponent
    | IwFormInputCheckbox
    | IwFormInputDate
    | IwFormInputEditor
    | IwFormInputLabel
    | IwFormInputSelect
    | IwFormInputSeparator
    | IwFormInputText
    | IwFormInputTextArea
)

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
    maxImageUploadPixel?: number
    maxImageSizeInMb?: number
    onSave?: (content?: string) => void
    onImageUpload?: (file: File) => Promise<string>
    placeholder?: string
    showLabel?: boolean
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

type IwFormEditorMenus = IwFormEditorMenu | IwFormEditorMenuSeparator | IwFormEditorMenuInput
