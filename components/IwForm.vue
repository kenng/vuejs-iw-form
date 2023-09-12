<script setup lang='ts'>
import { PropType, ref } from 'vue'
import { Icon } from '@iconify/vue';
import IwFormConfig, { IwFormType } from '../utils/IwFormConfig';
import EasepickCalendar from './EasepickCalendar.vue';
import VueMultiSelect from './VueMultiSelect.vue';
import useIwForm from '../composables/useIwForm';
import dayjs from 'dayjs';
import IwFormBtn from './IwFormBtn.vue';
import Editor from './Editor/EditorTipTap.vue'

//////////////////////////////////////////////////////////////////////
//  Emit & Props
//////////////////////////////////////////////////////////////////////
const IwFormTypeTextGroup: Array<IIwFormType> = [
  IwFormType.TEXTGROUP_TEXT,
  IwFormType.TEXTGROUP_EMAIL,
  IwFormType.TEXTGROUP_NUMBER,
  IwFormType.TEXTGROUP_PASSWORD,
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
  // canSubmitAgain: {
  //   type: Boolean,
  //   default: true,
  // },
  clearable: {
    type: Boolean,
    default: true,
  },
  css: {
    type: Object as PropType<IwFormStyle>,
    default: {
      cssSubmitBtnWrapper: 'iwFormInputWrapper',
      cssResetBtnWrapper: 'iwFormResetFilterBtnWrapper',
    },
  },
  isModified: {
    type: Boolean,
    default: false,
  },
  isReadOnly: {
    type: Boolean,
    default: false,
  },
  foldLabel: {
    type: String,
    default: 'Show more >'
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
  // resetOnSubmit: {
  //   type: Boolean,
  //   default: true,
  // },
  resetText: {
    type: String,
    default: 'Reset',
  },
  showCancelBtn: {
    type: Boolean,
    default: false,
  },
  showFoldBtn: {
    type: Boolean,
    default: false,
  },
  showHelperText: {
    type: Boolean,
    default: true,
  },
  showResetBtn: {
    type: Boolean,
    default: false,
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
});

const formSubmitAgainText = props.submitAgainText ?? props.submitText
let timerOfDataUpdated: ReturnType<typeof setTimeout>;
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
  clearErrorsIfValidated,
  formOnReset,
  formOnSubmit,
  getAriaLabel,
  getCss,
  getFormData,
  getFormGroupSubmitLabel,
  getInputCss,
  getRef,
  initFormData,
  initRenderCallback,
  isDisabled,
  isVisible,
  onBlur,
  onChange: useOnChange,
  onFocus,
  onInput: useOnInput,
  setLabel,
  setRequired,
  submitIsLoading,
  validate,
} = useIwForm({
  myForm: props.myForm,
  onSubmit: props.onSubmit,
  onReset: props.onReset,
  resetIgnored: props.resetIgnored,
})

/**
 * change - event for single input field changes
 * dataUpdated - event when any input field is updated
 */
const emit = defineEmits(['change', 'data-updated', 'input-reset'])
const folded = ref(true); // Start with folded state as true

const toggleFolded = () => {
  folded.value = !folded.value;
};

const isModified = ref(props.isModified || false)

//////////////////////////////////////////////////////////////////////
//  Functions
//////////////////////////////////////////////////////////////////////

/**
 * @param item IwFormInputDate
 * @param val Date[] an array of Date objects for single date or a range of date (i.e. start date to end date)
*/
function dateOnChange(item: IwFormInputDate, val: Date[]) {
  let res: Date[] | string = val
  if (1 == val.length) {
    let dateFormat = 'YYYY-MM-DD'
    if (item.dateOptions.enableTimePicker) {
      dateFormat = 'YYYY-MM-DD HH:mm'
    }
    res = dayjs(val[0]).format(dateFormat)
    myFormData.value[item.name] = res
  } else {
    myFormData.value[item.name] = val
  }

  if (validate(item, val)) {
    delete errors.value[item.name]
  }

  onChange(item, res)
  onFormModified()
}

function debounce(func: Function, delay: number) {
  return function (this: unknown, ...args: any[]) {
    clearTimeout(timerOfDataUpdated);
    timerOfDataUpdated = setTimeout(() => func.apply(this, args), delay);
  }
}

