import { dom } from "../dom/dom"

export type SpinnerData = {
    ContainerClassExtra?: string
    SpinnerClassExtra?: string
    SpinnerTextClassExtra?: string
    SpinnerColor?: string
    TextColor?: string

    Text?: string
    
}

export class Spinner {
    private _Container: HTMLDivElement
    private _Spinner: HTMLSpanElement
    private _SpinnerText: HTMLSpanElement

    private _ContainerBasicClassName: string

    private _isShown: boolean

    private _data: SpinnerData

    get Content() {
        return this._Container
    }

    get isShown() {
        return this._isShown
    }

    constructor (data: SpinnerData) {
        this._data = data

        //Setup spinner
        if (this._data.ContainerClassExtra === undefined) this._data.ContainerClassExtra = ""
        this._Container = dom.div("d-flex flex-row flex-grow-1 " + this._data.ContainerClassExtra)
        this._ContainerBasicClassName = this._Container.className

        if (this._data.SpinnerClassExtra === undefined) this._data.SpinnerClassExtra = ""
        this._Spinner = dom.span("spinner-grow " + this._data.SpinnerClassExtra)
        this._Spinner.style.color = this._data.SpinnerColor!

        if (this._data.SpinnerTextClassExtra === undefined) this._data.SpinnerTextClassExtra = ""
        this._SpinnerText = dom.span("" + this._data.SpinnerTextClassExtra)
        this._SpinnerText.textContent = this._data.Text!

        this._SpinnerText.style.color = this._data.TextColor!
        this._SpinnerText.style.whiteSpace = "nowrap"
        this._SpinnerText.style.fontSize = "19px"

        this._Container.appendChild(this._SpinnerText)
        this._Container.appendChild(this._Spinner)

        //Set default state
        this._isShown = false

        //Trigger state
        this.Hide()
    }

    public Show(newText?: string) {
        this._Container.className = this._ContainerBasicClassName + " visible"
        if (newText !== undefined) this._SpinnerText.textContent = newText
        this._isShown = true
    }

    public Hide() {
        this._Container.className = this._ContainerBasicClassName + " invisible"
        this._isShown = false
    }
}