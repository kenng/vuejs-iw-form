export default class IwFormCalendar {
    public enableTimePicker: boolean = false
    public enableRangePicker: boolean = false
    public enablePresetPicker: boolean = false
    public enableMonthDropdown: boolean = false
    public enableYearDropdown: boolean = false
    public showValueAsToday: boolean = false
    public showResetBtn: boolean = true
    public isDarkMode: boolean = false
    // readonly: To prevent the date input from being directly modified via the keyboard.
    public readonly: boolean = true
    public value?: Date | string | number
    public minDate?: Date | string | number
    public maxDate?: Date | string | number

    constructor(options?: Partial<IwFormCalendar>) {
        Object.assign(this, options)
    }
}
