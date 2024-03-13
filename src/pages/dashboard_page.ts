import { dom } from "../lib/dom/dom"
import { Graph } from "../lib/graph"

export class DashboardPage {
    private _Container: HTMLDivElement
    private _Graph_Container: HTMLDivElement

    get Content() {
        return this._Container
    }

    constructor() {
        //Create container
        this._Container = dom.div("d-flex")
        this._Graph_Container = dom.div("container-fluid")

        this._Container.appendChild(dom.h1("Test"))
        this._Container.appendChild(this._Graph_Container)
        //this._Container.style.height = '500%'
        //this._Container.style.width = '500%'
    }

    public async Setup() {
        const graph = new Graph(this._Graph_Container)
    }
}