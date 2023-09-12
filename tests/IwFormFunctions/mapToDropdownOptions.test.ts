import { describe, expect, it } from 'vitest'
import { mapToDropdownOptions } from '../../utils/IwFormFunctions'

describe('test on mapToDropdownOptions', () => {
    it('can process basic data', () => {
        const data = { '2': 'sales1@vilor.com', '3': 'sales2@vilor.com' }
        const res = mapToDropdownOptions(data)

        expect(res).toContainEqual({ value: '2', label: 'sales1@vilor.com' })
        expect(res).toContainEqual({ value: '3', label: 'sales2@vilor.com' })
    })

    it('can process data with labelKey option', () => {
        const data = {
            'Success': { label: 'Successful' },
            'Failed': { label: 'Failed' },
        }

        const options = { labelKey: 'label' }

        const res = mapToDropdownOptions(data, options)

        expect(res).toContainEqual({ value: 'Success', label: 'Successful' })
        expect(res).toContainEqual({ value: 'Failed', label: 'Failed' })
    })

    it('can process data with labelKey and valueKey options', () => {
        const data = {
            '1': { text: 'Label1', val: 'Value1' },
            '2': { text: 'Label2', val: 'Value2' },
        }

        const options = { labelKey: 'text', valueKey: 'val' }

        const res = mapToDropdownOptions(data, options)

        expect(res).toContainEqual({ value: 'Value1', label: 'Label1' })
        expect(res).toContainEqual({ value: 'Value2', label: 'Label2' })
    })

    it('can process array data with labelKey and valueKey options', () => {
        const data = [
            { text: 'Successful', val: 'ok' },
            { text: 'Failed', val: 'err' },
        ]

        const options = { labelKey: 'text', valueKey: 'val' }

        const res = mapToDropdownOptions(data, options)

        expect(res).toContainEqual({ value: 'ok', label: 'Successful' })
        expect(res).toContainEqual({ value: 'err', label: 'Failed' })
    })
})
