import * as paho_mqtt from "paho-mqtt"

export type Message = paho_mqtt.Message

export type MQTT_Connection_Options = {
    host: string,
    port: number,
    useSSL: boolean

    subscribtions: string[]
    onMessageCallback: (msg: Message, extra: any) => void
    onMessageCallbackExtra: any

    username: string,
    password: string,

    lastWill?: Message

    client_id: string,
}

export class MQTT {
    private _client: paho_mqtt.Client
    private _connection_opts: MQTT_Connection_Options

    //Flags
    private _isConnected: boolean

    constructor(connection_opts: MQTT_Connection_Options) {
        this._connection_opts = connection_opts

        //Set default flag states
        this._isConnected = false

        //Setup client
        this._client = new paho_mqtt.Client(this._connection_opts.host, this._connection_opts.port, this._connection_opts.client_id)
        
        //Connect
        this._client.connect({
            userName: this._connection_opts.username,
            password: this._connection_opts.password,
            useSSL: this._connection_opts.useSSL,
            willMessage: this._connection_opts.lastWill,
            reconnect: true,
            onSuccess: (o) => {
                console.log("Successfully connected to MQTT-broker: " + this._connection_opts.host + ":" + this._connection_opts.port)

                //Subscribe to the given topics.
                for (const subscribtion of this._connection_opts.subscribtions) {
                    this._client.subscribe(subscribtion)
                }

                //Setup message callbacks
                this._client.onMessageArrived = (msg) => {
                    this._connection_opts.onMessageCallback(msg, this._connection_opts.onMessageCallbackExtra)
                }

                //Set isConnected state
                this._isConnected = true
            },
            onFailure: (o) => {
                console.error("Failed to connect to MQTT-broker: " + this._connection_opts.host + ":" + this._connection_opts.port)

                //Set isConnected state
                this._isConnected = false
            }
        })
    }

    public publish(topic: string, payload: object, retained: boolean) {
        if (!this._isConnected) {
            console.error("MQTT instance not connected to a MQTT-broker!")
            return
        }

        const payload_str = JSON.stringify(payload)
        
        this._client.send(topic, payload_str, undefined, retained)
    }
}