function inputOnReset(item: IwFormInputCore) {
  myFormData.value[item.name] = null
  emit('input-reset', { item })
}

function isFormDataModified(): boolean {
  return isModified.value
}

async function myFormOnSubmit(ev: Event) {
  try {
    submitIsLoading.value = true
    await formOnSubmit(ev)
    submitIsLoading.value = false
    isModified.value = false
  } catch (e) {
    throw e
  }
}

/**
 * called when any of the inputs value has changed
 */
function onFormModified() {
  isModified.value = true
  debounce(() => {
    emit('data-updated', myFormData.value)
  }, 500)()
}

async function onChange(item: IwFormInputCore, val: any, ...extra: any[]) {
  useOnChange(item, val)

  if (item.onChange) item.onChange(item, val, ...extra)
  if (item.onChangeUpdateInput) {
    const res = await item.onChangeUpdateInput(item, val, ...extra)
    props.myForm.updateSelectInput(res.linkedInputName, res.newSelectConfig)
  }

  emit('change', { item, val, ...extra })
  onFormModified()
}

function onInput(item: IwFormInputCore, val: any) {
  useOnInput(item, val)
  onFormModified()
}

function selectInputOnChange(item: IwFormInputSelect,
  selectedKeys: IwFormInputSelectedKeys,
  selectedRaw: IwFormInputSelectedOption | IwFormInputSelectedOption[],
  justSelected: IwFormInputSelectedOption,
  theForm: IwFormConfig
) {
  onChange(item, selectedKeys, selectedRaw, justSelected, theForm)
  onFormModified()
}

//////////////////////////////////////////////////////////////////////
// Lifecycles
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
// export & expose
/////////////////////////////////////////////////////////////////////
defineExpose({ getFormData, isFormDataModified })

//////////////////////////////////////////////////////////////////////
// init
//////////////////////////////////////////////////////////////////////
initFormData();
initRenderCallback();



</script>

