export default class IwFormInputSelectConfig {
    public keyName = 'value'
    public labelName = 'label'
    public placeholder = ''
    public multiple = false
    public selected: number | string | { value: number | string, [key: string]: any } | undefined = undefined

    constructor(public options: Array<IwFormInputSelectOption>,
        cfg?: Partial<IwFormInputSelectConfig>) {
        Object.assign(this, cfg)
    }
}
