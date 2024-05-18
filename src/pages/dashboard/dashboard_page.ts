import { DashboardConfig } from "../../config/config"
import { NavbarItem } from "../../lib/bootstrap/navbarItem"
import { Sidebar } from "../../lib/bootstrap/sidebar"
import { dom } from "../../lib/dom/dom"
import { Graph } from "../../lib/graph"
import {Serie} from '../../lib/graph_series'
import { AppSettings } from "../settings/settings"
import { get_data } from "../../lib/get_data"
import { Spinner } from "../../lib/bootstrap/spinner"



export class DashboardPage {


    private _GraphContainers: HTMLDivElement[]
    private _Graphs: Graph[]
    private _isLoaded: boolean
    private _config: DashboardConfig

    private _TopContainer: HTMLDivElement
    private _SidebarContainer: HTMLDivElement
    private _ContentContainer: HTMLDivElement

    private _sidebar: Sidebar

    private _thresholdWarning: Spinner
    private _thresholdWarningTarget: string

    get IsLoaded() {
        return this._isLoaded
    }

    get Content() {
        return this._TopContainer
    }

    private _appSettings: AppSettings

    constructor(config: DashboardConfig, appSettings: AppSettings, ThresholdWarning: Spinner, ThresholdWarningTarget: string) {
        this._appSettings = appSettings
        this._thresholdWarning = ThresholdWarning
        this._thresholdWarningTarget = ThresholdWarningTarget

        //Subscribe to appSettings reload
        this._appSettings.SubscribeToReload(DashboardPage.onAppSettingsTrigger, this)

        //Save given values
        this._config = config

        //Create containers
        this._TopContainer = dom.div("d-flex flex-grow-1")        
        this._SidebarContainer = dom.div("d-flex flex-column")
        this._ContentContainer = dom.div("d-flex flex-column flex-grow-1")

        //Set style elements for containers
        this._SidebarContainer.style.maxWidth = "250px"
        
        //Craete storage
        this._GraphContainers = [] 
        this._Graphs = []

        //Create graphs and their corresponding containers and navigation.
        let navbar_items: NavbarItem[] = []
        for (const graph_info of config.graphs) {
            //Create container for graph
            const graph_container = dom.div("d-flex flex-grow-1 p-2")
            this._GraphContainers.push(graph_container)

            //Create graph
            const graph = new Graph(graph_container, graph_info.title, graph_info.id_link)
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

        //Append the content
        this._TopContainer.appendChild(this._SidebarContainer)
        this._TopContainer.appendChild(this._ContentContainer)

        //Create sidebar
        this._sidebar = new Sidebar({
            title: "Graph Selection",
            title_color: "#000000",
            background_color: "#e9ecef",
            navbar_color: "",
            alignment: "justify-content-start",
            grow: true,
            navitems: navbar_items
        },
        this._ContentContainer)

        this._SidebarContainer.appendChild(this._sidebar.Content)


        this._isLoaded = false
    }

    public async Setup() {
        for (const graph of this._Graphs) {
            //Refine this since it clearly works it just activates a little too often :).
            const mutObs = new MutationObserver(() => {
                graph.Setup(
                    {
                        show: true,
                        text: graph.Title
                    },
                    {
                        name: "Timestamp",
                        type: "time"
                    },
                    {
                        //name: "Value", //Removed name because it not needed in this case and had problems with moving it around.
                        type: "value",
                        nameLocation: "middel",
                        nameRotate: 90,
                        nameGap: 50
                    }
                )
                graph.Resize()

                this._isLoaded = true
            })

            //Observe the target for specific changes
            mutObs.observe(document.body, {childList: true, subtree: true})

            //Resize graph whenever window is resized
            window.addEventListener("resize", () => {
                graph.Resize()
            })
        }        
    }

    public async fetchData(hours: number) {
        //Try to get the data from the database
        let json_payload
        try {
            json_payload = await get_data(hours)
            console.info("[DashboardPage] Got " + String(hours) + " hours of data from database.")
        }
        catch(e) {
            console.error("[DashboardPage] Failed getting " + String(hours) + " hours of data from database.")
            console.error(e)
            return
        }

        //Apply data to each graph.
        for (const graph of this._Graphs) {
            //Clear graph series data
            graph.ClearSeriesData()

            //Replace data for each series in the current graph.
            const json_data = json_payload[graph.ID]
            for (const SerieID of graph.SeriesIDs) {
                graph.Series[SerieID].Buffer.replaceAll(json_data[SerieID])
            }

            //Update graph series
            graph.Update()
        }
    }

    static onAppSettingsTrigger(appSettings: AppSettings, extra: any) {
        const page_instance: DashboardPage = extra

        //Check if refetch is needed.
        if (appSettings.RefetchGraphData) {
            void page_instance.fetchData(appSettings.DataFetchHours)
            appSettings.RefetchGraphData = false
        }
        for (const graph of page_instance._Graphs) {
            page_instance._thresholdWarning.Hide() //Reset it to hiding just incase we never trigger the event again
            graph.SetThreshold(appSettings.ThresholdFrom, appSettings.ThresholdTo, appSettings.ThresholdColor, appSettings.ThresholdLabel + " " + appSettings.ThresholdTarget)
        }
    }

    static onMqttMessage(topic: string, json_payload: any, extra: any) {
        //Extract the extra information we know exists.
        const page_instance: DashboardPage = extra[0]
        const id: string = extra[1]

        //Check if we are loaded. If not reject
        if (!page_instance.IsLoaded) {
            return
        }

        //Check if realtime is enabled
        if (!page_instance._appSettings.Realtime) {
            return
        }
        
        //Get the payload
        const payload: {timestamp: number, temperature: number, humidity: number, pressure: number} = json_payload

        //Extract keys, values and the timestamp
        const keys = Object.keys(payload)
        const values = Object.values(payload)

        let timestamp = payload.timestamp 

        //So there is something wrong with the data we send sometimes for some reason so we just quickfix it here. NOT OPTIMAL!!!
        if (timestamp % 1 != 0) {
            timestamp = Math.floor(timestamp) * 1000
        }
        
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
        const display_x_axis = page_instance._config.graphs[target_index].display_x_axis
        const display_y_axis = page_instance._config.graphs[target_index].display_y_axis

        let avg_temp = 0

        //Now add series and insert data depending on the keys received. We only add series if they are missing.
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const value = values[i]

            //Threshold logic. Just checks if we are between the set Threshold interval defined in settings.
            if (key == page_instance._appSettings.ThresholdTarget) {
                //Check that it is a number before evaluating
                if (typeof page_instance._appSettings.ThresholdFrom !== "number") {
                    break
                }

                if (value >= page_instance._appSettings.ThresholdFrom!) {
                    if (page_instance._appSettings.ThresholdTo !== undefined) {
                        //Check that it is a number before evaluating
                        if (typeof page_instance._appSettings.ThresholdTo !== "number") {
                            break
                        }

                        if (value <= page_instance._appSettings.ThresholdTo) {
                            page_instance._thresholdWarning.Show("Threshold warning: " + String(id))
                        }
                        else {
                            page_instance._thresholdWarning.Hide()
                        }
                    }
                    else {
                        page_instance._thresholdWarning.Show("Threshold warning: " + String(id))
                    }
                }
                else {
                    page_instance._thresholdWarning.Hide()
                }
            }

            //Check that the key is not timestamp
            if (key !== display_x_axis) {
                //Check that the key does not exist as an id in the graph series.
                if (page_instance.locate(key, display_y_axis) >= 0) {
                    if (key in graph.Series == false) {
                        graph.AddSeries([new Serie(key, key, "line", {x: [1], y: [0]}, "lttb", 100)])
                    }
                    
                    graph.Series[key].Buffer.push([value, timestamp])

                    if (key === "temperature") {
                        avg_temp = graph.Series[key].Buffer.average()[0]
                    }
                }
            }
        }   
        
        //Update graph
        graph.Update("Average Temperature: " + String(avg_temp))        
    }

    private locate(target: any, arr: any[]) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i
            }
        }

        return -1
    }
}