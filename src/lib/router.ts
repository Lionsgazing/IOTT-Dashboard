import { dom } from "./dom/dom"

export type Route = {
    route: string,
    content: HTMLElement,
}

export type RouterConfig = {
    routes: Route[]
    target_container: HTMLElement

}


export class Router {
    private _config: RouterConfig

    private _404_not_found_content: HTMLElement

    constructor(config: RouterConfig) {
        this._config = config

        this._404_not_found_content = dom.h1("404 Not found...")
    }

    public Route(route_addr: string) {
        const Routes = this._config.routes
        

        //Find a matching route
        for (const Route of Routes) {
            //Get base address
            let base_addr = document.baseURI.substring(0, document.baseURI.length - Route.route.length)

            if (base_addr + Route.route == route_addr) {
                this._config.target_container.appendChild(Route.content)
                return true //Route found
            }
        }

        document.body.append(this._404_not_found_content)
        return false //Route not found
    }
}