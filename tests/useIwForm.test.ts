import { describe, expect, it, vitest } from 'vitest'
import useIwForm from '../composables/useIwForm'
import IwFormConfig, { IwFormType } from '../utils/IwFormConfig'

describe('test on useIwForm', () => {
    it('can init successfully', () => {
        const myForm: IwFormConfig = new IwFormConfig({
            formGroups: [
                {
                    formInputs: [
                        {
                            name: 'company_name',
                            label: 'Company Name',
                            type: IwFormType.TEXTGROUP_TEXT,
                        }
                    ]
                }
            ]
        })
        const { initFormData } = useIwForm({
            myForm
        });

        initFormData()
    })
})
