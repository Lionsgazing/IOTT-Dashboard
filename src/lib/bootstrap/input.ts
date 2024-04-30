import { dom } from "../dom/dom"
import type * as h from '../bootstrap/helperTypes'

export type InputData = {
    //type: "text" | "checkbox" | "radio" //"button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week"
    classNameAdditions?: string
    size?: h.Size
    padding?: h.Padding
    margin?: h.Margin

    //Boolean properties
    disabled?: boolean
    readonly?: boolean
}


export class Input {
    protected _Input: HTMLInputElement
    get Input() {
        return this._Input  
    }

    private data: InputData

    constructor(data: InputData, type: "text" | "plaintext" | "checkbox" | "radio" | "number" ) {
        this.data = data
        let className = "form-control"
        if (type === "text") {
            className = "form-control"
        }
        else if (type == "plaintext"){
            className = "form-control-plaintext"
        }
        else if (type == "number") {
            className = "form-control-number"
        }
        else {
            className = "form-check-input"
        }
        
        if (this.data.classNameAdditions !== undefined) {
            className = this.data.classNameAdditions
        }

        className += this.convert_margin_info(this.data)
        className += this.convert_padding_info(this.data)

        //Create input
        this._Input = dom.input(className)
        
        //Assign extras
        this._Input.type = type

        if (this.data.disabled !== undefined) {
            this._Input.disabled = this.data.disabled
        }

        if (this.data.readonly !== undefined) {
            this._Input.readOnly = this.data.readonly
        }
    }

    private convert_padding_info(data: InputData) {
        if (data.padding !== undefined) {
            let class_add_padding = ""
            if (data.padding.top !== undefined) {
                class_add_padding += " pt-" + data.padding.top
            }

            if (data.padding.bottom !== undefined) {
                class_add_padding += " pb-" + data.padding.bottom
            }

            if (data.padding.start !== undefined) {
                class_add_padding += " ps-" + data.padding.start
            }

            if (data.padding.end !== undefined) {
                class_add_padding += " pe-" + data.padding.end
            }

            return class_add_padding
        }
        else {
            return ""
        }
    }

    private convert_margin_info(data: InputData) {
        if (data.margin !== undefined) {
            let class_add_margin = ""
            
            if (data.margin.top !== undefined) {
                class_add_margin += " mt-" + data.margin.top
            } 

            if (data.margin.bottom !== undefined) {
                class_add_margin += " mb-" + data.margin.bottom
            }

            if (data.margin.start !== undefined) {
                class_add_margin += " ms-" + data.margin.start
            }
            
            if (data.margin.end !== undefined) {
                class_add_margin += " me-" + data.margin.end
            }
            return class_add_margin
        } 
        else {
            return ""
        }

    } 
}