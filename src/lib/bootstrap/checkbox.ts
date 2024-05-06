import { dom } from "../dom/dom"

export type CheckboxConfig = {
    title: string
    type: "slider"
    onChange?: (input: HTMLInputElement, extra: any) => void
    onChangeExtra?: any
}

export class Checkbox {
    private _Container: HTMLDivElement
    get Content() {
        return this._Container
    }

    get Checkbox() {
        return this._input
    }

    private _input: HTMLInputElement

    private _config: CheckboxConfig

    constructor(config: CheckboxConfig) {
        this._config = config

        const result = this._setup(this._config.type)
        this._Container = result[0]
        this._input = result[1]

        if (this._config.onChange !== undefined) {
            this._input.onchange = async () => {
                await this._config.onChange!(this._input, this._config.onChangeExtra)
            }
        }
    }

    public SetState(checked: boolean) {
        this._input.checked = checked
    }

    private _setup(type: string): [HTMLDivElement, HTMLInputElement] {
        if (type === "slider") {
            const container = dom.div("form-check form-switch")
            const label = dom.label("form-check-label", this._config.title)
            const input = dom.input("form-check-input")
            input.type = "checkbox"
            input.role = "switch"
    
            container.appendChild(label)
            container.appendChild(input)

            return [container, input]
        }

        return [dom.div(""), dom.input("")]
    }
}