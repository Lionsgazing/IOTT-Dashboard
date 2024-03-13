export function isColorHex(color: string) {
    if (color.length >= 1) {
        if (color[0] == '#') {
            return true //Is Hex
        }
        else {
            return false //Is not Hex
        }
    }
    else {
        return false //Is not Hex (Nothing)
    }

}