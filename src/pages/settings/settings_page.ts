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
    private _graph_threshold_label_input: Input
    private _graph_threshold_from_input: Input
    private _graph_threshold_to_input: Input
    private _graph_threshold_color_input: Input

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

        const graph_data_fetch_header = dom.h4("Data Fetching")
        const graph_data_fetch_header_seperator = dom.hr()

        const graph_data_fetch_days_input_label = dom.h5("Data fetch hours")
        
        this._graph_data_fetch_days_input = new Input({size: {width: "25", height: "25"}}, "text")
        this._graph_data_fetch_button = new Button({content: "Fetch", type: "button", colorPrefix: "primary", onClick: SettingsPage.onFetchDataButtonClicked, onClickExtra: this})
        const graph_data_fetch_row = dom.div("d-flex flex-row", [
            dom.div("d-flex flex-column flex-grow-1 pe-1", [this._graph_data_fetch_days_input.Input]), 
            dom.div("d-flex flex-column ps-1", [this._graph_data_fetch_button.button])
        ])

        const graph_data_fetch_container = dom.div("col pt-4", [graph_data_fetch_header, graph_data_fetch_header_seperator, graph_data_fetch_days_input_label, graph_data_fetch_row])
        GraphSettingsContainer.appendChild(graph_data_fetch_container)



        //Threshold
        const graph_threshold_header = dom.h4("Threshold")
        const graph_threshold_header_seperator = dom.hr()

        const graph_threshold_label_input_label = dom.h5("Threshold label")
        this._graph_threshold_label_input = new Input({size: {width: "25", height: "25"}, onChange: SettingsPage.onThresholdLabelChange, onChangeExtra: this}, "text")

        const graph_threshold_from_input_label = dom.h5("Threshold from")
        this._graph_threshold_from_input = new Input({size: {width: "25", height: "25"}, onChange: SettingsPage.onThresholdFromChange, onChangeExtra: this}, "text")

        const graph_threshold_to_input_label = dom.h5("Threshold to")
        this._graph_threshold_to_input = new Input({size: {width: "25", height: "25"}, onChange: SettingsPage.onThresholdToChange, onChangeExtra: this}, "text")

        const graph_threshold_input_range_row = dom.div("d-flex flex-row pt-2 pb-2", [
            dom.div("d-flex flex-column flex-grow-1 pe-1", [graph_threshold_from_input_label, this._graph_threshold_from_input.Input]), 
            dom.div("d-flex flex-column flex-grow-1 ps-1", [graph_threshold_to_input_label, this._graph_threshold_to_input.Input])
        ])

        const graph_threshold_color_label = dom.h5("Threshold color (HEX)")
        this._graph_threshold_color_input = new Input({size: {width: "25", height: "25"}, onChange: SettingsPage.onThresholdColorChange, onChangeExtra: this}, "text")

        const graph_threshold_container = dom.div("col pt-4", [
            graph_threshold_header, 
            graph_threshold_header_seperator, 
            graph_threshold_label_input_label, 
            this._graph_threshold_label_input.Input, 
            graph_threshold_input_range_row,
            graph_threshold_color_label,
            this._graph_threshold_color_input.Input
        ])

        GraphSettingsContainer.appendChild(graph_threshold_container)

        //Append containers
        this._Container.appendChild(GraphSettingsContainer)
        this._Container.appendChild(OtherSettingsContainer)

        //Subscribe to appSettings reload
        this._appSettings.SubscribeToReload(SettingsPage.onAppSettingsTrigger, this)
        this._appSettings.TriggerReload()

        //Set default states
        this._graph_realtime_switch.SetState(this._appSettings.Realtime)
    }

    static onAppSettingsTrigger(appSettings: AppSettings, extra: any) {
        const page_instance: SettingsPage = extra

        page_instance._graph_realtime_switch.Checkbox.checked = appSettings.Realtime

        page_instance._graph_data_fetch_days_input.Input.value = String(appSettings.DataFetchHours)

        page_instance._graph_threshold_label_input.Input.value = String(appSettings.ThresholdLabel)

        if (appSettings.ThresholdTo === undefined) {
            page_instance._graph_threshold_to_input.Input.value = "inf"
        }
        else {
            page_instance._graph_threshold_to_input.Input.value = String(appSettings.ThresholdTo)
        }

        if (appSettings.ThresholdFrom === undefined) {
            page_instance._graph_threshold_from_input.Input.value = "-inf"
        } 
        else {
            page_instance._graph_threshold_from_input.Input.value = String(appSettings.ThresholdFrom)
        }
        page_instance._graph_threshold_color_input.Input.value = String(appSettings.ThresholdColor)
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
        page_instance._appSettings.TriggerReload()
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

    static async onThresholdLabelChange(input: HTMLInputElement, extra: any) {
        const page_instance: SettingsPage = extra

        page_instance._appSettings.ThresholdLabel = input.value
        page_instance._appSettings.TriggerReload()
    }

    static async onThresholdFromChange(input: HTMLInputElement, extra: any) {
        const page_instance: SettingsPage = extra

        const input_lower_case = input.value.toLowerCase()
        if (input_lower_case === "Inf" || input_lower_case === "-Inf") {
            page_instance._appSettings.ThresholdTo = undefined
            return
        }

        const input_value = input.value
        let cast_value = Number(input_value)
        if (Number.isNaN(cast_value)) {
            cast_value = 0
            input.value = String(cast_value)
            console.log("Value conversion failed")
        }

        page_instance._appSettings.ThresholdFrom = cast_value
        page_instance._appSettings.TriggerReload()
    }
    static async onThresholdToChange(input: HTMLInputElement, extra: any) {
        const page_instance: SettingsPage = extra

        const input_lower_case = input.value.toLowerCase()
        if (input_lower_case === "inf" || input_lower_case === "-inf") {
            page_instance._appSettings.ThresholdTo = undefined
            return
        }

        const input_value = input.value
        let cast_value = Number(input_value)
        if (Number.isNaN(cast_value)) {
            cast_value = 0
            input.value = String(cast_value)
            console.log("Value conversion failed")
        }

        page_instance._appSettings.ThresholdTo = cast_value
        page_instance._appSettings.TriggerReload()
    }
    static async onThresholdColorChange(input: HTMLInputElement, extra: any) {
        const page_instance: SettingsPage = extra

        page_instance._appSettings.ThresholdColor = input.value
        page_instance._appSettings.TriggerReload()
    }
}