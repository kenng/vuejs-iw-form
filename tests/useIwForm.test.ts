import { describe, expect, it, vitest } from 'vitest'
import useIwForm from '../composables/useIwForm'
import IwFormConfig, { IwFormType } from '../utils/IwFormConfig'

describe('test on useIwForm', () => {
    it('can init successfully', () => {
        const name = 'John Doe'
        const myForm: IwFormConfig = new IwFormConfig({
            formData: {
                'name': name,
            },
            formGroups: [
                {
                    formInputs: [
                        {
                            type: IwFormType.TEXTGROUP_TEXT,
                            name: 'name',
                        },
                        {
                            type: IwFormType.TEXTGROUP_TEXT,
                            name: 'address',
                        }
                    ]
                }
            ]
        })
        const { initFormData, myFormData } = useIwForm({
            myForm
        });

        initFormData()

        expect(myFormData.value['name']).toBe(name)
    })
})
