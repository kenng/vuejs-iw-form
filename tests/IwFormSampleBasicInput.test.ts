import { describe, expect, it, beforeEach, afterEach, vitest } from 'vitest'
import { mount } from '@vue/test-utils'
import IwFormSampleBasic from '../samples/IwFormSampleBasicInput.vue'


describe('test on select basic', () => {
    let wrapper: any = null
    let inputs: any[] = []

    beforeEach(() => {
        wrapper = mount(IwFormSampleBasic, {})
        inputs = wrapper.get('[data-test="iw-form-basic"]')
    })

    afterEach(() => {
        wrapper?.unmount()
    })

    function getOutputText() {
        return wrapper.find('.iwform-output').text()
    }

    it('can set the value successfully', async () => {
        // initial test
        expect(getOutputText()).toContain('username: undefined');

        // find and set new value
        const name = 'John Doe';
        await wrapper.get('input[name="username"]').setValue(name)

        expect(getOutputText()).toContain(`username: ${name}`);
    })

    it('shows error on invalid input and clear the error when valid input is given', async () => {
        // find and set new value
        const name = 'Jo';
        const input = wrapper.get('input[name="username"]')
        await input.setValue(name)
        await input.trigger('blur')

        const output = wrapper.find('.iwFormInputHelperText')
        expect(output.text())
            .toContain('needs 3 characters');

        await input.setValue(name + 'e Doe')
        await input.trigger('blur')

        expect(output.text()).not.toContain('needs 3 characters');
    })

    it('show clearable x on input and able to clear input when clicking clearable x', async () => {
        // NOTE: password input already contains a value by default
        expect(getOutputText()).toContain(`password: password123password_confirmed:`);

        await wrapper.find('.iwFormClearable').trigger('click')
        expect(getOutputText()).toContain(`password: password_confirmed:`);
    })
})
