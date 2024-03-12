import { dom } from "../dom/dom"

type ButtonData = {
    colorPrefix: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"
    type: "submit" | "button" | "reset"
    content: string

    onclick?: (button_element: HTMLButtonElement, extra?: any[]) => void
    extra?: any[]

    classNameAdditions?: string
    outline?: boolean
    disabled?: boolean
}

export class Button {
    private _button: HTMLButtonElement
    get button() {
        return this._button
    }

    private data: ButtonData

    private index: number = 0

    constructor(data: ButtonData) {
        //Store button data
        this.data = data

        //Outline on/off
        let outline_str = ""
        if (this.data.outline) {
            outline_str = "outline-"
        }

        let classNameAdditions = ""
        if (this.data.classNameAdditions !== undefined) {
            classNameAdditions = this.data.classNameAdditions
        }

        this._button = dom.button("btn btn-" + outline_str + this.data.colorPrefix + " " + classNameAdditions)
        this._button.textContent = this.data.content

        //Disabled
        if (this.data.disabled === undefined) {
            this.data.disabled = false
        }
        this._button.disabled = this.data.disabled

        //Click callback.
        this._button.onclick = () => {
            this.data.onclick?.(this.button, this.data.extra) //Uses optional chaning to only execute if it exists.
        }       
    }
}