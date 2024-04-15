
export class Serie {
    private _name: string
    private _type: string
    private _data: number[][]
    private _encoding: object
    private _sampling: string

    get Name() {
        return this._name
    }

    get Type() {
        return this._type
    }

    get Data() {
        return this._data
    }

    get Encoding() {
        return this._encoding
    }

    get Sampling() {
        return this._sampling
    }

    constructor(name: string, type: string, data: number[][], encoding: object, sampling: string) {
        this._name = name
        this._type = type
        this._data = data
        this._encoding = encoding
        this._sampling = sampling
    }

    public toEcharts() {
        return {
            name: this._name,
            type: this._type,
            data: this._data,
            encode: this._encoding,
            sampling: this._sampling
        }
    }
}