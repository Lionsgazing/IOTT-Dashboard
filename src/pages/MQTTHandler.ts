import { MQTT, MQTT_Connection_Options, Message } from "../lib/mqtt";

export class MQTTHandler {
    private _mqtt: MQTT
    private _mqtt_connection_options: MQTT_Connection_Options

    constructor() {
        //Create connection options for the MQTT
        this._mqtt_connection_options = {
            host: "test.mosquitto.org",
            port: 1883,
            username: "",
            password: "",
            useSSL: false,

            subscribtions: [],

            onMessageCallback: MQTTHandler.onMessage,
            onMessageCallbackExtra: this,

            client_id: "IOTT-Dashboard-" + String(new Date().getTime())
        }

        //Create MQTT instance
        this._mqtt = new MQTT(this._mqtt_connection_options)
    }

    static onMessage(msg: Message, extra: any) {

    }
}