<script setup lang='ts'>
// @unocss-include
import { ref } from 'vue'
import IwFormConfig, { IwFormType } from './utils/IwFormConfig';
import IwFormCalendar from './utils/IwFormCalendar';
import IwFormInputSelectConfig from './utils/IwFormInputSelectConfig';
import dayjs from 'dayjs'
import IwFormRule from './utils/IwFormRule';
import IwForm from './components/IwForm.vue';

interface FormSample {
    title: string
    form: IwFormConfig
}

const submit = (
    theFormData: any,
    // formExtra: any,
) => {
    // output[theformInputs[0].name] = theFormData;
    return Object.assign({}, theFormData);
};

const formTextName: FormSample = {
    title: 'Simple Text Form',
    form: new IwFormConfig({
        formData: {
            // company_name is defined, the company_name varialbe will be kept
            company_name: 'ABC Company',
            password: 'password123',
            password_confirmed: 'password123',
            //password is not defined here, so it will auto defined by IwFormConfig
        },
        // config: { isStyleDark },
        formInputs: [
            {
                name: 'company_name',
                label: 'Company Name',
                type: IwFormType.TEXTGROUP_TEXT,
                rules: [
                    // IwFormRule.minLength({
                    //     value: val,
                    //     min: 4,
                    //     required: true,
                    //     errMsg: 'Need a minimum of 4 characters.',
                    // }),

                    IwFormRule.required({}),
                    IwFormRule.userName({
                        errMsg:
                            'Invalid name format. It should contain only character',
                    }),
                ],
            },
            {
                name: 'password',
                type: IwFormType.TEXTGROUP_TEXT,
            },
            {
                name: 'password_confirmed',
                ref: 'ref_password_confirmed',
                type: IwFormType.TEXTGROUP_TEXT,
                rules: [IwFormRule.match({
                    errMsg: 'value must match to password',
                    formName: 'password',
                })],
                // onBlur: (myFormData, ref) => {
                //     ref.validate();
                // },
            },
            {
                name: 'phone',
                label: 'Phone',
                type: IwFormType.TEXTGROUP_TEXT,
                rules: [IwFormRule.phone({ required: true })],
            },
            {
                name: 'email',
                label: 'email',
                type: IwFormType.TEXTGROUP_TEXT,
                rules: [IwFormRule.required, IwFormRule.email({ required: true })],
            },
            {
                name: 'url',
                label: 'url',
                type: IwFormType.TEXTGROUP_TEXT,
                rules: [
                    IwFormRule.url({ required: true }),
                    IwFormRule.maxLength({ max: 20 }),
                ],
            },
            {
                name: 'number',
                label: 'number not null',
                type: IwFormType.TEXTGROUP_TEXT,
                rules: [
                    IwFormRule.minLength({ minLength: 3 }),
                    IwFormRule.notNull({}),
                    IwFormRule.isNumber({}),
                ],
            },
            {
                name: 'mydateAnyValidDate',
                label: 'any valid date',
                type: IwFormType.DATE,
                rules: [IwFormRule.isDate({})],
                dateOptions: new IwFormCalendar(),
            },
            {
                name: 'mydateValidAfterToday',
                label: 'valid date after today',
                type: IwFormType.DATE,
                rules: [IwFormRule.dateIsAfterIncludeToday({})],
                dateOptions: new IwFormCalendar(),
            },
            {
                name: 'mydateValidAfterTwoDays',
                label: 'valid date after 2 days',
                type: IwFormType.DATE,
                rules: [
                    IwFormRule.dateIsAfter({
                        afterDate: dayjs(dayjs()).add(2, 'day').endOf('day').format('YYYY-MM-DD')
                    }),
                ],
                dateOptions: new IwFormCalendar(),
            },
            {
                name: 'mydateValidBeforeToday',
                label: 'valid date before today',
                type: IwFormType.DATE,
                rules: [IwFormRule.dateIsBeforeIncludeToday({})],
                dateOptions: new IwFormCalendar(),
            },
            {
                name: 'mydateRange',
                label: 'Date Range',
                type: IwFormType.DATE,
                dateOptions: new IwFormCalendar({
                    enableRangePicker: true,
                }),
            },
            {
                name: 'mytime',
                label: 'valid time',
                type: IwFormType.TIME,
                rules: [IwFormRule.isValidTime({})],
            },
        ],
    })
};

const formSelectGender: FormSample = {
    title: 'Simple Gender Select Form',
    form: new IwFormConfig({
        formInputs: [
            {
                name: 'gender',
                label: 'gender',
                type: IwFormType.SELECT,
                // selectIsMapOptionToLabel: true,
                selectConfig: new IwFormInputSelectConfig([
                    {
                        label: 'Male',
                        value: 'M',
                    },
                    {
                        label: 'Female',
                        value: 'F',
                    },
                    {
                        label: 'Other',
                        value: 'O',
                    },
                    {
                        label: 'Invalid value',
                        value: 'Invalid',
                    },
                ]),
                rules: [IwFormRule.gender({})],
            },
        ],
    })
}

