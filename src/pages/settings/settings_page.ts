import { Checkbox } from "../../lib/bootstrap/checkbox"
import { dom } from "../../lib/dom/dom"


export class SettingsPage {
    private _Container: HTMLDivElement

    get Content() {
        return this._Container
    }

    constructor() {
        //Create container
        this._Container = dom.div("d-flex flex-grow-1 p-4")
        const GraphSettingsContainer = dom.div("col")
        const OtherSettingsContainer = dom.div("col")

        //Graph settings
        const graph_settings_header = dom.h2("Graph Settings")
        const graph_settings_header_seperator = dom.hr()
        GraphSettingsContainer.appendChild(graph_settings_header)
        GraphSettingsContainer.appendChild(graph_settings_header_seperator)

        //Realtime setting
        const graph_realtime_header = dom.h4("Realtime")
        const graph_realtime_switch = new Checkbox({title: "Realtime"}).Content

        GraphSettingsContainer.appendChild(graph_realtime_switch)

        //Data fetching settings
        // - How much to fetch (x hours back in time)
        // - Refetch button
        // - 



        this._Container.appendChild(GraphSettingsContainer)
        this._Container.appendChild(OtherSettingsContainer)
    }

    public async Setup() {
        
    }
}