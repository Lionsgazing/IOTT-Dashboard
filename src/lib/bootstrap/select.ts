import { dom } from "../dom/dom"

import type * as h from '../bootstrap/helperTypes'

export type Select_Data = {
    classNameAdditions?: string
    margin?: h.Margin
    padding?: h.Padding
    size?: h.Size

    //Boolean properties
    disabled?: boolean
    multiple?: boolean
}

export class Select {
    private _Select: HTMLSelectElement
    get Select() {
        return this._Select
    }

    private data: Select_Data

    private option_value_list: string[]
    private option_list: HTMLOptionElement[]

    constructor(data: Select_Data) {
        this.data = data

        let className = "form-select"
        if (this.data.classNameAdditions !== undefined) {
            className += " " + this.data.classNameAdditions
        }

        className += this.convert_margin_info(this.data)
        className += this.convert_padding_info(this.data)

        this._Select = dom.select(className)

        if (this.data.multiple !== undefined) {
            this._Select.multiple = this.data.multiple
        } 

        if (this.data.disabled !== undefined) {
            this._Select.disabled = this.data.disabled
        }

        this.option_value_list = []
        this.option_list = []
    }

    public set_options(option_value_list: string[]) {
        //If option list exists, remove it.
        if (this.option_list !== undefined) {
            for (let i = 0; i < this.option_list.length; i++) {
                this._Select.removeChild(this.option_list[i])
            }
        }

        //Wipe option list
        this.option_list = []
        this.option_value_list = []

        const start_option = dom.option()
        start_option.selected = true
        this.option_list.push(start_option)
        this._Select.appendChild(start_option)

        for (let i = 0; i < option_value_list.length; i++) {
            const option = dom.option()
            option.value = String(i + 1)
            option.textContent = option_value_list[i]
            this.option_list.push(option)
            this._Select.appendChild(option)
        }

        //Save option value list
        this.option_value_list = option_value_list
    }

    private convert_padding_info(data: Select_Data) {
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

    private convert_margin_info(data: Select_Data) {
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