const formAutoComplete: FormSample = {
    title: 'Simple AutoComplete Form',
    form: new IwFormConfig({
        formInputs: [
            {
                name: 'food',
                label: 'Food',
                type: IwFormType.AUTOCOMPLETE,
                selectConfig: new IwFormInputSelectConfig([
                    {
                        label: 'Burger',
                        value: 'burger',
                    },
                    {
                        label: 'Chips',
                        value: 'chips',
                    },
                ]),
            },
        ],
    })
}

const formRadioBtn: FormSample = {
    title: 'Simple Radio Button Form',
    form: new IwFormConfig({
        formInputs: [
            {
                name: 'radioBtn',
                type: IwFormType.OPTION_GROUP,
                // disabled: true,
                selectConfig: new IwFormInputSelectConfig([
                    {
                        label: 'Battery too low',
                        value: 'bat',
                    },
                    {
                        label: 'beam light is dim',
                        value: 'light',
                        color: 'green',
                    },
                    {
                        label: 'engine oil replacement',
                        value: 'engine',
                        color: 'red',
                    },
                ]),
            },
        ],
    })
}

const formRadioBtnInlineDisabled: FormSample = {
    title: 'Simple Radio Button Inline Disabled Form',
    form: new IwFormConfig({
        formData: {
            radioBtnInline: 'engine',
        },
        formInputs: [
            {
                name: 'radioBtnInline',
                type: IwFormType.OPTION_GROUP,
                optionGroupInline: true,
                label: 'car issue',
                disabled: true,
                selectConfig: new IwFormInputSelectConfig([
                    {
                        label: 'Battery too low',
                        value: 'bat',
                    },
                    {
                        label: 'beam light is dim',
                        value: 'light',
                        color: 'green',
                    },
                    {
                        label: 'engine oil replacement',
                        value: 'engine',
                        color: 'red',
                    },
                ]),
            },
        ],
    })
}

const formCheckBoxSimple: FormSample = {
    title: 'Simple CheckBox Form',
    form: new IwFormConfig({
        formData: {
            result: 1,
        },
        formInputs: [
            {
                name: 'result',
                type: IwFormType.CHECKBOX,
                label: 'passed',
            },
        ],
    })
}

const formCheckBoxCustomValue: FormSample = {
    title: 'Simple CheckBox Form',
    form: new IwFormConfig({
        formData: {
            resultFail: 'failed',
        },
        formInputs: [
            {
                name: 'resultFail',
                type: IwFormType.CHECKBOX,
                label: 'failed',
                checkBoxTrueValue: 'failed',
                checkBoxFalseValue: 'passed',
            },
        ],
    })
}

const formDateAfter: FormSample = {
    title: 'Simple Date After Form',
    form: new IwFormConfig({
        formInputs: [
            {
                name: 'dateMin',
                type: IwFormType.DATE,
                label: 'min date, available after tomorrow',
                allowedDate: [getTomorrowDate()],
                allowedDateFn: 'min',
                dateOptions: new IwFormCalendar(),
            },
        ],
    })
}

const formDateMax: FormSample = {
    title: 'Simple Date Max Form',
    form: new IwFormConfig({
        formInputs: [
            {
                name: 'dateMax',
                type: IwFormType.DATE,
                label: 'max date, not available after today',
                allowedDate: [getTodayDate()],
                allowedDateFn: 'max',
                dateOptions: new IwFormCalendar(),
            },
        ],
    })
}

const formDateBetween: FormSample = {
    title: 'Simple Date Between Form',
    form: new IwFormConfig({
        formInputs: [
            {
                name: 'dateBetween',
                type: IwFormType.DATE,
                label: 'allowed date between date1 and date2',
                allowedDate: [getTodayDate(), getTomorrowDate()],
                allowedDateFn: 'between',
                dateOptions: new IwFormCalendar(),
            },
        ],
    })
}

const formDateCustomFunction: FormSample = {
    title: 'Simple Date Custom Function Form',
    form: new IwFormConfig({
        formInputs: [
            {
                name: 'dateCustomFn',
                type: IwFormType.DATE,
                label: 'custom function allowed date',
                allowedDate: [getTodayDate()],
                allowedDateFn: (item: any, mydate: any) => {
                    // this example we want to get date larger than today
                    return mydate >= item.allowedDate[0];
                },
                dateOptions: new IwFormCalendar(),
            },
        ],
    })
}

const formSingleUpload: FormSample = {
    title: 'Simple Single Upload Form',
    form: new IwFormConfig({
        formInputs: [
            {
                name: 'uploader',
                type: IwFormType.UPLOADER,
                label: 'Uploader Label',
                uploadURL: 'http://localhost:4444/upload',
                uploadAccept: '.jpg, .pdf, image/*',
                uploadAutoUpload: true,
            },
        ],
    })
}

