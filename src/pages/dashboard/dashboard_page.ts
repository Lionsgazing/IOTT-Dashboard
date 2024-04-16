import { DashboardConfig } from "../../config"
import { Navbar } from "../../lib/bootstrap/navbar"
import { NavbarItem } from "../../lib/bootstrap/navbarItem"
import { dom } from "../../lib/dom/dom"
import { Graph } from "../../lib/graph"
import {Serie} from '../../lib/graph_series'
import { Router } from "../../lib/router"



export class DashboardPage {
    private _Container: HTMLDivElement

    private _GraphContainers: HTMLDivElement[]
    private _Graphs: Graph[]
    private _Graph: Graph
    private _isLoaded: boolean
    private _config: DashboardConfig


    get IsLoaded() {
        return this._isLoaded
    }

    get Content() {
        return this._Container
    }

    constructor(config: DashboardConfig) {
        //Create container
        this._Container = dom.div("d-flex flex-grow-1")        
        this._GraphContainers = [] 
        this._Graphs = []
        this._config = config

        console.log(this._Container.style.height)

        const router = new Router({target_container: this._Container})

        const nav = new Navbar({
            title: "Devices",
            title_color: "#000000",
            background_color: "#e9ecef",
            navbar_color: "",
            vertical: true,
            NavbarItems: [
                new NavbarItem({
                    title: "Aalborg", 
                    active_color: "#FFFFFF", 
                    unactive_color: "#6c757d", 
                    route_destination: "/", 
                    route_content: async () => {
                        return dom.h1("boi") //Route to graph content
                    }
                }),
                new NavbarItem({
                    title: "Copenhagen", 
                    active_color: "#FFFFFF", 
                    unactive_color: "#6c757d", 
                    route_destination: "/", 
                    route_content: async () => {
                        return dom.h1("boi") //Route to graph content
                    }
                })
            ]
        },
        router)

        this._Container.appendChild(nav.Content)
                


        this._isLoaded = false
    }

    public async Setup() {

        for (const graph of this._Graphs) {
            //Refine this since it clearly works it just activates a little too often :).
            const mutObs = new MutationObserver(() => {
                graph.Setup(
                    {
                        name: "Timestamp",
                        type: "time"
                    },
                    {
                        name: "Value",
                        type: "value"
                    }
                )
                graph.Resize()

                this._isLoaded = true
            })

            //Observe the target for specific changes
            mutObs.observe(document.body, {childList: true, subtree: true})

            //Resize whenever window is resized
            window.onresize = () => {
                graph.Resize()
            }
        }
    }

    static onMqttMessage(topic: string, json_payload: object, extra: any) {
        const page_instance: DashboardPage = extra[0]
        const id: string = extra[1]

        //Check if we are loaded. If not reject
        if (!page_instance.IsLoaded) {
            return
        }
        
        const payload: {id: string, timestamp: number, data: number} =  json_payload
        const timestamp = payload.timestamp
        const data = payload.data

        //Check if the topic (id) is the dictionary yet. If not add it!
        if (!(id in page_instance._Graph.Series)) {
            page_instance._Graph.AddSeries([new Serie(id, id, "line", {x: [0], y: [1]}, "lttb", 100)])
        }

        //Add the data to the appropriate series
        page_instance._Graph.Series[id].Buffer.push([timestamp, data])
    
        //Update graph
        page_instance._Graph.Update()        
    }
}