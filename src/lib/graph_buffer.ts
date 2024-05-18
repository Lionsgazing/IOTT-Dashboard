export class graph_buffer {
    private _buffer: number[][]
    private _max_rows: number
    private _columns: number
    private _default_encoding: object

    private _x_column: number

    get buffer() {
        return this._buffer
    }

    get rows() {
        return this._buffer.length
    }

    get columns() {
        return this._columns
    }

    get default_encoding() {
        return this._default_encoding
    }

    constructor(x_column: number = 0, columns: number, max_rows: number | undefined = undefined) {
        this._x_column = x_column
        if (max_rows === undefined) {
            this._max_rows = -1
        }
        else {
            this._max_rows = max_rows
        }

        if (columns >= 0) {
            this._columns = columns
        }
        else {
            this._columns = 1
        }

        this._buffer = []

        //Create encoding
        let x: number[] = [x_column]
        let y: number[] = []
        for (let i = 0; i < this._columns; i++) {
            if (i !== x_column) {
                y.push(i)
            }
        }

        this._default_encoding = {
            x: x,
            y: y
        }
    }

    public average() {
        let average_sum: number[] = []
        for (let i_column = 0; i_column < this._columns - 1; i_column++) {
            average_sum.push(0)
        }

        for (let i_row = 0; i_row < this._buffer.length; i_row++) {
            for (let i_column = 0; i_column < this._buffer[i_row].length; i_column++) {
                if (i_column != this._x_column) {
                    average_sum[i_column] += this._buffer[i_row][i_column]
                }
            }
        }

        let average: number[] = []
        for (let i = 0; i < average_sum.length; i++) {
            average.push(average_sum[i] / this._buffer.length)
        }

        return average
    }

    public push(data: number[]) {
        if (data.length === this._columns) {
            if (this._buffer.length < this._max_rows)
                this._buffer.push(data)
            else
                this.rotate(data)
        }
        else {
            console.error("[GraphBuffer] Columns in given data does not match buffer columns!")
        }
    }

    public rotate(data: number[]) {
        if (data.length === this._columns) {
            this._buffer.shift()
            this._buffer.push(data)
        }
        else {
            console.error("[GraphBuffer] Columns in given data does not match buffer columns!")
        }
    }

    public replace(data: number[], index: number) {
        if (data.length === this._columns) {
            if (this._max_rows >= 0) {
                if (index >= 0 && index < this._buffer.length){
                    this._buffer[index] = data
                }
            }
        }
        else {
            console.error("[GraphBuffer] Columns in given data does not match buffer columns!")
        }
    }

    public replaceAll(data: number[][], timestamp_conversion: boolean = true) {
        this._buffer = structuredClone(data)

        if (timestamp_conversion) {
            for (let i = 0; i < this._buffer.length; i++) {

                let timestamp = this._buffer[i][this._x_column]
                if (timestamp % 1 != 0) {
                    timestamp = Math.floor(timestamp) * 1000
                }
                
                this._buffer[i][this._x_column] = timestamp
                
            }
        }
    }
}