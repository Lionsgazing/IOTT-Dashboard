type reload_method = {
    method: (extra: any) => void
    extra: any
}


export class AppSettings {
    public Realtime: boolean

    private _reload_methods: reload_method[]

    constructor() {
        this._reload_methods = []

        //Set default values
        this.Realtime = true
    }

    public TriggerReload() {
        for (const reload_method of this._reload_methods){
            reload_method.method(reload_method.extra)
        }
    }

    public SubscribeToReload(reload_method: (extra: any) => void, extra: any) {
        this._reload_methods.push({method: reload_method, extra: extra})
    }
}