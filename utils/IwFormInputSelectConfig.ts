export default class IwFormInputSelectConfig {
    public keyName = 'value'
    public labelName = 'label'

    // allowEmptySelect: allow to remove all selected values. Otherwise one must be left selected
    public allowEmptySelect = true
    /** Autofocus on the first option when the dropdown is open */
    public autofocus = true
    public closeOnSelect = true
    public disabled = false
    // hideOnSelect: hide alredy selected options
    public hideOnSelect = false
    public isOptionObject = true
    /** Loading spinner will show or hide based on showLoading value*/
    public showLoading = false
    public maxSelected = null
    public multiple = false
    // Limits the options displayed in the dropdown to the first X options.
    public optionsLimit = 1000
    public placeholder = 'Select one'
    public searchable = false
    /**
     * Shown when a search fails (search yields no result)
     * (default: Multiselect's internal text)
     */
    public searchFailedText = ''
    public selected: IwFormInputSelectedKeys = undefined
    public selectLabel: string = ''
    /** Show or hide .searchFailedText when the search fails */
    public showNoResults = true
    // taggable: enable / disable tagging
    public taggable = false
    public tagPlaceholder = ''
    // tagPosition: By default new tags will appear above the search results. Changing to 'bottom' will revert this behaviour and will proritize the search results
    public tagPosition = 'top'

    constructor(public options: Array<IwFormInputSelectOption>,
        cfg?: Partial<IwFormInputSelectConfig>) {
        this.patch(options, cfg)
    }

    /**
     * Apply partial updates to the dropdown config
     * @param options   Formatted dropdown options (with labels and values)
     * @param cfg       Dropdown config to be applied
     */
    patch(newOptions: Array<IwFormInputSelectOption> | null,
        cfg?: Partial<IwFormInputSelectConfig>) {
        if (cfg) {
            if (!cfg.showLoading) cfg.showLoading = false
        }

        const myOptions = {}
        if (newOptions !== null && newOptions !== undefined) {
            myOptions['options'] = newOptions
        }
        Object.assign(this, cfg, myOptions)
    }

    setShowLoading(isShowLoading = true) {
        this.showLoading = isShowLoading
    }
}
