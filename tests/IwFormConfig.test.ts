import { describe, expect, it, vitest } from 'vitest'
import IwFormConfig, { IwFormType } from "../utils/IwFormConfig"
import IwFormInputSelectConfig from '../utils/IwFormInputSelectConfig'

describe('test IwFormConfig', () => {
    it('able to update select option config', () => {

        const name = 'selectDropdownInput'
        const iwFormConfig = new IwFormConfig({
            formGroups: [
                {
                    formInputs: [
                        {
                            name,
                            type: IwFormType.SELECT
                        }
                    ]
                }
            ]
        })

        const initialKey = iwFormConfig.formGroups[0]['formInputs'][0].key

        const selectConfig = new IwFormInputSelectConfig(
            [{ label: 'test', value: 'test' }],
        )

        iwFormConfig.updateSelectInput(name, selectConfig)
        const updatedKey = iwFormConfig.formGroups[0]['formInputs'][0].key

        console.log(initialKey, updatedKey)
        expect(updatedKey).not.toBe(initialKey)
    })
})
