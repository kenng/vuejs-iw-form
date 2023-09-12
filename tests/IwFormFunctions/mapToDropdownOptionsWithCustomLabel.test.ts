import { describe, expect, it } from 'vitest'
import { mapToDropdownOptionsWithCustomLabel } from '../../utils/IwFormFunctions'

describe('test on mapToDropdownOptionsWithCustomLabel', () => {
    it('can process basic data', () => {
        const data = { '2': 'sales1@vilor.com', '3': 'sales2@vilor.com' }
        const res = mapToDropdownOptionsWithCustomLabel(data)

        expect(res).toContainEqual({ value: '2', label: 'sales1@vilor.com' })
        expect(res).toContainEqual({ value: '3', label: 'sales2@vilor.com' })
    })

    it('can process data with valueKey option', () => {
        const data = {
            'Success': { label: 'Successful', value: '1' },
            'Failed': { label: 'Failed', value: '0' },
        }

        const options = { customLabel: (_key: string, val: any) => val.label, valueKey: 'value' }

        const res = mapToDropdownOptionsWithCustomLabel(data, options)

        expect(res).toContainEqual({ value: '1', label: 'Successful' })
        expect(res).toContainEqual({ value: '0', label: 'Failed' })
    })

    it('can process data with custom label function', () => {
        const data = {
            '1': { firstName: 'John', lastName: 'Doe' },
            '2': { firstName: 'Jane', lastName: 'Doe' },
        }

        const options = {
            customLabel: (_key: string, val: any) => `${val.firstName} ${val.lastName}`
        }

        const res = mapToDropdownOptionsWithCustomLabel(data, options)

        expect(res).toContainEqual({ value: '1', label: `${data['1'].firstName} ${data['1'].lastName}` })
        expect(res).toContainEqual({ value: '2', label: `${data['2'].firstName} ${data['2'].lastName}` })
    })
})
