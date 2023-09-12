import { describe, expect, it, beforeEach, afterEach, vitest } from 'vitest'
import { mount } from '@vue/test-utils'
import IwFormSampleSelectBasic from '../samples/selectDropDown/IwFormSampleSelectBasic.vue'
import VueMultiselect from 'vue-multiselect';


describe('test on select basic', () => {
  let wrapper: any = null
  let multiselect: any[] = []

  beforeEach(() => {
    wrapper = mount(IwFormSampleSelectBasic, {})
    multiselect = wrapper.findAllComponents(VueMultiselect)
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  it('can init successfully', async () => {
    // initial test
    expect(wrapper.html()).toMatch('countries: MY');

    // find and set new value
    const select1 = multiselect[0].vm
    await select1.select(select1.options[1]);

    expect(wrapper.html()).toMatch('countries: SG');


  })

  it('can toggle multiple selected values', async () => {
    expect(wrapper.html()).toMatch('countries_related: MY,SG')

    const select2 = multiselect[0].vm
    await select2.select(select2.options[1]);

    expect(wrapper.html()).toMatch('countries_related: MY');
  })
})
