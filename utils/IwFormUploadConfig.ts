export default class IwFormUploadConfig {
    public acceptedFileTypes: string[] = []
    public _files?: FileList | null
    public icon: string = 'octicon:cloud-upload'
    public imageSrc?: string
    public label: string = 'Click to upload'
    public maxHeight: string = 'max-h-[500px]'
    public onDrop?: Function
    public onDragOver?: Function
    public onLoad?: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null;
    public onError?: Function
    public onUploadFileChange?: Function
    public sampleDownloadLink?: string
    public sampleDownloadLinkLabel?: string
    public type?: IwFormUploadType
    public uploadFunc?: (files?: FileList | null, base64Content?: string) => void

    constructor(options?: Partial<IwFormUploadConfig>) {
        Object.assign(this, options)
    }


    public async _onDrop(event: DragEvent) {
        const files = event.dataTransfer?.files;
        this._onFileChanged(files)

        return
    }

    private _onFileChanged(files?: FileList | null) {
        this._files = files;
        if (files && files.length > 0) {
            const file = files[0];
            if (this.acceptedFileTypes.length > 0 &&
                !this.acceptedFileTypes.includes(file.type)) {
                throw new Error(`Only file ` + this.acceptedFileTypes.join(', ') + ` are allowed.`)
            }

            const reader = new FileReader()
            reader.onload = this.onLoad ?? this._onLoad.bind(this)
            reader.readAsDataURL(file);
        }
    }


    public _onImageLoaded(content: string | ArrayBuffer) {
        this.imageSrc = content as string
    }

    public _onLoad(e: ProgressEvent<FileReader>) {
        const result = e.target?.result
        if (result) {
            if ('image' == this.type) {
                this._onImageLoaded(result)
            }

            if (this.uploadFunc) {
                this.uploadFunc(this._files, result)
            }
        }

    }

    public _onUploadFileChange(event: Event) {
        const inputElement = event.target as HTMLInputElement
        return this._onFileChanged(inputElement.files)
    }


    public getAcceptedFileTypes(): string | undefined {
        if (this.acceptedFileTypes) {
            return this.acceptedFileTypes.join(',')
        }

        return undefined
    }

    public getFiles(): FileList | null | undefined {
        return this._files
    }

    public setImageSrc(src: string) {
        this.imageSrc = src
    }
}

