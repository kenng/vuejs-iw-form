import { describe, expect, it } from 'vitest'
import { mapToDropdownOptions } from '../../utils/IwFormFunctions'

describe("test on mapToDropdownOptions", () => {
    it("can process basic data", () => {
        const data = { "2": "sales1@vilor.com", "3": "sales2@vilor.com" }
        const res = mapToDropdownOptions(data)

        expect(res).toContainEqual({ value: "2", label: "sales1@vilor.com" })
        expect(res).toContainEqual({ value: "3", label: "sales2@vilor.com" })
    })

    it("can process data with mapLabel option", () => {
        const data = {
            "Success": { label: "Successful" },
            "Failed": { label: "Failed" },
        }

        const options = {
            mapLabel(value: { "label": string }) {
                return value.label
            }
        }

        const res = mapToDropdownOptions(data, options)

        expect(res).toContainEqual({ value: "Success", label: "Successful" })
        expect(res).toContainEqual({ value: "Failed", label: "Failed" })
    })

    it("can process nested data with mapLabel and mapValue option", () => {
        const data = {
            "1": { data: { text: "Label1" }, val: "Value1" },
            "2": { data: { text: "Label2" }, val: "Value2" },
        }

        const options = {
            mapLabel: (value: { data: { text: string } }) => value.data.text,
            mapValue: (value: { val: string }) => value.val
        }

        const res = mapToDropdownOptions(data, options)

        expect(res).toContainEqual({ value: "Value1", label: "Label1" })
        expect(res).toContainEqual({ value: "Value2", label: "Label2" })
    })
})
