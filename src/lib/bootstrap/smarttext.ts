import { dom } from "../dom/dom"
import { isColorHex } from "./color_identifier"


export type SmartTextConfig = {
    type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    contents: string[]
    colors: string[]
}

export class SmartText {
    private _Container: HTMLDivElement
    private _data: SmartTextConfig
    private _textElements: HTMLSpanElement[]

    get Content() {
        return this._Container
    }

    constructor(data: SmartTextConfig) {
        this._data = data
        this._Container = this.create(this._data.type)

        this._textElements = []
        for (let i = 0; i < this._data.contents.length; i++) {
            const span = dom.span()
            span.textContent = this._data.contents[i]
            
            const color = this._data.colors[i]
            if (isColorHex(color)) {
                span.style.color = color
            }

            this._textElements.push(span)
        }       

        for (const textElement of this._textElements) {
            this._Container.appendChild(textElement)
        }
    }

    public changeElement(element_index: number, content: string, color: string) {
        if (element_index > 0 && element_index < this._textElements.length) {
            //Overwrite data
            this._data.contents[element_index] = content
            this._data.colors[element_index] = color

            //Recreate all elements
            this.changeAllElements(this._data.contents, this._data.colors)
        }
    }

    public changeAllElements(contents: string[], colors: string[]) {
        //Save new data
        this._data.contents = contents
        this._data.colors = colors

        //Remove elements from the container first
        while (this._Container.firstChild) {
            this._Container.removeChild(this._Container.firstChild)
        }

        //Overwrite existing elements by creating entierly new ones!
        this._textElements = []
        for (let i = 0; i < this._data.contents.length; i++) {
            const span = dom.span()
            span.textContent = this._data.contents[i]
            
            const color = this._data.colors[i]
            if (isColorHex(color)) {
                span.style.color = color
            }

            this._textElements.push(span)
        }       

        for (const textElement of this._textElements) {
            this._Container.appendChild(textElement)
        }
    }

    private create(type: string) {
        switch (type) {
            case "h1":
                return dom.h1("")
            case "h2":
                return dom.h2("")
            case "h3":
                return dom.h3("")
            case "h4":
                return dom.h4("")
            case "h5":
                return dom.h5("")
            case "h6":
                return dom.h6("")
            default:
                return dom.h1("")
        }

    }
}