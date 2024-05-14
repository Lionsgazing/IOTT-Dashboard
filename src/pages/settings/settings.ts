type reload_method = {
    method: (appSettings: AppSettings, extra: any) => void
    extra: any
}


export class AppSettings {
    public Realtime: boolean
    public DataFetchHours: number
    public RefetchGraphData: boolean
    private _reload_methods: reload_method[]

    public ThresholdLabel: string
    public ThresholdFrom: number | string | undefined
    public ThresholdTo: number | string | undefined
    public ThresholdColor: string
    public ThresholdTarget: string

    constructor() {
        this._reload_methods = []

        //Set default values
        this.Realtime = true
        this.RefetchGraphData = true
        this.DataFetchHours = 1

        this.ThresholdLabel = "Threshold"
        this.ThresholdFrom = 25
        this.ThresholdTo = undefined
        this.ThresholdColor = "rgba(255,0,0,0.02)"
        this.ThresholdTarget = "temperature"
    }

    public TriggerReload() {
        for (const reload_method of this._reload_methods){
            reload_method.method(this, reload_method.extra)
        }
    }

    public SubscribeToReload(reload_method: (appSettings: AppSettings, extra: any) => void, extra: any) {
        this._reload_methods.push({method: reload_method, extra: extra})
    }
}