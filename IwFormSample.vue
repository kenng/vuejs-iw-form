<script setup lang='ts'>
// @unocss-include
import { ref, VNodeRef } from 'vue'
import IwFormConfig, { IwFormType } from './utils/IwFormConfig';
import IwFormCalendar from './utils/IwFormCalendar';
import IwFormInputSelectConfig from './utils/IwFormInputSelectConfig';
import dayjs from 'dayjs'
import IwFormRule from './utils/IwFormRule';
import IwForm from './components/IwForm.vue';
import IwFormSampleComponent from './IwFormSampleComponent.vue';

interface FormSample {
    title: string
    form: IwFormConfig
}

const basicFormsRef = ref<InstanceType<typeof IwForm>[]>([])
const gridFormRef = ref<InstanceType<typeof IwForm>>()

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
        formGroups: [{
            css: 'grid md:grid-cols-3',
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
        }],
    })
};

const gender = (isMultiple: boolean = false) => new IwFormInputSelectConfig([
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
], {
    multiple: isMultiple
})

let selectedColorIndex = 0
const color = [
    new IwFormInputSelectConfig([
        {
            label: 'Red',
            value: 'red',
        },
    ], {
        multiple: true,
        selected: 'red',
    }),

    new IwFormInputSelectConfig([
        {
            label: 'Blue',
            value: 'blue',
        },
    ])

]

const countries = new IwFormInputSelectConfig([
    {
        label: 'Malaysia',
        value: 'MY',
    },
    {
        label: 'Singapore',
        value: 'SG',
    },
    {
        label: 'Other',
        value: 'O',
    },
], {
    multiple: true,
    selected: ['MY', 'SG'],
})

const formSelectGender: FormSample = {
    title: 'Simple Gender Select Form',
    form: new IwFormConfig({
        formGroups: [{
            formInputs: [
                {
                    name: 'gender',
                    label: 'gender',
                    type: IwFormType.SELECT,
                    // selectIsMapOptionToLabel: true,
                    selectConfig: gender(),
                    onChange: (item: any,
                        val: IwFormInputSelectedKeys,
                        selectedRaw: IwFormInputSelectedOption,
                        justSelected: IwFormInputSelectedOption,
                        theForm: IwFormConfig) => {
                        console.log(item)
                        console.log(val)
                        console.log(selectedRaw)
                        console.log(justSelected)

                        // --- update color dropdown
                        if ('M' === val) {
                            selectedColorIndex = 1
                        } else {
                            selectedColorIndex = 0
                        }
                        theForm.updateSelectInput('color', color[selectedColorIndex])
                    },
                    rules: [IwFormRule.gender({})],
                },
                {
                    name: 'color',
                    label: 'color (changed based on gender)',
                    type: IwFormType.SELECT,
                    // selectIsMapOptionToLabel: true,
                    selectConfig: color[selectedColorIndex],
                    rules: [],
                },
                {
                    name: 'countries',
                    type: IwFormType.SELECT,
                    label: 'Select all the related countries (multiple choices)',
                    selectConfig: countries
                }
            ],
        }
        ]
    })
}

const formAutoComplete: FormSample = {
    title: 'Simple AutoComplete Form',
    form: new IwFormConfig({
        formGroups: [{
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
        }
        ]
    })
}

const formRadioBtn: FormSample = {
    title: 'Simple Radio Button Form',
    form: new IwFormConfig({
        formGroups: [{
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
        }
        ]
    })
}

const formRadioBtnInlineDisabled: FormSample = {
    title: 'Simple Radio Button Inline Disabled Form',
    form: new IwFormConfig({
        formData: {
            radioBtnInline: 'engine',
        },
        formGroups: [{
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
        }
        ]
    })
}

const formCheckBoxSimple: FormSample = {
    title: 'Simple CheckBox Form',
    form: new IwFormConfig({
        formData: {
            result: 1,
        },
        formGroups: [{
            formInputs: [
                {
                    name: 'result',
                    type: IwFormType.CHECKBOX,
                    label: 'passed',
                },
                {
                    name: 'preferred',
                    type: IwFormType.CHECKBOX,
                    label: 'Preferred choice',
                    checkBoxTrueValue: 'Yes',
                    checkBoxFalseValue: 'No',
                },
            ],
        }
        ]
    })
}

const formCheckBoxCustomValue: FormSample = {
    title: 'Simple CheckBox Form',
    form: new IwFormConfig({
        formData: {
            resultFail: 'failed',
        },
        formGroups: [{
            formInputs: [
                {
                    name: 'resultFail',
                    type: IwFormType.CHECKBOX,
                    label: 'failed',
                    checkBoxTrueValue: 'failed',
                    checkBoxFalseValue: 'passed',
                },
            ],
        }
        ]
    })
}

const formDateAfter: FormSample = {
    title: 'Simple Date After Form',
    form: new IwFormConfig({
        formGroups: [{
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
        }
        ]
    })
}

const formDateMax: FormSample = {
    title: 'Simple Date Max Form',
    form: new IwFormConfig({
        formGroups: [{
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
        }
        ]
    })
}

const formDateBetween: FormSample = {
    title: 'Simple Date Between Form',
    form: new IwFormConfig({
        formGroups: [{
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
        }
        ]
    })
}