<template>
  <div class="iwFormWrapper">
    <slot name='buttonsTop'></slot>

    <div :class="css.cssShowFoldBtnWrapper ?? 'iwFormShowFoldBtnWrapper'">
      <template v-if="showFoldBtn">
        <button @click="toggleFolded"
                class="iwFormShowFoldBtn"
                type="button">
          {{ folded ? foldLabel : 'Show Less <' }}
             </button>
      </template>
    </div>

    <form :class="myForm.cssForm"
          @submit.prevent.stop='myFormOnSubmit'
          @reset.prevent.stop='formOnReset'>

      <div v-for="(group, groupKey) in myForm.formGroups"
           :key="groupKey"
           :class="[group.css ?? 'iwFormGroup']">
        <template v-for="(item, idx) in group.formInputs"
                  :key="formId + idx">
          <div v-if="!(item as IwFormInputText).foldable || (!folded && (item as IwFormInputText).foldable)"
               :class="getCss(item, { cssArray: [item.cssWrapper ?? 'iwFormInputWrapper'], cssObj: { iwFormReadOnly: isReadOnly } })">
            <template name="label"
                      v-if='IwFormTypeEnum.LABEL === ((item as IwFormInputLabel).type)'>
              <div :class="getCss(item)">{{ (item as IwFormInputLabel).label }}</div>
            </template>

            <template name="separator"
                      v-else-if='IwFormTypeEnum.SEPARATOR === ((item as IwFormInputSeparator).type)'>
              <hr :class="getCss(item, { default: 'iwFormHr' })">
            </template>

            <template name="text-group"
                      v-else-if='IwFormTypeEnum.TEXTGROUP_TEXTAREA === ((item as IwFormInputTextArea).type)'>
              <label :for="`${formId}-${(item as IwFormInputTextArea).name}`"
                     class="iwFormInputLabel">{{ setLabel((item as IwFormInputCore)) }}
                <span v-if="setRequired((item as IwFormInputCore))"
                      class="iwFormInputLabelRequired"> *</span>
              </label>
              <textarea :aria-label="getAriaLabel((item as IwFormInputCore))"
                        :autocomplete="(item as IwFormInputTextArea).autocomplete ?? 'on'"
                        :class="getInputCss((item as IwFormInputCore))"
                        :disabled="isDisabled((item as IwFormInputTextArea).disabled, isReadOnly)"
                        :id="`${formId}-${(item as IwFormInputTextArea).name}`"
                        :key="formId + idx"
                        :name="(item as IwFormInputTextArea).name"
                        :placeholder="(item as IwFormInputTextArea).placeholder"
                        :ref="getRef(item)"
                        :required="setRequired((item as IwFormInputCore))"
                        :rows="(item as IwFormInputTextArea).textAreaRows ?? 4"
                        :rules="(item as IwFormInputTextArea).rules"
                        :type="((item as IwFormInputTextArea).type)"
                        :value="myFormData[(item as IwFormInputTextArea).name]"
                        @blur="(_) => onBlur((item as IwFormInputCore), myFormData[(item as IwFormInputTextArea).name])"
                        @change="(event) => onChange(item, (event.target as HTMLInputElement).value)"
                        @focus="(_) => onFocus(item, myFormData[(item as IwFormInputTextArea).name])"
                        @input="(event) => onInput((item as IwFormInputCore), (event.target as HTMLInputElement).value)">
              </textarea>
            </template>

            <template name="text-group"
                      v-else-if='IwFormTypeTextGroup.indexOf(item.type) >= 0'>
              <template v-if="isVisible((item as IwFormInputCore))">
                <label :for="`${formId}-${(item as IwFormInputText).name}`"
                       class="iwFormInputLabel">{{ setLabel((item as IwFormInputText)) }}
                  <span v-if="setRequired((item as IwFormInputCore))"
                        class="iwFormInputLabelRequired"> *</span>
                </label>
                <div class="iwFormInputContainer">
                  <div v-if="(item as IwFormInputText).showPrefixIcon"
                       class="iwFormInputPrependIcon">
                    <Icon class="w-5 h-5 text-gray-500 dark:text-gray-400"
                          :icon="(item as IwFormInputText).prefixIcon!"></Icon>
                  </div>
                  <input :aria-label="getAriaLabel((item as IwFormInputCore))"
                         :autocomplete="(item as IwFormInputText).autocomplete ?? 'on'"
                         :class="getInputCss((item as IwFormInputCore))"
                         :disabled="isDisabled((item as IwFormInputText).disabled, isReadOnly)"
                         :id="`${formId}-${(item as IwFormInputText).name}`"
                         :key="formId + idx"
                         :name="(item as IwFormInputText).name"
                         :placeholder="(item as IwFormInputText).placeholder"
                         :ref="getRef(item)"
                         :required="setRequired((item as IwFormInputCore))"
                         :rules="(item as IwFormInputText).rules"
                         :type="((item as IwFormInputText).type)"
                         :value="myFormData[(item as IwFormInputText).name]"
                         @blur="(_) => onBlur((item as IwFormInputText), myFormData[(item as IwFormInputText).name])"
                         @change="(event) => onChange(item, (event.target as HTMLInputElement).value)"
                         @focus="(_) => onFocus(item, myFormData[(item as IwFormInputText).name])"
                         @input="(event) => onInput((item as IwFormInputText), (event.target as HTMLInputElement).value)" />
                  <div v-if="clearable && myFormData[(item as IwFormInputText).name]">
                    <span @click="onChange(item, '')">
                      <Icon icon="maki:cross-11"
                            class="iwFormClearable" />
                    </span>
                  </div>
                  <p v-if="showHelperText"
                     class="iwFormInputHelperText">
                    <template v-if="errors[(item as IwFormInputText).name]"><span class="iwFormInputErrorText">{{
                      errors[(item as IwFormInputText).name]
                    }}</span></template>
                    <template v-else> {{ (item as IwFormInputText).helperText }} </template>
                  </p>
                </div>
              </template><!-- isVisible(item) -->
            </template>

            <template name="select"
                      v-else-if="IwFormTypeEnum.SELECT === (item.type)">
              <template v-if="isVisible(item)">
                <template v-if="item.useLabelForAttr || undefined === item.useLabelForAttr">
                  <label :for="`${formId}-${item.name}`"
                         class="iwFormInputLabel">{{ setLabel(item) }}
                    <span v-if="setRequired(item)"
                          class="iwFormInputLabelRequired"> *</span>
                  </label>
                </template>
                <template v-else>
                  <label class="iwFormInputLabel">{{ setLabel(item) }}
                    <span v-if="setRequired(item)"
                          class="iwFormInputLabelRequired"> *</span>
                  </label>
                </template>
                <template v-if='!isReadOnly'>
                  <VueMultiSelect :config="item.selectConfig"
                                  :disabled="item.disabled"
                                  :id="`${formId}-${item.name}`"
                                  ref="inputRefs"
                                  @changed="(selectedKeys, selectedRaw, justSelected) =>
                                    selectInputOnChange(item, selectedKeys, selectedRaw, justSelected, myForm)"
                                  @removed="(selectedKeys, selectedRaw, justRemoved) =>
                                    selectInputOnChange(item, selectedKeys, selectedRaw, justRemoved, myForm)" />
                  <p v-if="showHelperText"
                     class="iwFormInputHelperText">
                    <template v-if="errors[item.name]"><span class="iwFormInputErrorText">{{ errors[item.name]
                    }}</span></template>
                    <template v-else> {{ item.helperText }} </template>
                  </p>
                </template>
                <template v-else>
                  <input type="text"
                         :id="`${formId}-${item.name}`"
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
                       class="iwFormInputLabelInline">{{ setLabel(item) }}
                  <span v-if="setRequired(item)"
                        class="iwFormInputLabelRequired"> *</span>
                </label>
              </template>
            </template>

            <template name="date"
                      v-else-if='IwFormTypeEnum.DATE === (item.type)'>
              <template v-if="isVisible(item)">
                <label :for="`${formId}-${item.name}`"
                       class="iwFormInputLabel">{{ setLabel(item) }}
                  <span v-if="setRequired(item)"
                        class="iwFormInputLabelRequired"> *</span>
                </label>
                <EasepickCalendar :id="`${formId}-${item.name}`"
                                  ref="inputRefs"
                                  :disabled="item.disabled"
                                  @change="(val) => dateOnChange(item, val)"
                                  @reset="inputOnReset(item)"
                                  :options="item.dateOptions!"></EasepickCalendar>
                <p v-if="showHelperText"
                   class="iwFormInputHelperText">
                  <template v-if="errors[item.name]"><span class="iwFormInputErrorText">{{ errors[item.name]
                  }}</span></template>
                  <template v-else> {{ item.helperText }} </template>
                </p>
              </template>
            </template>

            <template name="editor"
                      v-else-if="IwFormTypeEnum.EDITOR === (item.type)">
              <Editor :config="item.config"
                      @change="(htmlData) => onChange(item, htmlData)" />
            </template>

            <template name="component"
                      v-else-if="IwFormTypeEnum.COMPONENT === (item.type)">
              <component :is="item.component"
                         :formInput="item"
                         :formData="myFormData"></component>
            </template>


          </div>
        </template><!-- end of form inputs -->
        <div :class="['iwFormSubmitBtnWrapper', group.submitBtn?.css ?? '']"
             v-if="group.showSubmitBtn">
          <IwFormBtn type="submit"
                     :disabled="!isModified"
                     :isLoading="showSubmitLoading && submitIsLoading"
                     :label="getFormGroupSubmitLabel(group, totalSubmission > 0 ? formSubmitAgainText : submitText)" />
          <div :class="css.cssResetBtnWrapper ?? 'iwFormResetFilterBtnWrapper'">
            <button v-if="showResetBtn"
                    class="iwFormResetFilterBtn"
                    @click="formOnReset"
                    type="button">{{ resetText }}</button>
          </div>
        </div>
      </div><!-- end of form groups -->

      <div :class="css.cssSubmitBtnWrapper ?? 'iwFormInputWrapper'">
        <template v-if="showSubmitBtn">
          <slot name='submitBtn'>
            <div class="iwFormSubmitBtnWrapper">
              <IwFormBtn type="submit"
                         :disabled="!isModified"
                         :isLoading="showSubmitLoading && submitIsLoading"
                         :label="`${totalSubmission > 0 ? formSubmitAgainText : submitText}`" />
              <div :class="css.cssResetBtnWrapper ?? 'iwFormResetFilterBtnWrapper'">
                <button v-if="showResetBtn"
                        class="iwFormResetFilterBtn"
                        @click="formOnReset"
                        type="button">{{ resetText }}</button>
              </div>
            </div>
          </slot>
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
