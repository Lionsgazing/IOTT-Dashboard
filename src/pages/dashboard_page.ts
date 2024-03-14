import { dom } from "../lib/dom/dom"
import { Graph } from "../lib/graph"

export class DashboardPage {
    private _Container: HTMLDivElement
    private _Graph: Graph

    get Content() {
        return this._Container
    }

    constructor() {
        //Create container
        this._Container = dom.div("d-flex flex-grow-1 p-4")

        //Create graph
        this._Graph = new Graph(this._Container)

    }

    public async Setup() {
        //Load graph when window is ready
        window.onload = () => {
            this._Graph.Setup()
            console.log("Loaded")
        }

        //Resize whenever window is resized
        window.onresize = () => {
            this._Graph.Resize()
        }
    }
}