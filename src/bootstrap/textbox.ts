import { Input, InputData } from "./input";

export interface TextboxData extends InputData {
    value?: string
    placeholder?: string

    //Boolean properties
    plainText?: boolean
}

export class Textbox extends Input {
    private T_data: TextboxData
    private _Textbox: HTMLInputElement
    get Textbox() {
        return this._Textbox
    }

    constructor(data: TextboxData) {
        //Call Input constructor with type text since this is a textbox.
        if (!data.plainText) {
            super(data, "text")
        }
        else {
            super(data, "plaintext")
        }

        //Copy reference to a more accessible one.
        this._Textbox = this._Input

        //Save data ref
        this.T_data = data

        if (this.T_data.value !== undefined) {
            this._Textbox.value = this.T_data.value
        }

        if (this.T_data.placeholder !== undefined) {
            this._Textbox.placeholder = this.T_data.placeholder
        }
    }
}