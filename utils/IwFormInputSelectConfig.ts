export default class IwFormInputSelectConfig {
    public keyName = 'value'
    public labelName = 'label'

    // allowEmptySelect: allow to remove all selected values. Otherwise one must be left selected
    public allowEmptySelect = true
    public closeOnSelect = true
    public disabled = false
    // hideOnSelect: hide alredy selected options
    public hideOnSelect = false
    public isOptionObject = true
    public showLoading = false
    public maxSelected = null
    public multiple = false
    // Limits the options displayed in the dropdown to the first X options.
    public optionsLimit = 1000
    public placeholder = 'Select one'
    public searchable = false
    public selected: IwFormInputSelectedOption = undefined
    public selectLabel: string = ''
    // taggable: enable / disable tagging
    public taggable = false
    public tagPlaceholder = ''
    // tagPosition: By default new tags will appear above the search results. Changing to 'bottom' will revert this behaviour and will proritize the search results
    public tagPosition = 'top'

    constructor(public options: Array<IwFormInputSelectOption>,
        cfg?: Partial<IwFormInputSelectConfig>) {
        Object.assign(this, cfg)
    }
}
