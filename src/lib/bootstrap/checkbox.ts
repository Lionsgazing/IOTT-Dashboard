import { dom } from "../dom/dom"

export type CheckboxConfig = {
    title: string
}

export class Checkbox {
    private _Container: HTMLDivElement
    get Content() {
        return this._Container
    }

    private _config: CheckboxConfig

    constructor(config: CheckboxConfig) {
        this._config = config

        this._Container = dom.div("form-check form-switch")
        const label = dom.label("form-check-label", this._config.title)
        const input = dom.input("form-check-input")
        input.type = "checkbox"
        input.role = "switch"

        this._Container.appendChild(label)
        this._Container.appendChild(input)
    }
}