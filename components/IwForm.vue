<script setup lang='ts'>
import { ref, PropType } from 'vue'
import { Icon } from '@iconify/vue';
import IwFormConfig, { IwFormType } from '../utils/IwFormConfig';
import IwObject from '../utils/IwObject'
import EasepickCalendar from './EasepickCalendar.vue';
import VueMultiSelect from './VueMultiSelect.vue';


//////////////////////////////////////////////////////////////////////
//  Emit & Props
//////////////////////////////////////////////////////////////////////
const IwFormTypeTextGroup: Array<IwFormType> = [
  IwFormType.TEXTGROUP_TEXT,
  IwFormType.TEXTGROUP_EMAIL,
  IwFormType.TEXTGROUP_NUMBER,
  IwFormType.TEXTGROUP_PASSWORD,
  IwFormType.TEXTGROUP_TEXTAREA,
];

const emit = defineEmits(['change', 'reset-input'])

const props = defineProps({
  // required
  myForm: {
    type: Object as PropType<IwFormConfig>,
    required: true,
  },

  // optional, sorted by alphabet
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  css: {
    type: Object as PropType<IwFormStyle>,
    default: {
      cssSubmitBtnWrapper: 'iwFormInputWrapper',
      cssResetBtnWrapper: 'iwFormResetBtnWrapper',
    },
  },
  isReadOnly: {
    type: Boolean,
    default: false,
  },
  onSubmit: {
    type: Function as PropType<(data: { [key: string]: any }) => void>,
    required: false,
  },
  onReset: {
    type: Function,
    required: false,
  },
  resetIgnored: {
    type: Object as PropType<string[] | (() => string[])>,
    default: () => [],
  },
  resetText: {
    type: String,
    default: 'Reset',
  },
  showCancelBtn: {
    type: Boolean,
    default: false,
  },
  showResetBtn: {
    type: Boolean,
    default: true,
  },
  showSubmitBtn: {
    type: Boolean,
    default: true,
  },
  showCloseBtn: {
    type: Boolean,
    default: false,
  },
  submitText: {
    type: String,
    default: 'Submit',
  },
  submitAgainText: {
    type: String,
    default: 'Submit Again',
  },
  title: {
    type: String,
    default: '',
  },
  canSubmitAgain: {
    type: Boolean,
    default: true,
  },
  resetOnSubmit: {
    type: Boolean,
    default: true,
  },
});

//////////////////////////////////////////////////////////////////////
//  Variables
//////////////////////////////////////////////////////////////////////
const IwFormTypeEnum = IwFormType
const formId = (new Date()).getTime() + Math.random() * 10000
let totalSubmission = 0;
let canSubmitAgain = props.canSubmitAgain;
// let dialogIsOpen = false;

// refs
const myFormData = ref({})
const errors = ref({})
const formErrorMsg = ref('')
const inputRefs = ref([])

