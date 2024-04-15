import { dom } from "../../lib/dom/dom"
import { Graph } from "../../lib/graph"
import {graph_buffer} from '../../lib/graph_buffer'
import {Serie} from '../../lib/graph_series'

export class DashboardPage {
    private _Container: HTMLDivElement
    private _Graph: Graph

    private _buffer: graph_buffer
    private _series: Serie[]

    get Content() {
        return this._Container
    }

    constructor() {
        //Create container
        this._Container = dom.div("d-flex flex-grow-1 p-4")

        //Create graph
        this._buffer = new graph_buffer(0, 3, 100)
        this._series = [
            new Serie("Test", "line", this._buffer.buffer, {x: [0], y: [1]}, "lttb"),
            new Serie("Test2", "line", this._buffer.buffer, {x: [0], y: [2]}, "lttb")
        ]
        
        this._Graph = new Graph(this._Container)     
    }

    public async Setup() {
       
        //Refine this since it clearly works it just activates a little too often :).
        const mutObs = new MutationObserver(() => {
            this._Graph.Setup(this._series,
                {
                    name: "Timestamp",
                    type: "time"
                },
                {
                    name: "Value",
                    type: "value"
                }
                )
            this._Graph.Resize()

            console.log("Loaded")
        })

        //Observe the target for specific changes
        mutObs.observe(document.body, {childList: true, subtree: true})

        //Resize whenever window is resized
        window.onresize = () => {
            this._Graph.Resize()
        }

        console.log("Setup done")
    }

    static onMqttMessage(json_payload: object, extra: any) {
        const page_instance: DashboardPage = extra
        
        const payload: {timestamp: number, sin0: number, sin1: number} =  json_payload
        const timestamp = payload.timestamp
        const sin0 = payload.sin0
        const sin1 = payload.sin1

        page_instance._buffer.push([timestamp, sin0, sin1])
        page_instance._Graph.Update()        
    }
}