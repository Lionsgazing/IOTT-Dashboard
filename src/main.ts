import './scss/styles.scss'
import {dom} from './lib/dom/dom'
import {Navbar} from './lib/bootstrap/navbar'
import { NavbarItem } from './lib/bootstrap/navbarItem'
import {Router} from './lib/router'
import { DashboardPage } from './pages/dashboard_page'

import * as csvParse from 'csv-parse'

const parser = csvParse.parse({delimiter: ";"}, (err, data) => {
    console.log(data)
})

fs.

// Setup content that is shared between all routes

//Setup body with flex
document.body.className = "d-flex flex-column"
document.body.style.height = "100%" //Height can be inherited to the children from here
//Note that we need to set the HTML documents style height to 100% also. This is done in the raw index.html file.

//Setup needed containers with flex
const top_container = dom.div("d-flex flex-grow-1")


//Setup router
const router = new Router({
    target_container: top_container
})

//Create pages
const Dashboard = new DashboardPage()

//Create navbar
// Note - Navbar creates routes dynamically when adding a NavbarItem.
const navbar = new Navbar({
    title: "IOTT-Dashboard",
    title_color: "#FFFFFF",
    navbar_color: "",
    NavbarItems: [
        new NavbarItem({
            title: "Home", 
            active_color: "#FFFFFF", 
            unactive_color: "#6c757d", 
            route_destination: "/", 
            route_content: async () => {
                await Dashboard.Setup()
                return Dashboard.Content
            }
        }),
        new NavbarItem({
            title: "Status", 
            active_color: "#FFFFFF", 
            unactive_color: "#6c757d", 
            route_destination: "/Status", 
            route_content: async () => {
                return dom.h1("/Status")
            }
        }),
        new NavbarItem({
            title: "Settings", 
            active_color: "#FFFFFF", 
            unactive_color: "#6c757d", 
            route_destination: "/Settings", 
            route_content: async () => {
                return dom.h1("/Settings")
            }
        })
    ]

}, router)

// Append content to main body
document.body.appendChild(navbar.Content)
document.body.appendChild(top_container)

//Do routing
if (!router.Route(document.URL)) {
    throw Error("404 Page not found...")
}