import './scss/styles.scss'
import * as echarts from 'echarts'
import {dom} from './lib/dom/dom'
import {Navbar, NavbarItem} from './lib/bootstrap/navbar'

const top_container = dom.div("fluid-container")

const navbar = new Navbar({
    title: "Navbar",
    title_color: "#FFFFFF",
    navbar_color: "",
    NavbarItems: [
        new NavbarItem({title: "Home", title_active_color: "#FFFFFF", title_unactive_color: "#adb5bd", href: "/"}),
        new NavbarItem({title: "Status", title_active_color: "#FFFFFF", title_unactive_color: "#adb5bd", href: "/Status"}),
        new NavbarItem({title: "Settings", title_active_color: "#FFFFFF", title_unactive_color: "#adb5bd", href: "/Settings"})
    ]

})
top_container.appendChild(navbar.Navbar)


document.body.appendChild(top_container)