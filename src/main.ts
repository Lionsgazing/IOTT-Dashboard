import './scss/styles.scss'
import * as echarts from 'echarts'
import {dom} from './lib/dom/dom'
import {Navbar, NavbarItem} from './lib/bootstrap/navbar'
import {Router, RouterConfig, Route} from './lib/router'


// Setup content that is shared between all routes
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

//Setup router
const router = new Router({
    routes: [
        {route: "/", content: dom.h1("/")},
        {route: "/Status", content: dom.h1("/Status")},
        {route: "/Settings", content: dom.h1("/Settings")}
    ],
    target_container: top_container
})

//Do routing
console.log(document.URL)
if (!router.Route(document.URL)) {
    throw Error("404 Not found...")
}