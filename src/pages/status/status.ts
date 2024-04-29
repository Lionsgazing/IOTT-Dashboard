import { SmartText } from "../../lib/bootstrap/smarttext"

export type DeviceStatusConfig = {
    device_name: string
    initial_state: boolean
    id: string
}

export class DeviceStatus {
    private _smartText: SmartText
    private _container: HTMLDivElement
    get Content() {
        return this._container
    }

    private _config: DeviceStatusConfig

    private _isOnline?: boolean
    get IsOnline() {
        return this._isOnline!
    }
    set IsOnline(online: boolean) {
        this._isOnline = online
        this.SetState(this._isOnline)
    }

    private _id: string
    get ID() {
        return this._id
    }

    constructor(config: DeviceStatusConfig) {
        this._config = config
        this._smartText = new SmartText({type: "h4", contents: [this._config.device_name, " - ", "Unknown"], colors: ["", "", ""]})
        this._container = this._smartText.Content

        this._id = this._config.id

        this.IsOnline = this._config.initial_state
    }

    private SetState(online: boolean) {
        if (online) {
            this._smartText.changeElement(2, "Online", "#198754")
        }
        else {
            this._smartText.changeElement(2, "Offline", "#dc3545")
        }
    }
}