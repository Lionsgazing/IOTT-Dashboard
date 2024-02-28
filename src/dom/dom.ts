export namespace dom {
    export function div(className: string, content?: Node[]) {
        const div = document.createElement("div",)
        div.className = className

        if (content !== undefined) {
            for (let i = 0; i < content.length; i++) {
                div.appendChild(content[i])
            }
        }
 
        return div;
    }

    export function button(className: string) {
        const button = document.createElement("button")
        button.className = className

        return button
    }

    export function input(className: string) {
        const input = document.createElement("input")
        input.className = className

        return input
    }

    export function select(className: string) {
        const select = document.createElement("select")
        select.className = className

        return select
    }
    
    export function option() {
        const option = document.createElement("option")
        return option
    }

    export function h1(content: string) {
        const option = document.createElement("h1")
        option.textContent = content
        return option
    }

    export function h2(content: string) {
        const option = document.createElement("h2")
        option.textContent = content
        return option
    }

    export function h3(content: string) {
        const option = document.createElement("h3")
        option.textContent = content
        return option
    }

    export function h4(content: string) {
        const option = document.createElement("h4")
        option.textContent = content
        return option
    }

    export function h5(content: string) {
        const option = document.createElement("h5")
        option.textContent = content
        return option
    }

    export function h6(content: string) {
        const option = document.createElement("h6")
        option.textContent = content
        return option
    }
}