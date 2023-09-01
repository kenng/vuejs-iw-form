export default class IwFormCalendar {
    public enableMonthDropdown: boolean = false
    public enablePresetPicker: boolean = false
    public enableRangePicker: boolean = false
    public enableTimePicker: boolean = false
    public enableYearDropdown: boolean = false
    public format: string = 'YYYY-MM-DD'
    public isDarkMode: boolean = false
    public maxDate?: Date | string | number
    public minDate?: Date | string | number
    public placeholder: string = ''
    public readonly: boolean = true // To prevent the date input from being directly modified via the keyboard.
    public showResetBtn: boolean = true
    public showValueAsToday: boolean = false
    public value?: Date | string | number

    constructor(options?: Partial<IwFormCalendar>) {
        Object.assign(this, options)
    }
}
