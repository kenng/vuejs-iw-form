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

    it('can set the css correctly', () => {
        // -- Prepare
        const cssWrapper = 'cssWrapper'
        const extraCss = 'extraCss'
        const falseCss = 'falseCss'
        const defaultWrapper = 'default-wrapper'
        const formInput1: IwFormInput = {
            type: IwFormType.TEXTGROUP_TEXT,
            name: 'name',
            cssWrapper: cssWrapper,
            isVisible: () => false
        }

        const formInput2: IwFormInput = {
            type: IwFormType.TEXTGROUP_EMAIL,
            name: 'email',
        }
        const myForm: IwFormConfig = new IwFormConfig({ formGroups: [] })
        const { getCss } = useIwForm({ myForm })

        // -- Act & Assert
        const res = getCss(formInput1,
            {
                cssArray: [formInput1.cssWrapper ?? defaultWrapper],
                cssObj: { extraCss: true, falseCss: false }
            })

        const splitted = res.split(" ")
        expect(splitted).toContain(cssWrapper)
        expect(splitted).toContain(extraCss)
        expect(splitted).toContain('hidden')
        expect(splitted).not.toContain(falseCss)
        expect(splitted).not.toContain(defaultWrapper)

        //  -- Act2 & Assert
        const res2 = getCss(formInput2, { cssArray: [formInput2.cssWrapper ?? defaultWrapper] })
        const splitted2 = res2.split(' ')
        expect(splitted2).toContain(defaultWrapper)
        expect(splitted2).not.toContain(cssWrapper)
    })
})
