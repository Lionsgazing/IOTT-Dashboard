//Imports
import './scss/styles.scss'
import { dom } from './lib/dom/dom'
import { Navbar } from './lib/bootstrap/navbar'
import { NavbarItem } from './lib/bootstrap/navbarItem'
import { Router } from './lib/router'
import { DashboardPage } from './pages/dashboard/dashboard_page'
import { StatusPage } from './pages/status/status_page'
import { SettingsPage } from './pages/settings/settings_page'
import { MQTTHandler, SubscribtionsData } from './pages/MQTTHandler'
import { DashboardConfig, MQTTConfig } from './config/config'
import { AppSettings } from './pages/settings/settings'

// --Import config--
import config from './config/config.json'
import { Spinner } from './lib/bootstrap/spinner'
const mqtt_config: MQTTConfig = config.mqtt_config
const dashboard_config: DashboardConfig = config.dashboard_config

// --Modification to document body--
document.body.className = "d-flex flex-column"
document.body.style.height = "100%" //Height can be inherited to the children from here

// --Container setup--
const top_container = dom.div("d-flex flex-grow-1")

// --Create AppSettings object--
const appSettings = new AppSettings() //Used for handling settings in the application

// --Create Threshold warning--
const ThresholdWarning = new Spinner({Text: "Threshold", TextColor: "#dc3545", SpinnerColor: "#dc3545", ContainerClassExtra: "pe-4", SpinnerTextClassExtra: "pe-2"})


// --Create the avaliable main pages--
const Dashboard = new DashboardPage(dashboard_config, appSettings, ThresholdWarning, "temperature")
const Status = new StatusPage(mqtt_config)
const Settings = new SettingsPage(appSettings)

// --Create SubscribtionsData from given mqtt_config--
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

// --Setup MQTTManager--
const MQTTManager = new MQTTHandler(mqtt_config.broker, subscribtionData)

// --Create custom Router--
const router = new Router({
    target_container: top_container
})

// --Create navbar--
// Navbar handles the navbar of course but also uses the router to show the different contents when pressing a NavbarItem.
// When a NavbarItem is pressed the resulting pages setup runs and the content of the page gets displayed in the routers given target container.
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
    ],
    ExtraContent: {
        content: ThresholdWarning.Content
    }

}, router)

// --Structure body--
document.body.appendChild(navbar.Content) //Append navbar first so its at the top.
document.body.appendChild(top_container) //Append the top_container after which is where our page content is going to be shown.

// --Do routing--
// Route the the current document URL.
// Triggers on of the known routes which in this case is the different NavbarItem pages.
if (!router.Route(document.URL)) {
    throw Error("404 Page not found...")
}

console.info("[Main] Routing done")