const formMultipleUpload: FormSample = {
    title: 'Simple Multiple Upload Form',
    form: new IwFormConfig({
        formInputs: [
            {
                name: 'uploader',
                type: IwFormType.UPLOADER,
                label: 'Uploader Label',
                uploadURL: 'http://localhost:4444/upload',
                uploadAccept: '.jpg, .pdf, image/*',
                uploadIsMultiple: true,
                uploadAutoUpload: true,
                uploadHasNoThumbnail: true,
                cssTextColor: 'black',
                cssWrapper: 'col-xs-6',
            },
            {
                name: 'separator',
                type: IwFormType.SEPARATOR,
            },
            {
                name: 'label',
                type: IwFormType.LABEL,
                label: 'section label',
            },
        ],
    })
}

const formTime: FormSample = {
    title: 'Simple Time Form',
    form:
        new IwFormConfig({
            formInputs: [
                {
                    name: 'time',
                    type: IwFormType.TIME,
                    label: 'dating time',
                },
            ],
        })
}

const formTextMoreAttribute: FormSample = {
    title: 'Simple Text Form with Additional Attribute',
    form: new IwFormConfig({
        formInputs: [
            {
                name: 'Additional Attribute',
                type: IwFormType.TEXTGROUP_TEXT,
                label: 'Additional Attribute',
                placeholder: 'Additional Attribute',
                disabled: true,
                cssWrapper: 'col-xs-6',
                cssInput: 'q-my-none q-ml-xs q-mr-none',
            },
        ],
    })
}

const formSwitch: FormSample = {
    title: 'Simple Switch Form',
    form: new IwFormConfig({
        formData: {
            toggle_password_switch: true,
        },
        formInputs: [
            {
                name: 'toggle_password_switch',
                label: 'Update password',
                type: IwFormType.SWITCH,
                onChange: (myformdata: any) => {
                    if (!myformdata.toggle_switch) myformdata.password = null;
                },
            },
            {
                name: 'password',
                type: IwFormType.TEXTGROUP_PASSWORD,
                isVisible: (mydata: any) => {
                    if (mydata.toggle_password_switch) return true;
                    return false;
                },
            },
        ],
    })
}

const formSwitchWithPropData: FormSample = {
    title: 'Simple Switch Form with onChange',
    form: new IwFormConfig({
        formInputs: [
            {
                name: 'toggle_switch_with_prop',
                label: 'test prop - see console',
                type: IwFormType.SWITCH,
                onChange: (myformdata: any, changeprop: any) => {
                    console.log(myformdata);
                    console.log(changeprop);
                },
            },
        ],
    })
}

const gridForm: FormSample = {
    title: 'Simple Grid Form',
    form: new IwFormConfig({
        cssForm: 'grid grid-cols-3 gap-1',
        formInputs: [
            {
                type: IwFormType.TEXTGROUP_TEXT,
                name: 'name1',
                label: 'Input with three columns',
                cssWrapper: 'col-span-3',
            },
            {
                type: IwFormType.TEXTGROUP_TEXT,
                name: 'name2',
                label: 'Input with one column',
                cssWrapper: 'col-span-1',
            },
            {
                type: IwFormType.TEXTGROUP_TEXT,
                name: 'name3',
                label: 'Input with 2 columns',
                cssWrapper: 'col-span-2',
            },
        ]
    })
}

function getDate(dayToAdd = 0) {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1; // Add 1 to get the month index starting from 1
    let day = today.getDate() + dayToAdd;

    return `year/${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`
}

function getTodayDate() {
    return getDate()
}

function getTomorrowDate() {
    return getDate(1)
}

const forms: FormSample[] = [
    formTextName,
    formSelectGender,
    formAutoComplete,
    formRadioBtn,
    formRadioBtnInlineDisabled,
    formCheckBoxSimple,
    formCheckBoxCustomValue,
    formDateAfter,
    formDateMax,
    formDateBetween,
    formDateCustomFunction,
    formSingleUpload,
    formMultipleUpload,
    formTime,
    formTextMoreAttribute,
    formSwitch,
    formSwitchWithPropData,
]

// will be populated the template refs value after mount
const itemRefs = ref([] as Array<any>)

function getAllFormDate() {
    let output = {} as { [key: string]: any };
    for (let index = 0; index < forms.length; index++) {
        // output[`form${index}`] = itemRefs.value[index].getFormData();
    }
    return Object.assign({}, output);
}

</script>

<template>
    <section class="p-6">
        Section:
        <a href="#basic-example">
            <button type="button"
                    class="bg-transparent text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Basic Example</button>
        </a>

        <a href="#grid-style">
            <button type="button"
                    class="bg-transparent text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Grid Style</button>

        </a>

    </section>
    <section id="basic-example"
             class="border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl mt-6 p-6">
        <div v-for='(theForm, index) in forms'
             :key="index"
             class="flex">
            <div class="w-2/4">
                <h3 class="text-lg decoration-4 underline">[ Form ]: {{ theForm.title }}</h3>
                <IwForm :on-submit="submit"
                        :myForm="theForm.form"
                        :refs="(el: any) => itemRefs.push(el)"></IwForm>
                <hr>
            </div>
        </div>
    </section>

    <hr class="my-6">
    <h1 class="p-6 text-5xl"
        id="grid-style">Styling with Grid</h1>

    <section class="border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl mt-6 p-6">
        <IwForm :myForm="gridForm.form"></IwForm>
    </section>
</template>

<style scoped>
</style>