const formDateCustomFunction: FormSample = {
    title: 'Simple Date Custom Function Form',
    form: new IwFormConfig({
        formGroups: [{
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
        }
        ]
    })
}

const formSingleUpload: FormSample = {
    title: 'Simple Single Upload Form',
    form: new IwFormConfig({
        formGroups: [{
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
        }
        ]
    })
}

const formMultipleUpload: FormSample = {
    title: 'Simple Multiple Upload Form',
    form: new IwFormConfig({
        formGroups: [{
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
        }
        ]
    })
}

const formTime: FormSample = {
    title: 'Simple Time Form',
    form:
        new IwFormConfig({
            formGroups: [{
                formInputs: [
                    {
                        name: 'time',
                        type: IwFormType.TIME,
                        label: 'dating time',
                    },
                ],
            }
            ]
        })
}

const formTextMoreAttribute: FormSample = {
    title: 'Simple Text Form with Additional Attribute',
    form: new IwFormConfig({
        formGroups: [{
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
        }
        ]
    })
}

const formSwitch: FormSample = {
    title: 'Simple Switch Form',
    form: new IwFormConfig({
        formData: {
            toggle_password_switch: true,
        },
        formGroups: [{
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
        }
        ]
    })
}

const formSwitchWithPropData: FormSample = {
    title: 'Simple Switch Form with onChange',
    form: new IwFormConfig({
        formGroups: [{
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
        }
        ]
    })
}


const formWithDynamicComponent: FormSample = {
    title: 'form with dynamic component',
    form: new IwFormConfig({
        formGroups: [{
            formInputs: [
                {
                    name: 'name',
                    type: IwFormType.TEXTGROUP_TEXT,
                },
                {
                    name: 'formWithDynamicComponent',
                    type: IwFormType.COMPONENT,
                    component: IwFormSampleComponent,
                },
            ],
        }
        ]
    })
}

const gridForm: FormSample = {
    title: 'Simple Grid Form',
    form: new IwFormConfig({
        formGroups: [{
            css: 'grid grid-cols-3 gap-1',
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
                {
                    type: IwFormType.TEXTGROUP_TEXT,
                    name: 'name4',
                    label: 'Input with one column',
                    cssWrapper: 'col-span-1',
                },
                {
                    type: IwFormType.SUBMIT_BTN,
                    name: 'submitBtn',
                    cssWrapper: '',
                }
            ]
        }
        ]
    })
}

const multipleGroups: FormSample = {
    title: 'Multiple formGroups',
    form: new IwFormConfig({
        formGroups: [
            {
                label: 'Group 1',
                css: 'grid grid-cols-3 gap-1',
                formInputs: [
                    {
                        type: IwFormType.TEXTGROUP_TEXT,
                        name: 'name1',
                        label: 'Surname',
                    },
                    {
                        type: IwFormType.TEXTGROUP_TEXT,
                        name: 'name2',
                        label: 'Family name',
                    },
                ]
            },
            {
                label: 'Group 2',
                formInputs: [
                    {
                        type: IwFormType.TEXTGROUP_TEXT,
                        name: 'gender',
                        label: 'gender',
                    },
                    {
                        type: IwFormType.TEXTGROUP_TEXT,
                        name: 'Address',
                        label: 'address',
                    },
                ]
            }
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
    formWithDynamicComponent,
    multipleGroups,
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
    <div class="title">
        Section:
        <a href="#basic-example">
            <button type="button"
                    class="bg-transparent text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Basic
                Example</button>
        </a>

        <a href="#grid-style">
            <button type="button"
                    class="bg-transparent text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Grid
                Style</button>

        </a>
    </div>

    <section class="p-12 basic-form">
        <div id="basic-example"
             class="border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl mt-6 p-6">
            <div v-for='(theForm, index) in forms'
                 :key="index"
                 class="flex">
                <div class="w-2/4">
                    <h3 class="text-lg decoration-4 underline">[ Form ]: {{ theForm.title }}</h3>
                    <IwForm ref="basicFormsRef"
                            :on-submit="submit"
                            :myForm="theForm.form"
                            :refs="(el: any) => itemRefs.push(el)"></IwForm>
                    <hr>
                </div>
                <div class="w-2/4 pl-6"
                     v-if="basicFormsRef[index]">
                    Output: <br><br>
                    <div v-for="(item, key) in basicFormsRef[index].getFormData()">
                        {{ `${key}: ${item}` }}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <hr class="my-6">
    <h1 class="p-6 text-5xl"
        id="grid-style">Styling with Grid</h1>

    <section class="flex border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl mt-6 p-6">
        <div class="w-2/4">
            <h3 class="mb-6"> Objective: to style inputs using grid. Submit Button as the last element of the inputs.
            </h3>
            <IwForm ref="gridFormRef"
                    :showSubmitBtn="false"
                    :myForm="gridForm.form"></IwForm>
        </div>
        <div class="w-2/4 pl-6"
             v-if="gridFormRef">
            <div v-for="(item, key) in gridFormRef.getFormData()">
                {{ `${key}: ${item}` }}
            </div>
        </div>
    </section>
</template>

<style scoped>
</style>
