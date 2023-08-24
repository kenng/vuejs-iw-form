/**
 * Convert data to complete dropdown options (with optional 'All' or 'Null')
 * @param data
 * @param param1
 * @returns
 *
 * Sample
 *  data: {"2":"sales1@vilor.com","3":"sales2@vilor.com"}
 *  output: [{value: '2', label: 'sales1@vilor.com'}, ...]
 */
export function mapToDropdownOptions(
    data: Record<string, string | number | { [key: string]: any }>,
    params: IwFormSelectOptionParam = {}): Array<IwFormInputSelectOption> {

    const res: IwFormInputSelectOption[] = []
    const { showAll = true, showNull = false, mapLabel = null, mapValue = null } = params

    if (showNull) {
        res.push({ value: '', label: '(Empty Value)', operator: 'null' })
    }

    if (showAll && !data['all']) {
        res.push({ value: '', label: 'All' })
    }

    for (const [dataKey, dataVal] of Object.entries(data)) {
        // Extract values from the data using the inputted function,
        // or fallback to the original values from the data.
        // NOTE: [object Object] may show up if the extracted value isn't string.
        const label = mapLabel?.(dataVal, dataKey) ?? dataVal.toString()
        const value = mapValue?.(dataVal, dataKey) ?? dataKey

        res.push({ value, label })
    }

    return res
}

/**
 * Simple mapping of JSON object to dropdown options
 * @param data
 * @param params
 * @returns
 *
 * Sample
 *  data: { SenangPay: 'SenangPay', KiplePay: 'KiplePay'}
 *  output: [{label: 'SenangPay', value: 'SenangPay'}, ...]
 */
export function mapToDropdownFromObject(data: { [key: string]: string },
    params: IwFormSelectOptionParam = {}) {
    const { showAll = true, showNull = false } = params
    const res: IwFormInputSelectOption[] = []

    if (showNull) {
        res.push({ value: '', label: '(Empty Value)', operator: 'null' })
    }

    if (showAll && !data['all']) {
        res.push({ value: '', label: 'All' })
    }

    for (const [key, val] of Object.entries(data)) {
        res.push({ value: key, label: val })
    }

    return res
}

/**
 * same as mapToDropdownOptions, but allow user to specify the keyName
 *
 * @param data
 * @param labelName
 * @param param2
 * @returns return Object to be used by select options, e.g. {{value: 1, label: label}, ...}
 *
 * Sample
 *  data : {{ "id": 1, "name": "COMPANY_SUPER_ADMIN", "label": "Company Super Admin" }, ...}
 *  arguments:
 *      labelName = "name"
 *      params = {keyName = "id", ... }
 *  output: [{value: 1, label: "Company Super Admin"}, ...]
 */
export function mapToDropdownOptionsWithKey(
    data: any, labelName: string, params: IwFormSelectOptionParamWithKey,
) {
    const { keyName = 'id', showAll = true, showNull = false } = params
    const res: IwFormInputSelectOption[] = []

    if (showNull) {
        res.push({ value: '', label: '(Empty Value)', operator: 'null' })
    }

    if (showAll && !data['all']) {
        res.push({ value: '', label: 'All' })
    }

    if (Array.isArray(data)) {
        for (const item of data) {
            res.push({ value: item[keyName], label: item[labelName] })
        }
    } else {
        res.push({ value: data[keyName], label: data[labelName] })
    }

    return res
}

export function setAppendIconOnClickFn(
    appendIconOnClickFn: Function,
    // currentValue: any,
    // formData: any
) {
    if (typeof appendIconOnClickFn === 'function')
        return appendIconOnClickFn();
    else return '';
}

export function setClearable(isItemEditable: boolean | null, isReadOnly: boolean) {
    return !isReadOnly && (isItemEditable || true);
}
/**
 * `item.allowedDateFn` can be
 * - a callback function:
 * - string:
 *   'min': date after item.allowedDate[0] will be allowed
 *   'max': date earlier than item.allowedDate[0] will be allowed
 *   'between': date between item.allowedDate[0] and item.allowedDate[1] will be allowed
 *
 * `item.allowedDate` is an array
 * - can be single or two value depending on `item.allowedDateFn` usage
 * - date format must be 'YYYY/MM/DD', example: 2019/08/05
 *
 * param @mydate
 *      calendar will pass in every date of the month
 *      Example for month of August, it will start with '2019/08/01', '2019/08/02',...
 *
 */
export function setAllowedDate(item: any, mydate: string) {
    if (!item.allowedDateFn) return true;
    if (typeof item.allowedDateFn === 'function') {
        return item.allowedDateFn(item, mydate);
    } else if (item.allowedDateFn === 'min') {
        return mydate > item.allowedDate[0];
    } else if (item.allowedDateFn === 'max') {
        return mydate < item.allowedDate[0];
    } else if (item.allowedDateFn === 'between') {
        return (
            mydate >= item.allowedDate[0] &&
            mydate <= item.allowedDate[1]
        );
    }
    return item.allowedDate;
}

export default function IwFormFunctions() { }
