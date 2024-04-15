import './scss/styles.scss'
import {dom} from './lib/dom/dom'
import {Navbar} from './lib/bootstrap/navbar'
import { NavbarItem } from './lib/bootstrap/navbarItem'
import {Router} from './lib/router'
import { DashboardPage } from './pages/dashboard/dashboard_page'
import { StatusPage } from './pages/status/status_page'
import { SettingsPage } from './pages/settings/settings_page'
import { MQTTHandler } from './pages/MQTTHandler'
import { mqtt_debug } from './mqtt_debug'

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
const Status = new StatusPage()
const Settings = new SettingsPage()

//Setup MQTT handler and link it to the relevant modules/pages
const MQTTManager = new MQTTHandler(
    ["IOTT/Data", "IOTT/Status/#"], 
    [DashboardPage.onMqttMessage, StatusPage.onMqttMessage], 
    [Dashboard, Settings]
)

//Debug
const debug = new mqtt_debug(MQTTManager, 500, 0.1)
void debug.debug()


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
                await Status.Setup()
                return Status.Content
            }
        }),
        new NavbarItem({
            title: "Settings", 
            active_color: "#FFFFFF", 
            unactive_color: "#6c757d", 
            route_destination: "/Settings", 
            route_content: async () => {
                await Settings.Setup()
                return Settings.Content
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