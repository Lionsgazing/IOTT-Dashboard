import { graph_buffer } from "./graph_buffer"


export class Serie {
    private _id: string
    private _name: string
    private _type: string
    private _buffer: graph_buffer
    private _encoding: object
    private _sampling: string

    get ID() {
        return this._id
    }

    get Name() {
        return this._name
    }

    get Type() {
        return this._type
    }

    get Buffer() {
        return this._buffer
    }

    get Encoding() {
        return this._encoding
    }

    get Sampling() {
        return this._sampling
    }

    constructor(id: string, name: string, type: string, encoding: {x: number[], y: number[]}, sampling: string, max_rows: number | undefined = undefined) {
        this._id = id
        this._name = name
        this._type = type
        this._encoding = encoding
        this._sampling = sampling

        this._buffer = new graph_buffer(encoding.x[0], encoding.y.length + encoding.x.length, max_rows)
    }

    public toEcharts() {
        return {
            name: this._name,
            type: this._type,
            data: this._buffer.buffer,
            encode: this._encoding,
            sampling: this._sampling
        }
    }
}