<script setup lang='ts'>
import { PropType } from 'vue'
import { Icon } from '@iconify/vue';
import IwFormConfig, { IwFormType } from '../utils/IwFormConfig';
import EasepickCalendar from './EasepickCalendar.vue';
import VueMultiSelect from './VueMultiSelect.vue';
import useIwForm from '../composables/useIwForm';


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
    type: Function as PropType<IwFormOnSubmit>,
    required: false,
  },
  onReset: {
    type: Function,
    required: false,
  },
  resetIgnored: {
    type: Object as PropType<IwFormResetIgnored>,
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
  showSubmitLoading: {
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

const formSubmitAgainText = props.submitAgainText ?? props.submitText

//////////////////////////////////////////////////////////////////////
//  Variables
//////////////////////////////////////////////////////////////////////
const IwFormTypeEnum = IwFormType
const formId = (new Date()).getTime() + Math.random() * 10000
const {
  // variables
  errors,
  formErrorMsg,
  inputRefs,
  keys,
  myFormData,
  totalSubmission,

  // functions
  getAriaLabel,
  getCss,
  getInputCss,
  onInput,
  onBlur,
  onFocus,
  setLabel,
  setRequired,
  getRef,
  isDisabled,
  getFormData,
  formOnReset,
  formOnSubmit,
  initRenderCallback,
  initFormData,
  validate,
  isVisible,
  submitIsLoading,
} = useIwForm({
  myForm: props.myForm,
  onSubmit: props.onSubmit,
  onReset: props.onReset,
  resetIgnored: props.resetIgnored,
})

const emit = defineEmits(['change', 'reset-input'])

//////////////////////////////////////////////////////////////////////
//  Functions
//////////////////////////////////////////////////////////////////////

async function onChange(item: IwFormInput, val: any, ...extra: any[]) {
  if (item.onChange) item.onChange(item, val, ...extra)
  if (item.onChangeUpdateInput) {
    const res = await item.onChangeUpdateInput(item, val, ...extra)
  }

  emit('change', { item, val, ...extra })
}

function inputOnReset(item: IwFormInput) {
  myFormData.value[item.name] = null
  emit('reset-input', { item })
}


function selectInputOnChange(item: IwFormInput,
  selectedKeys: IwFormInputSelectedKeys,
  selectedRaw: IwFormInputSelectedOption | IwFormInputSelectedOption[],
  justSelected: IwFormInputSelectedOption,
  theForm: IwFormConfig
) {
  myFormData.value[item.name] = selectedKeys

  if (validate(item, selectedKeys)) {
    delete errors.value[item.name]
  }

  onChange(item, selectedKeys, selectedRaw, justSelected, theForm)
}

function dateOnChange(item: IwFormInput, val: any) {
  myFormData.value[item.name] = val
  if (validate(item, val)) {
    delete errors.value[item.name]
  }

  onChange(item, val)
}

async function myFormOnSubmit(ev: Event) {
  submitIsLoading.value = true
  await formOnSubmit(ev)
  submitIsLoading.value = true
}

//////////////////////////////////////////////////////////////////////
// export & expose
//////////////////////////////////////////////////////////////////////
defineExpose({ getFormData })

//////////////////////////////////////////////////////////////////////
// init
//////////////////////////////////////////////////////////////////////
initFormData();
initRenderCallback();

</script>

<template>
  <div class="iwFormWrapper">
    <form :class="myForm.cssForm"
          @submit.prevent.stop='myFormOnSubmit'
          @reset.prevent.stop='formOnReset'>
      <slot name='buttonsTop' />
      <div v-for="(group, groupKey) in myForm.formGroups"
           :key="groupKey"
           :class="group.css">
        <div v-for="(item, key) in group.formInputs"
             :key="keys[item.name]"
             :class="getCss(item, { cssArray: [item.cssWrapper ?? 'iwFormInputWrapper'], cssObj: { iwFormReadOnly: props.isReadOnly } })">
          <template name="label"
                    v-if='IwFormTypeEnum.LABEL === (item.type)'>
            <div :class="getCss(item)">{{ item.label }}</div>
          </template>

          <template name="separator"
                    v-else-if='IwFormTypeEnum.SEPARATOR === (item.type)'>
            <hr class="iwFormHr">
          </template>

          <template name="text-group"
                    v-else-if='IwFormTypeTextGroup.indexOf(item.type) >= 0'>
            <template v-if="isVisible(item)">
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
                  <template v-if="errors[item.name]"><span class="iwFormInputErrorText">{{ errors[item.name]
                  }}</span></template>
                  <template v-else> {{ item.helperText }} </template>
                </p>
              </div>
            </template><!-- isVisible(item) -->
          </template>

          <template name="select"
                    v-else-if="IwFormTypeEnum.SELECT === (item.type)">
            <template v-if="isVisible(item)">
              <template v-if='!isReadOnly'>
                <label :for="`${formId}-${item.name}`"
                       class="iwFormInputLabel">{{ setLabel(item) }}</label>
                <VueMultiSelect :config="item.selectConfig"
                                ref="inputRefs"
                                @changed="(selectedKeys, selectedRaw, justSelected) =>
                                  selectInputOnChange(item, selectedKeys, selectedRaw, justSelected, myForm)"
                                @removed="(selectedKeys, selectedRaw, justRemoved) =>
                                  selectInputOnChange(item, selectedKeys, selectedRaw, justRemoved, myForm)"
                                :disabled="item.disabled" />
                <p class="iwFormInputHelperText">
                  <template v-if="errors[item.name]"><span class="iwFormInputErrorText">{{ errors[item.name]
                  }}</span></template>
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
          </template>

          <template name="checkbox"
                    v-else-if='IwFormTypeEnum.CHECKBOX === (item.type)'>
            <template v-if="isVisible(item)">
              <input :id="`${formId}-${item.name}`"
                     type="checkbox"
                     v-model="myFormData[item.name]"
                     :name="item.name"
                     :disable="item.disabled"
                     class="iwFormCheckbox"
                     :true-value="item.checkBoxTrueValue ?? true"
                     :false-value="item.checkBoxFalseValue ?? false">
              <label :for="`${formId}-${item.name}`"
                     class="iwFormInputLabelInline">{{ setLabel(item) }}</label>
            </template>
          </template>

          <template name="date"
                    v-else-if='IwFormTypeEnum.DATE === (item.type)'>
            <template v-if="isVisible(item)">
              <label :for="`${formId}-${item.name}`"
                     class="iwFormInputLabel">{{ setLabel(item) }}</label>
              <EasepickCalendar :id="`${formId}-${item.name}`"
                                ref="inputRefs"
                                :disabled="item.disabled"
                                @change="(val) => dateOnChange(item, val)"
                                @reset="inputOnReset(item)"
                                :options="item.dateOptions!"></EasepickCalendar>
              <p class="iwFormInputHelperText">
                <template v-if="errors[item.name]"><span class="iwFormInputErrorText">{{ errors[item.name]
                }}</span></template>
                <template v-else> {{ item.helperText }} </template>
              </p>
            </template>
          </template>

          <template name="component"
                    v-else-if="IwFormTypeEnum.COMPONENT === (item.type)">
            <component :is="item.component"
                       :formInput="item"
                       :formData="myFormData"></component>
          </template>

          <template name="submit-btn"
                    v-else-if="IwFormTypeEnum.SUBMIT_BTN === (item.type)">
            <label :for="`${formId}-submit-btn`"
                   class="iwFormInputLabel"></label>
            <button :id="`${formId}-submit-btn`"
                    class="iwFormBtn iwFormSubmitBtn"
                    type="submit"> {{ totalSubmission > 0 ? formSubmitAgainText : submitText }} </button>
            <p class="iwFormInputHelperText"></p>
          </template>

        </div><!-- end of form inputs -->
      </div><!-- end of form groups -->

      <div :class="css.cssSubmitBtnWrapper ?? 'iwFormInputWrapper'">
        <template v-if="showSubmitBtn">
          <slot name='submitBtn'>
            <IwFormBtn type="submit"
                       :isLoading="showSubmitLoading && submitIsLoading"
                       :label="`${totalSubmission > 0 ? formSubmitAgainText : submitText}`" />
          </slot>
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

<style scoped>
</style>
