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

    export function nav(className: string) {
        const nav = document.createElement("nav")
        nav.className = className
        return nav
    }

    export function a(className: string, textContent?: string, href?: string) {
        const a = document.createElement("a")
        a.className = className
        a.textContent = textContent!
        
        if (href !== undefined) {
            a.href = href
        }

        return a
    }

    export function li(className: string) {
        const li = document.createElement("li")
        li.className = className
        return li
    }

    export function ul(className: string) {
        const ul = document.createElement("ul")
        ul.className = className
        return ul
    }
    
    export function header(className: string) {
        const header = document.createElement("header")
        header.className = className
        return header
    }

    export function hr() {
        const hr = document.createElement("hr")
        return hr
    }

    export function span() {
        const span = document.createElement("span")
        return span
    }

    export function label(className: string, content: string) {
        const label = document.createElement("label")
        label.className = className
        label.textContent = content
        return label
    }
}