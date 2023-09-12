import { describe, expect, it, vitest } from 'vitest'
import useIwForm from '../composables/useIwForm'
import IwFormConfig from '../utils/IwFormConfig'

describe('test on useIwForm', () => {
    it('can init successfully', () => {
        const name = 'John Doe'
        const age = 15
        const contact = '0123456789'
        const myForm: IwFormConfig = new IwFormConfig({
            formData: {
                name,
                age,
            },
            formGroups: [
                {
                    formInputs: [
                        {
                            type: 'text',
                            name: 'name',
                        },
                        {
                            type: 'text',
                            name: 'address',
                        },
                        {
                            type: 'text',
                            name: 'contact',
                            value: contact,
                        },
                        {
                            type: 'text',
                            name: 'age',
                            value: 18,
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
        expect(myFormData.value['address']).toBeUndefined()
        expect(myFormData.value['contact']).toBe(contact)

        // formDate takes priority when setting the value
        expect(myFormData.value['age']).toBe(age)
    })

    it('can set the css correctly', () => {
        // -- Prepare
        const cssWrapper = 'cssWrapper'
        const extraCss = 'extraCss'
        const falseCss = 'falseCss'
        const defaultWrapper = 'default-wrapper'
        const formInput1: IwFormInput = {
            type: 'text',
            name: 'name',
            cssWrapper: cssWrapper,
            isVisible: () => false
        }

        const formInput2: IwFormInput = {
            type: 'email',
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

    it('will skip disabled input but still send along shouldDehydrate data', () => {
        const name = 'John Doe'
        const age = 50

        const myForm: IwFormConfig = new IwFormConfig({
            formData: {
                name,
                age
            },
            formGroups: [
                {
                    formInputs: [
                        {
                            type: 'text',
                            name: 'name',
                            disabled: true,
                        },
                        {
                            type: 'text',
                            name: 'age',
                            disabled: true,
                            shouldDehydrate: true
                        }
                    ]
                }
            ]
        })
        const { initFormData, removeDisabledInputValue } = useIwForm({
            myForm
        });

        initFormData()
        const res = (removeDisabledInputValue()) as any

        expect(res.name).toBeUndefined()
        expect(res.age).toBe(age)
    })
})
