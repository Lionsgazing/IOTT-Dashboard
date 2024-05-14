import * as paho_mqtt from "paho-mqtt"

export type Message = paho_mqtt.Message

export type MQTT_Connection_Options = {
    host: string,
    port: number,
    username: string,
    password: string,
    useSSL: boolean

    client_id?: string,
    lastWill?: Message
}

export type MQTT_Subscription_Options = {
    subscribtions: string[]
    onMessageCallback: (msg: Message, extra: any) => void
    onMessageCallbackExtra: any
}

export class MQTT {   
    //MQTT Options
    private _connection_options: MQTT_Connection_Options
    private _subscription_options: MQTT_Subscription_Options

    //Client ID
    private _client_id: string

    //Flags
    private _isConnected: boolean

    //Client
    private _client: paho_mqtt.Client

    get isReady() {
        return this._isConnected
    }

    constructor(connection_options: MQTT_Connection_Options, subscribtion_options: MQTT_Subscription_Options) {
        //Store given parameters
        this._connection_options = connection_options
        this._subscription_options = subscribtion_options

        //Get client id
        this._client_id = this._connection_options.client_id!

        if (this._client_id === undefined) {
            this._client_id = "IOTT_Dashboard_" + String(new Date().getTime())
        }

        //Set default flag states
        this._isConnected = false

        //Setup mqtt client
        this._client = new paho_mqtt.Client(this._connection_options.host, this._connection_options.port, "client_id")

        //Create mqtt client options.
        const mqtt_client_options: paho_mqtt.ConnectionOptions = {
            userName: this._connection_options.username,
            password: this._connection_options.password,
            useSSL: this._connection_options.useSSL,
            reconnect: true,

            onSuccess: () => {
                console.info("[MQTT] Successfully connected to MQTT-broker: " + this._connection_options.host + ":" + this._connection_options.port)

                //Subscribe to the given topics.
                for (const subscribtion of this._subscription_options.subscribtions) {
                    this._client.subscribe(subscribtion)
                }

                //Setup message callbacks
                this._client.onMessageArrived = (msg) => {
                    this._subscription_options.onMessageCallback(msg, this._subscription_options.onMessageCallbackExtra)
                }

                //Set isConnected state
                this._isConnected = true
            },
            onFailure: () => {
                console.error("[MQTT] Failed to connect to MQTT-broker: " + this._connection_options.host + ":" + this._connection_options.port)

                //Set isConnected state
                this._isConnected = false
            }
        } 

        //Setup onConnectionLost handling
        this._client.onConnectionLost = () => {
            console.error("[MQTT] Lost connection to MQTT-broker: " + this._connection_options.host + ":" + this._connection_options.port)
        }

        //Check if there is a lastWill attached.
        if (this._connection_options.lastWill !== undefined) {
            mqtt_client_options.willMessage = this._connection_options.lastWill
        }

        //Connect to MQTT broker
        this._client.connect(mqtt_client_options)
    }

    public publish(topic: string, payload: object, retained: boolean = false, qos: paho_mqtt.Qos = 0) {
        if (!this._isConnected) {
            console.error("[MQTT] MQTT instance not connected to a MQTT-broker!")
            return
        }

        //Convert payload object to string and send
        const payload_str = JSON.stringify(payload)
        this._client.send(topic, payload_str, qos, retained)
    }
}

