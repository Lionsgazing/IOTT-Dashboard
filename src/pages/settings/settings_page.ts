import { dom } from "../../lib/dom/dom"


export class SettingsPage {
    private _Container: HTMLDivElement

    get Content() {
        return this._Container
    }

    constructor() {
        //Create container
        this._Container = dom.div("d-flex flex-grow-1 p-4")
    }

    public async Setup() {
        
    }
}