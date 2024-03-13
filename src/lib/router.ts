import { dom } from "./dom/dom"

export type Route = {
    route: string,
    content: () => Promise<HTMLElement>,
}

export type RouterConfig = {
    target_container: HTMLElement
    routes?: Route[]
}

export class Router {
    private _config: RouterConfig

    private _404_not_found_content: HTMLElement

    constructor(config: RouterConfig) {
        this._config = config
        this._404_not_found_content = dom.h1("404 Not found...")

        if (this._config.routes === undefined) {
            this._config.routes = [] //No routes
        }
    }

    public async Route(route_addr: string) {
        const Routes = this._config.routes!
        
        //Find a matching route
        for (const Route of Routes) {
            //Get base address and find destination url
            const base_url = window.location.origin
            const dest_url = base_url + Route.route

            if (dest_url == route_addr) {
                //Update URL without page reload
                window.history.replaceState("", "", dest_url) 

                //Get the target container
                const target_container = this._config.target_container

                //Remove all current children elements from the target_container
                while (target_container.firstChild) {
                    target_container.removeChild(target_container.firstChild)
                }

                //Append the new content to the target_container
                target_container.appendChild(await Route.content())

                return true //Route found
            }
        }

        document.body.innerHTML = ""
        document.body.append(this._404_not_found_content)
        return false //Route not found
    }

    public AddRoute(route: Route) {
        this._config.routes!.push(route)
    }
}