//////////////////////////////////////////////////////////////////////
//  Functions
//////////////////////////////////////////////////////////////////////
function getAriaLabel(item: IwFormInput): string {
  if (item.disabled) return 'Input disabled';
  return 'form input'
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

  for (const item of props.myForm.formInputs) {
    if (!validate(item, myFormData.value[item.name])) {
      validated = false
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

async function onChange(item: IwFormInput, val: any) {
  if (item.onChange) item.onChange(item, val)
  if (item.onChangeUpdateInput) {
    const res = await item.onChangeUpdateInput(item, val)
  }

  emit('change', { item, val })
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

function selectInputOnChange(item: IwFormInput,
  newlySelected: IwFormInputSelectOption,
  selected: IwFormInputSelectOption | Array<IwFormInputSelectOption>) {

  let key = 'value'
  key = item.selectConfig!.keyName
  if (!item.selectConfig!.multiple) {
    myFormData.value[item.name] = selected[key]
  } else {
    myFormData.value[item.name] = []
    if (Array.isArray(selected)) {
      selected.forEach((selected: IwFormInputSelectOption) => {
        myFormData.value[item.name].push(selected.value)
      });
    }
  }

  if (validate(item, selected)) {
    delete errors.value[item.name]
  }

  onChange(item, selected)
}

function dateOnChange(item: IwFormInput, val: any) {
  myFormData.value[item.name] = val
  if (validate(item, val)) {
    delete errors.value[item.name]
  }

  onChange(item, val)
}

function inputOnReset(item: IwFormInput) {
  myFormData.value[item.name] = null
  emit('reset-input', { item })
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
  if (typeof props.resetIgnored === 'function') {
    resetIgnored = props.resetIgnored()
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

  setCanSubmitAgain(false);
  if (props.onReset) props.onReset()
}

function removeDisabledInputValue(): Object {
  const formData = {}
  props.myForm.formInputs.forEach((item) => {
    if (!item.disabled) {
      const name = item.name
      formData[name] = myFormData.value[name]
    }
  })

  return formData
}

async function formOnSubmit(ev: Event) {
  if (!validateAll()) return

  if (totalSubmission == 0) {
    try {
      if (props.onSubmit) {
        const data = removeDisabledInputValue()
        await props.onSubmit(data)
        if (props.myForm.onSuccess) props.myForm.onSuccess()
      }
    } catch (err: any) {
      console.error(err)
      formErrorMsg.value = err.message
      // TODO:
      if (props.myForm.onError) props.myForm.onError(err.message)
      if (props.myForm.rethrowErrorOnSubmit) throw err
    }
    // Prompt Dialog
    // dialogIsOpen = true;
  } else if (canSubmitAgain) {
    submitConfirmed();
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
function setCanSubmitAgain(canSubmitAgainParam: boolean) {
  if (canSubmitAgainParam) {
    canSubmitAgain = canSubmitAgainParam
  } else if (props.canSubmitAgain) {
    canSubmitAgain = true;
  }
}

function initFormData() {
  if (props.myForm.formData && Object.keys(props.myForm.formData).length > 1) {
    myFormData.value = JSON.parse(JSON.stringify(props.myForm.formData))
  }

  for (const item of props.myForm.formInputs) {
    if (!myFormData.value[item.name]) myFormData.value[item.name] = null
  }
}

//////////////////////////////////////////////////////////////////////
// export & expose
//////////////////////////////////////////////////////////////////////
defineExpose({ getFormData })

//////////////////////////////////////////////////////////////////////
// init
//////////////////////////////////////////////////////////////////////
initFormData();
</script>

<template>
  <div class="iwFormWrapper">
    <form :class="myForm.cssForm"
          @submit.prevent.stop='formOnSubmit'
          @reset.prevent.stop='formOnReset'>
      <slot name='buttonsTop' />
      <div v-for="(item, key) in myForm.formInputs"
           :key="item.name"
           :class="getCssWrapper(item.cssWrapper, props.isReadOnly)">
        <template name="label"
                  v-if='IwFormTypeEnum.LABEL === (item.type)'>
          <div></div>
        </template>
        <template name="separator"
                  v-else-if='IwFormTypeEnum.SEPARATOR === (item.type)'>
          <hr>
        </template>
        <template name="text-group"
                  v-else-if='IwFormTypeTextGroup.indexOf(item.type) >= 0'>
          <label :for="`${formId}-${item.name}`"
                 class="iwFormInputLabel">{{ setLabel(item) }}</label>
          <div class="mb-2 relative">
            <div v-if="item.showPrefixIcon"
                 class="iwFormInputPrependIcon">
              <Icon class="w-5 h-5 text-gray-500 dark:text-gray-400"
                    :icon="item.prefixIcon!"></Icon>
            </div>
            <input :key="key"
                   :id="`${formId}-${item.name}`"
                   :name="item.name"
                   :value="myFormData[item.name]"
                   :aria-label="getAriaLabel(item)"
                   @input="(event) => onInput(item, (event.target as HTMLInputElement).value)"
                   @change="(event) => onChange(item, (event.target as HTMLInputElement).value)"
                   @blur="(_) => onBlur(item, myFormData[item.name])"
                   @focus="(_) => onFocus(item, myFormData[item.name])"
                   :type="(item.type)"
                   :class="getInputCss(item)"
                   :placeholder="item.placeholder"
                   :rules="item.rules"
                   :disabled="isDisabled(item.disabled, isReadOnly)"
                   :ref="getRef(item)"
                   :required="setRequired(item)" />
            <p class="iwFormInputHelperText">
              <template v-if="errors[item.name]"><span class="iwFormInputErrorText">{{ errors[item.name] }}</span></template>
              <template v-else> {{ item.helperText }} </template>
            </p>
          </div>
        </template>
        <template name="select-multi"
                  v-else-if="IwFormTypeEnum.SELECT === (item.type)">
          <template v-if='!isReadOnly'>
            <label :for="`${formId}-${item.name}`"
                   class="iwFormInputLabel">{{ setLabel(item) }}</label>
            <VueMultiSelect :config="item.selectConfig"
                            @changed="(newSelected, selected) => selectInputOnChange(item, newSelected, selected)"
                            :disabled="item.disabled" />
            <p class="iwFormInputHelperText">
              <template v-if="errors[item.name]"><span class="iwFormInputErrorText">{{ errors[item.name] }}</span></template>
              <template v-else> {{ item.helperText }} </template>
            </p>
          </template>
          <template v-else>
            <input type="text"
                   v-model='myFormData[item.name]'
                   :label='item.label'
                   disable />
          </template>
        </template>
        <template v-else-if='IwFormTypeEnum.CHECKBOX === (item.type)'>
          <input :id="`${formId}-${item.name}`"
                 type="checkbox"
                 v-model="myFormData[item.name]"
                 :name="item.name"
                 :disable="item.disabled"
                 class="iwFormCheckbox">
          <label :for="`${formId}-${item.name}`"
                 class="iwFormInputLabelInline">{{ setLabel(item) }}</label>
        </template>
        <template v-else-if='IwFormTypeEnum.DATE === (item.type)'>
          <label :for="`${formId}-${item.name}`"
                 class="iwFormInputLabel">{{ setLabel(item) }}</label>
          <EasepickCalendar :id="`${formId}-${item.name}`"
                            ref="inputRefs"
                            :disabled="item.disabled"
                            @change="(val) => dateOnChange(item, val)"
                            @reset="inputOnReset(item)"
                            :options="item.dateOptions!"></EasepickCalendar>
          <p class="iwFormInputHelperText">
            <template v-if="errors[item.name]"><span class="iwFormInputErrorText">{{ errors[item.name] }}</span></template>
            <template v-else> {{ item.helperText }} </template>
          </p>
        </template>
      </div>
      <div :class="css.cssSubmitBtnWrapper ?? 'iwFormInputWrapper'">
        <template v-if="showSubmitBtn">
          <label :for="`${formId}-submit-btn`"
                 class="iwFormInputLabel"></label>
          <button :id="`${formId}-submit-btn`"
                  class="iwFormBtn iwFormSubmitBtn"
                  type="submit"> {{ totalSubmission > 0 ? submitAgainText : submitText }} </button>
          <p class="iwFormInputHelperText"></p>
        </template>
      </div>
      <div :class="css.cssResetBtnWrapper ?? 'iwFormResetBtnWrapper'">
        <template v-if="showResetBtn">
          <button class="iwFormResetBtn"
                  @click="formOnReset"
                  type="button">{{ resetText }}</button>
        </template>
      </div>
    </form>
    <div v-if="formErrorMsg"
         class="iwFormAlertError"
         role="alert">
      <span>{{ formErrorMsg }}</span>
    </div>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css">
</style>
<style scoped>
</style>
