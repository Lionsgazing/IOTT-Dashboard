import { Checkbox } from "../../lib/bootstrap/checkbox"
import { Input } from "../../lib/bootstrap/input"
import { dom } from "../../lib/dom/dom"
import { StatusPage } from "../status/status_page"
import { AppSettings } from "./settings"


export class SettingsPage {
    private _appSettings: AppSettings

    private _Container: HTMLDivElement
    get Content() {
        return this._Container
    }

    constructor(appSettings: AppSettings) {
        this._appSettings = appSettings

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
        const graph_realtime_switch = new Checkbox({title: "Realtime", type: "slider", onChange: SettingsPage.onRealtimeChange, onChangeExtra: this})
        const graph_switches_container = dom.div("col pb-2", [graph_realtime_switch.Content])
        GraphSettingsContainer.appendChild(graph_switches_container)

        //Data fetching settings
        // - How much to fetch (x hours back in time)
        // - Refetch button
        // - 

        const graph_data_fetch_header = dom.h4("Data Fetching")
        const graph_data_fetch_header_seperator = dom.hr()

        GraphSettingsContainer.appendChild(graph_data_fetch_header)
        GraphSettingsContainer.appendChild(graph_data_fetch_header_seperator)

        const graph_data_fetch_days_input_label = dom.h5("Data fetch days")
        
        const graph_data_fetch_days_input = new Input({size: {width: "25", height: "25"}}, "text")
        const graph_data_fetch_row = dom.div("col", [graph_data_fetch_days_input.Input])
        GraphSettingsContainer.appendChild(graph_data_fetch_days_input_label)
        GraphSettingsContainer.appendChild(graph_data_fetch_row)


        this._Container.appendChild(GraphSettingsContainer)
        this._Container.appendChild(OtherSettingsContainer)

        //Set default states
        graph_realtime_switch.SetState(this._appSettings.Realtime)
    }

    public async Setup() {
        
    }

    static async onRealtimeChange(input: HTMLInputElement, extra: any) {
        const page_instance: SettingsPage = extra

        if (input.checked) {
            page_instance._appSettings.Realtime = true
        }
        else {
            page_instance._appSettings.Realtime = false
        }
    }
}