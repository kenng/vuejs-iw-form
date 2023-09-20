import { T } from "dist/_nuxt/entry.d70b52c7"

export default class IwFormUploaderConfig {
    public _files?: FileList | null
    public acceptedFileTypes: string[] = []
    public icon: string = 'octicon:cloud-upload'
    public imageSrc?: string
    public emit?: Function
    public label: string = 'Click to upload'
    public maxHeight: string = 'max-h-[500px]'
    public onDrop?: Function
    public onDragOver?: Function
    public onImageLoaded?: (src: string) => void
    public onLoad?: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null;
    public onError?: Function
    public onRemoveImage?: Function
    public onUploaded?: (res: any) => any
    public onUploadFileChange?: Function
    public sampleDownloadLink?: string
    public sampleDownloadLinkLabel?: string
    public type: IwFormUploadType = 'image'
    public uploadFunc?: (files?: FileList | null) => any | { url: string }

    constructor(options?: Partial<IwFormUploaderConfig>) {
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


    public async _onLoad(e: ProgressEvent<FileReader>) {
        const result = e.target?.result
        if (result) {
            if ('image' == this.type) {
                if (this.onImageLoaded) this.onImageLoaded(result as string)

            }

            if (this.uploadFunc) {
                const res = await this.uploadFunc(this._files) as any
                if (this.onUploaded) this.onUploaded(res)
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
}

