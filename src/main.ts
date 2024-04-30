import './scss/styles.scss'
import {dom} from './lib/dom/dom'
import {Navbar} from './lib/bootstrap/navbar'
import { NavbarItem } from './lib/bootstrap/navbarItem'
import {Router} from './lib/router'
import { DashboardPage } from './pages/dashboard/dashboard_page'
import { StatusPage } from './pages/status/status_page'
import { SettingsPage } from './pages/settings/settings_page'
import { MQTTHandler, SubscribtionsData } from './pages/MQTTHandler'
import { mqtt_debug } from './mqtt_debug'
import { DashboardConfig, MQTTConfig } from './config'

//Import config
import config from './config.json'
import { AppSettings } from './pages/settings/settings'
const mqtt_config: MQTTConfig = config.mqtt_config
const dashboard_config: DashboardConfig = config.dashboard_config


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

//Create settings object
const appSettings = new AppSettings()

//Create pages
const Dashboard = new DashboardPage(dashboard_config, appSettings)
const Status = new StatusPage(mqtt_config)
const Settings = new SettingsPage(appSettings)

//Derive subscribtions from mqtt_config
const subscribtionData: SubscribtionsData[] = []
for (const device of mqtt_config.devices) { 
    //Push data topics
    subscribtionData.push({
        subscribtions: [device.data_topic],
        callback: DashboardPage.onMqttMessage,
        callback_extra: [Dashboard, device.id]
    })

    //Push status topics
    if (device.status_topic !== "") {
        subscribtionData.push({
            subscribtions: [device.status_topic],
            callback: StatusPage.onMqttMessage,
            callback_extra: [Status, device.id]
        })
    }
}

//Setup MQTT handler and link it to the relevant modules/pages
console.log(subscribtionData)
const MQTTManager = new MQTTHandler(subscribtionData)

//Debug
const debug = new mqtt_debug(MQTTManager, 500, 0.1)
void debug.debug()

//Create navbar
// Note - Navbar creates routes dynamically when adding a NavbarItem.
const navbar = new Navbar({
    title: "IOTT-Dashboard",
    title_color: "#FFFFFF",
    background_color: "bg-dark",
    navbar_color: "",
    vertical: false,
    NavbarItems: [
        new NavbarItem({
            title: "Home", 
            active_color: "#FFFFFF", 
            unactive_color: "#6c757d", 
            route_destination: "/", 
            update_url: true,
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
            update_url: true,
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
            update_url: true,
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
