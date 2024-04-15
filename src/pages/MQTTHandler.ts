import { MQTT, MQTT_Connection_Options, Message } from "../lib/mqtt.ts";

export class MQTTHandler {
    private _mqtt: MQTT
    private _mqtt_connection_options: MQTT_Connection_Options
    private _subscribtions: string[]

    private _subscribtion_callbacks: (<T extends object>(payload: T, extra: any) => void)[]
    private _subscribtion_callbacks_extra: any[]

    constructor(subscribtions: string[], subscribtion_callbacks: (<T extends object>(payload: T, extra: any) => void)[], subscribtion_callbacks_extra: any[]) {
        //Create connection options for the MQTT
        this._mqtt_connection_options = {
            host: "127.0.0.1",
            port: 8883, //Websocket port on broker
            username: "",
            password: "",
            useSSL: false,

            subscribtions: subscribtions,

            onMessageCallback: MQTTHandler.onMessage,
            onMessageCallbackExtra: this,

            client_id: "IOTT_Dashboard-" + String(new Date().getTime())
        }

        //Store subscribtions for ease of use and their callbacks
        this._subscribtions = this._mqtt_connection_options.subscribtions
        this._subscribtion_callbacks = subscribtion_callbacks
        this._subscribtion_callbacks_extra = subscribtion_callbacks_extra

        //Ensure that there is as many subscribtions as there is subscribtion callbacks
        if (this._subscribtions.length == this._subscribtion_callbacks.length && this._subscribtion_callbacks.length == this._subscribtion_callbacks_extra.length) {
            //Create MQTT instance
            this._mqtt = new MQTT(this._mqtt_connection_options)
        }
        else {
            console.error("Subscribtions amount and callback amount does not match.")
        }
    }

    public publish(topic: string, payload: object, retained: boolean = false) {
        this._mqtt.publish(topic, payload, retained)
    }

    static onMessage(msg: Message, extra: any) {
        const mqtt_instance: MQTTHandler = extra
        const topic: string = msg.destinationName
        const json_payload: object = JSON.parse(msg.payloadString)

        switch (topic) {
            case mqtt_instance._subscribtions[0]: //Dashboard realtime datastream
                mqtt_instance._subscribtion_callbacks[0](json_payload, mqtt_instance._subscribtion_callbacks_extra[0])
                break

            case mqtt_instance._subscribtions[1]: //Status data
                mqtt_instance._subscribtion_callbacks[1](json_payload, mqtt_instance._subscribtion_callbacks_extra[1])
                break
        }
    }
}