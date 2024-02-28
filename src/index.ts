import {dom} from './dom/dom'
import {Button} from './bootstrap/button'
import { Input } from './bootstrap/input'
import { Textbox } from './bootstrap/textbox'
import { Select } from './bootstrap/select'

const top_container = dom.div("container-fluid")

const navbar_row = dom.div("row")
const navbar_content_area = dom.div("col-24",[dom.h1("Navbar")])

const graph_row = dom.div("row")
const graph_content_area = dom.div("col-24", [dom.h1("Graph")])

//Do layout
navbar_row.appendChild(navbar_content_area)
graph_row.appendChild(graph_content_area)

top_container.appendChild(navbar_row)
top_container.appendChild(graph_row)

document.body.appendChild(top_container)





/*const b1 = new Button({content: "boi", colorPrefix: "primary", type: "button", outline: true, onclick: callback})
container.appendChild(b1.button)

const i1 = new Textbox({placeholder: "Honk", padding: {top: '5'}, margin: {start: "5", top: '3'}})
container.appendChild(i1.Textbox)

const s1 = new Select({})
container.appendChild(s1.Select)
s1.set_options(["s1", "s2"])
s1.set_options(["b1", "b2", "b3"])


function callback(button_element: HTMLButtonElement, extra?: any[]) {
    console.log("hi")
}*/