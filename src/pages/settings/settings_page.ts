import { Button } from "../../lib/bootstrap/button"
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

    //UI Elements
    private _graph_realtime_switch: Checkbox
    private _graph_data_fetch_days_input: Input
    private _graph_data_fetch_button: Button

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
        this._graph_realtime_switch = new Checkbox({title: "Realtime", type: "slider", onChange: SettingsPage.onRealtimeChange, onChangeExtra: this})
        const graph_switches_container = dom.div("col pb-2", [this._graph_realtime_switch.Content])
        GraphSettingsContainer.appendChild(graph_switches_container)

        //Data fetching settings
        // - How much to fetch (x hours back in time)
        // - Refetch button
        // - 

        const graph_data_fetch_header = dom.h4("Data Fetching")
        const graph_data_fetch_header_seperator = dom.hr()

        GraphSettingsContainer.appendChild(graph_data_fetch_header)
        GraphSettingsContainer.appendChild(graph_data_fetch_header_seperator)

        const graph_data_fetch_days_input_label = dom.h5("Data fetch hours")
        
        this._graph_data_fetch_days_input = new Input({size: {width: "25", height: "25"}}, "text")
        this._graph_data_fetch_button = new Button({content: "Fetch", type: "button", colorPrefix: "primary", onClick: SettingsPage.onFetchDataButtonClicked, onClickExtra: this})
        const graph_data_fetch_row = dom.div("d-flex flex-row", [
            dom.div("d-flex flex-column flex-grow-1 pe-1", [this._graph_data_fetch_days_input.Input]), 
            dom.div("d-flex flex-column ps-1", [this._graph_data_fetch_button.button])
        ])
        GraphSettingsContainer.appendChild(graph_data_fetch_days_input_label)
        GraphSettingsContainer.appendChild(graph_data_fetch_row)


        this._Container.appendChild(GraphSettingsContainer)
        this._Container.appendChild(OtherSettingsContainer)

        //Set default states
        this._graph_realtime_switch.SetState(this._appSettings.Realtime)
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

    static async onFetchDataButtonClicked(button: HTMLButtonElement, extra: any) {
        const page_instance: SettingsPage = extra

        const input = page_instance._graph_data_fetch_days_input.Input
        const input_value = input.value
        let cast_value = Number(input_value)

        //Check if the converted value is NaN and handle that
        if (Number.isNaN(cast_value)) {
            cast_value = 0
            input.value = String(cast_value)
            console.log("Value conversion failed")
        }

        //Save the setting
        page_instance._appSettings.DataFetchHours = cast_value
        page_instance._appSettings.RefetchGraphData = true

        //Trigger
        page_instance._appSettings.TriggerReload()
    }
}