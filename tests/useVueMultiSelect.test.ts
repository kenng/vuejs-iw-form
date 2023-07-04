import { describe, expect, it, vitest } from 'vitest'
import useVueMultiSelect from '../composables/useVueMultiSelect'
import IwFormInputSelectConfig from '../utils/IwFormInputSelectConfig'

const options = [
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
]

describe('test on useVueMultiSelect', () => {
    it('can init single string selected successfully', () => {
        const selectedCountry = 'MY'
        const countries = new IwFormInputSelectConfig(options, {
            selected: selectedCountry
        })

        const { initSelected, selectedOption } = useVueMultiSelect({ config: countries })
        initSelected()

        expect(selectedOption.value!['value']).toBe(selectedCountry)
    })

    it('can init selected string array successfully', () => {
        const selectedCountry = ['MY', 'SG']
        const countries = new IwFormInputSelectConfig(options, {
            selected: selectedCountry,
            multiple: true
        })

        const { initSelected, selectedOption } = useVueMultiSelect({ config: countries })
        initSelected()

        expect(selectedOption.value![0]['value']).toBe(selectedCountry[0])
        expect(selectedOption.value![1]['value']).toBe(selectedCountry[1])
    })
})
