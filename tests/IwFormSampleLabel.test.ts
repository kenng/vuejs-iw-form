import { nextTick } from 'vue'
import { describe, expect, it, beforeEach, afterEach, vitest } from 'vitest'
import { mount } from '@vue/test-utils'
import IwFormSample from '../samples/IwFormSampleLabel.vue'


describe('test on input label & tooltip', () => {
    let wrapper: any = null

    beforeEach(() => {
        wrapper = mount(IwFormSample, {})
    })

    afterEach(() => {
        wrapper?.unmount()
    })

    it('can set the label & tooltip', async () => {
        const usernameLabel = wrapper.find('.iwFormInputWrapper').text()
        expect(usernameLabel).toMatch('User Name *')

        // NOTE: can't find a way to get the tooltip value which is in body
        // NOTE: to study about testing library, which build on top of vue test utils

        // await wrapper.find('.iwFormInputLabelInlineIcon').trigger('mouseover')
        // await nextTick()

        // expect(expect(document.body.innerHTML)).toMatch('Type your username')
    })
})
