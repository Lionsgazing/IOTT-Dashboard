import { dom } from "../../lib/dom/dom"
import { Graph } from "../../lib/graph"
import {graph_buffer} from '../../lib/graph_buffer'
import {Serie} from '../../lib/graph_series'

export class DashboardPage {
    private _Container: HTMLDivElement
    private _Graph: Graph

    get Content() {
        return this._Container
    }

    constructor() {
        //Create container
        this._Container = dom.div("d-flex flex-grow-1 p-4")        
        this._Graph = new Graph(this._Container)     
    }

    public async Setup() {
       
        //Refine this since it clearly works it just activates a little too often :).
        const mutObs = new MutationObserver(() => {
            this._Graph.Setup(
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
    }

    static onMqttMessage(topic: string, json_payload: object, extra: any) {
        const page_instance: DashboardPage = extra
        
        const payload: {timestamp: number, data: number} =  json_payload
        const timestamp = payload.timestamp
        const data = payload.data

        console.log("we are here!")

        //Check if the topic (id) is the dictionary yet. If not add it!
        if (!(topic in page_instance._Graph.Series)) {
            page_instance._Graph.AddSeries([new Serie(topic, topic, "line", {x: [0], y: [1]}, "lttb", 100)])
        }

        //Add the data to the appropriate series
        page_instance._Graph.Series[topic].Buffer.push([timestamp, data])
    
        //Update graph
        page_instance._Graph.Update()        
    }
}