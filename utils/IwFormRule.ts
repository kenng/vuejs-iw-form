export class IwFormRule {
    /* NOTE: 0 is accepted and not regarded as no input */
    static required({ errMsg = 'Required' }: IIwFormRule = {}): IwFormRuleResponse {
        return function (data: IRuleData) {
            return data.value === 0 || !!data.value || errMsg
        };
    }

    /* Accepts A-Z only */
    static userName({ errMsg = 'Requires more than two characters' }: IIwFormRule): IwFormRuleResponse {
        return function (data: IRuleData) {
            const pattern = /^([A-Za-z0-9. /\s]){3,80} *$/;
            if (data.value) data.value = data.value.toString().trim();
            return pattern.test(data.value) || errMsg;
        };
    }

    static password({ errMsg = 'Password should contain one letter, one number, and a symbol(!@#$%^&*()_+)',
        requireLetter = true,
        requireNumber = true,
        requireSymbol = true }: IIwFormRule = {}): IwFormRuleResponse {
        return function (data: IRuleData) {
            const pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).*$/;
            if (data.value) data.value = data.value.toString().trim();
            return pattern.test(data.value) || errMsg;
        };
    }

    static gender({ errMsg = 'Invalid gender value' }: IIwFormRule): IwFormRuleResponse {
        return function (data: IRuleData) {
            const pattern = /^([M,F,O]){1}$/;
            return pattern.test(data.value) || errMsg;
        };
    }

    static phone({
        errMsg = 'Invalid phone number',
        required = false,
    }: IIwFormRule): IwFormRuleResponse {
        return function (data: IRuleData) {
            const USpattern = /^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9]){2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1,5}){0,1}$/;
            const MYpattern = /^[+]?[0-9]+$/;
            if (data.value) {
                let isValid = false;
                if (USpattern.test(data.value) || MYpattern.test(data.value)) {
                    isValid = true;
                }
                return isValid || errMsg;
            } else if (required && !data.value) {
                return 'Required';
            }
            return true;
        };
    }

    static email({ errMsg = 'Invalid e-mail', required = false }: IIwFormRule = {}): IwFormRuleResponse {
        return function (data: IRuleData) {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (data.value) {
                return pattern.test(data.value) || errMsg;
            } else if (required && !data.value) {
                return 'Required';
            } else {
                return true;
            }
        };
    }

    static url({ errMsg = 'Invalid URL', required = false }: IIwFormRule): IwFormRuleResponse {
        return function (data: IRuleData) {
            const pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
            if (data.value) {
                return pattern.test(data.value) || errMsg;
            } else if (required && !data.value) {
                return 'Required';
            } else {
                return true;
            }
        };
    }

    static minLength({
        minLength = 2,
        required = false,
        errMsg,
    }: IIwFormRule = {}): IwFormRuleResponse {
        return function (data: IRuleData) {
            const msg = errMsg || `needs ${minLength} characters`;
            if (data.value) {
                return (data.value && data.value?.length >= minLength) || msg;
            } else if (required) {
                if (!data.value || data.value?.length < minLength) return msg;
            } else {
                return true;
            }
        };
    }

    static maxLength({
        max = 1,
        required = false,
        errMsg = `value reach the maximum characters of ${max}`,
    }: {
        max: number;
        required?: boolean;
        errMsg?: string;
    }): IwFormRuleResponse {
        return function (data: IRuleData) {
            if (data.value && !required) {
                return (data.value && data.value.length <= max) || errMsg;
            } else if (required && !data.value) {
                return 'Required';
            } else if (required && data.value.length > max) {
                return errMsg;
            } else {
                return true;
            }
        };
    }

    /**
     * Limit the size of data to the size of UTF-8 bytes
     */
    static maxSizeInBytes({
        max = 1,
        required = false,
        errMsg = `value reached the maximum size of ${max}`,
    }: {
        max: number;
        required?: boolean;
        errMsg?: string;
    }): IwFormRuleResponse {
        return function (data: IRuleData) {
            if (data.value) {
                const bytes = new TextEncoder().encode(data.value)
                return (bytes.length <= max) || errMsg
            } else if (required) {
                return 'Required'
            } else {
                return true
            }
        };
    }

    // untested
    // static sum_not_exceed({
    //     valueA,
    //     valueB,
    //     max = 1,
    //     errMsg = `value cannot be exceed ${max}`,
    // }: {
    //     valueA: any;
    //     valueB: any;
    //     max: number;
    //     errMsg?: string;
    // }) {
    //     return function (data: IRuleData) {
    //         const sum = parseInt(valueA) + parseInt(valueB);
    //         if (max >= sum) {
    //             return true;
    //         } else {
    //             return errMsg;
    //         }
    //     };
    // }

    static notNull({ errMsg = 'value is null' }: { errMsg?: string }): IwFormRuleResponse {
        return function (data: IRuleData) {
            if (data.value === null || data.value === '') {
                return errMsg;
            } else {
                return true;
            }
        };
    }

    static isNumber({
        errMsg = 'Should be a numeric value',
    }: {
        errMsg?: string;
    }): IwFormRuleResponse {
        return function (data: IRuleData) {
            if (
                data.value === null ||
                data.value === '' ||
                isNaN(parseFloat(data.value))
            ) {
                return errMsg;
            } else {
                return true;
            }
        };
    }

    static match({
        formName = 'form key name to compare',
        errMsg = 'value not match',
    }: {
        formName: string;
        errMsg?: string;
    }): IwFormRuleResponse {
        return function (data: IRuleData) {
            // window.iw.test = data;
            // console.dir(data.value);
            // console.dir(data.myFormData[formName]);
            return data.value == data.myFormData[formName] || errMsg;
        };
    }

    // static notMatch({
    //     value,
    //     value2,
    //     errMsg = 'value matched',
    // }: {
    //     value: any;
    //     value2: any;
    //     errMsg?: string;
    // }) {
    //     return function (data: IRuleData) {
    //         return data.value !== value2 || errMsg;
    //     }
    // }

    static dateIsAfterIncludeToday({
        errMsg = 'Date should be today or after',
    }: {
        errMsg?: string;
    }): IwFormRuleResponse {
        return function (data: IRuleData): boolean | string {
            const milliseconds1 = Date.parse(data.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isTrue = milliseconds1 >= today.getTime();

            return isTrue || errMsg;
        };
    }

    static dateIsAfter({
        afterDate,
        errMsg = 'Date should be after',
    }: {
        afterDate: string;
        errMsg?: string;
    }) {
        return function (data: IRuleData): boolean | string {
            const milliseconds1 = Date.parse(data.value);
            const milliseconds2 = Date.parse(afterDate);
            const isAfter = milliseconds1 > milliseconds2;
            return isAfter || errMsg + ' ' + afterDate;
        };
    }

    static dateIsBeforeIncludeToday({
        errMsg = 'Date should be today or before',
    }: {
        errMsg?: string;
    }): IwFormRuleResponse {
        return function (data: IRuleData): boolean | string {
            const milliseconds1 = Date.parse(data.value);
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            const isTrue = milliseconds1 <= today.getTime();

            return isTrue || errMsg;
        };
    }

    static isDate({
        required = false,
        errMsg = 'date not in valid format',
    }: {
        required?: boolean;
        errMsg?: string;
    }) {
        return function (data: IRuleData) {
            if (required || data.value) {
                return !isNaN(Date.parse(data.value)) || errMsg;
            } else return true;
        };
    }

    // static dateCompare({
    //     date1,
    //     date2,
    //     name = 'na',
    //     operator = 'equal',
    //     required = false,
    // }: {
    //     date1: string;
    //     date2: string;
    //     name: string;
    //     operator: string;
    //     required: boolean;
    // }) {
    //     return function (data: IRuleData) {
    //         if (date1 === null || date2 === null) {
    //             return true;
    //         }

    //         if (required || date1 || date2) {
    //             const d1 = new Date(date1);
    //             const d2 = new Date(date2);
    //             let status = false;
    //             switch (operator) {
    //                 case 'equal':
    //                     status = d1.getTime() === d2.getTime();
    //                     break;
    //                 case 'greater':
    //                     status = d1.getTime() >= d2.getTime();
    //                     break;
    //                 case 'lower':
    //                     status = d1.getTime() <= d2.getTime();
    //                     break;
    //                 default:
    //                     break;
    //             }
    //             return status || `Date must be ${operator} than ${name}`;
    //         } else return true;
    //     };
    // }

    static isValidTime({
        required = false,
        errMsg = 'not a valid time',
    }: {
        required?: boolean;
        errMsg?: string;
    }): IwFormRuleResponse {
        return function (data: IRuleData): boolean | string {
            if (!data.value && required === false) {
                return true;
            }
            if (data.value !== null || required) {
                // regular expression to match time strings in the format "HH:MM:SS" or "HH:MM"
                const regex = /^([01][0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/;

                const isTrue = regex.test(data.value);
                return isTrue || errMsg;
            }

            return errMsg;
        };
    }

    // static sumExceedOrEqual({
    //     num1,
    //     num2,
    //     min,
    //     errMsg = `Both numbers must be exceed ${min}`,
    // }: {
    //     num1: number | null;
    //     num2: number | null;
    //     min: number;
    //     errMsg?: string;
    // }) {
    //     return function (data: IRuleData) {
    //         if (num1 == null || num2 == null) {
    //             return true;
    //         }
    //         const sum = num1 + num2;
    //         if (sum < min) {
    //             return errMsg;
    //         }
    //         return true;
    //     };
    // }

    // static time_compare({
    //     time1 = 'HH:mm',
    //     time2 = 'HH:mm',
    //     name = 'na',
    //     operator = 'equal',
    //     required = false,
    // }: {
    //     time1: string;
    //     time2: string;
    //     name: string;
    //     operator: string;
    //     required: boolean;
    // }) {
    //     return function (data: IRuleData) {
    //         if (time1 === null || time2 === null) {
    //             return true;
    //         }

    //         if (required || time1 || time2) {
    //             const t1 = window.iw.moment(time1, 'HH:mm');
    //             const t2 = window.iw.moment(time2, 'HH:mm');
    //             let status = false;
    //             switch (operator) {
    //                 case 'equal':
    //                     status = t1 === t2;
    //                     break;
    //                 case 'greater':
    //                     status = t1 >= t2;
    //                     break;
    //                 case 'lower':
    //                     status = t1 <= t2;
    //                     break;
    //                 default:
    //                     break;
    //             }
    //             return status || `Time must be ${operator} than ${name}`;
    //         } else return true;
    //     };
    // }
}


export default IwFormRule;
