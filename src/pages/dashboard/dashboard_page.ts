import { DashboardConfig } from "../../config"
import { Navbar } from "../../lib/bootstrap/navbar"
import { NavbarItem } from "../../lib/bootstrap/navbarItem"
import { Sidebar } from "../../lib/bootstrap/sidebar"
import { SidebarItem } from "../../lib/bootstrap/sidebarItem"
import { dom } from "../../lib/dom/dom"
import { Graph } from "../../lib/graph"
import {Serie} from '../../lib/graph_series'
import { Router } from "../../lib/router"



export class DashboardPage {
    private _Container: HTMLDivElement

    private _GraphContainers: HTMLDivElement[]
    private _Graphs: Graph[]
    private _isLoaded: boolean
    private _config: DashboardConfig
    private _router: Router


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

        const sidebar_container = dom.div("d-flex flex-column")
        sidebar_container.style.maxWidth = "250px"
        const content_container = dom.div("d-flex flex-column flex-grow-1")

        //Create graphs and their corresponding containers and navigation.
        let navbar_items: NavbarItem[] = []
        for (const graph_info of config.graphs) {
            //Create container for graph
            const graph_container = dom.div("d-flex flex-grow-1 p-2")
            this._GraphContainers.push(graph_container)

            //Create graph
            const graph = new Graph(graph_container)
            this._Graphs.push(graph)

            //Create navbar item
            navbar_items.push(new NavbarItem({
                title: graph_info.title,
                active_color: "#000000",
                unactive_color: "#6c757d", 
                route_destination: "/graph=" + graph_info.title, 
                update_url: false,
                route_content: async () => {
                    return graph_container
                }
            }))
        }

        const sidebar = new Sidebar({
            title: "Graph Selection",
            title_color: "#000000",
            background_color: "#e9ecef",
            navbar_color: "",
            alignment: "justify-content-start",
            navitems: navbar_items
        },
        content_container)

        this._router = sidebar.Router

        sidebar_container.appendChild(sidebar.Content)

        this._Container.appendChild(sidebar_container)
        this._Container.appendChild(content_container)


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
        //Extract the extra information we know exists.
        const page_instance: DashboardPage = extra[0]
        const id: string = extra[1]

        //Check if we are loaded. If not reject
        if (!page_instance.IsLoaded) {
            return
        }
        
        //Get the payload
        const payload: {timestamp: number, temperature: number, humidity: number, pressure: number} =  json_payload

        //Extract keys, values and the timestamp
        const keys = Object.keys(payload)
        const values = Object.values(payload)
        const timestamp = payload.timestamp

        
        //Find the target index which matches the graph we want to edit.
        let target_index = -1
        for (let i = 0; i < page_instance._config.graphs.length; i++) {
            const id_link = page_instance._config.graphs[i].id_link

            //Found target - break
            if (id_link == id) {
                target_index = i
                break
            }
        }

        //Check if we found a match. If we did not do nothing.
        if (target_index <= -1) {
            return
        } 

        //Get targeted graph:
        const graph = page_instance._Graphs[target_index]

        //Now add series and insert data depending on the keys received. We only add series if they are missing.
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const value = values[i]

            //Check that the key is not timestamp
            if (key !== "timestamp") {
                //Check that the key does not exist as an id in the graph series.
                if (!(key in graph.Series)) {
                    graph.AddSeries([new Serie(key, key, "line", {x: [0], y: [1]}, "lttb", 100)])
                }

                graph.Series[key].Buffer.push([timestamp, value])
            }
        }   
    
        //Update graph
        graph.Update()        
    }
}