import { Navbar } from "./navbar"
import { dom } from "../dom/dom"
import { isColorHex } from "./color_identifier"

export type NavbarItemConfig = {
    title: string
    active_color: string
    unactive_color: string

    route_destination: string
    update_url: boolean
    route_content: () => Promise<HTMLElement>
    reset?: () => void
}

export class NavbarItem {
    //UI Elements
    protected _NavbarItem: HTMLElement
    protected _NavbarItemBrand: HTMLElement

    //Callback
    private _callback?: (ev:Event, id:number, item: NavbarItem, nav: Navbar) => void
    private _callback_id?: number

    //Define config storage
    private _config: NavbarItemConfig

    //Define flags
    private _IsActive: boolean

    //Setup readonly parameters
    get NavbarItem() {
        return this._NavbarItem
    }

    get RouteDestination() {
        return this._config.route_destination
    }

    get UpdateURL() {
        return this._config.update_url
    }

    get RouteContent() {
        return this._config.route_content
    }

    get IsActive() {
        return this._IsActive
    }

    //Setup special setter
    set IsActive(state: boolean) {
        this._IsActive = state
        if (state == false) {
            this._IsActive = false
            this._NavbarItemBrand.className = "nav-link"

            if (isColorHex(this._config.unactive_color)) {
                this._NavbarItemBrand.style.color = this._config.unactive_color
            }
            else {
                this._NavbarItemBrand.className += + " " + this._config.unactive_color
            }
        }
        else {
            this._IsActive = true
            this._NavbarItemBrand.className = "nav-link active"

            if (isColorHex(this._config.active_color)) {
                this._NavbarItemBrand.style.color = this._config.active_color
            }
            else {
                this._NavbarItemBrand.className += " " + this._config.active_color
            }
        }
    }

    constructor(config: NavbarItemConfig) {
        //Save config
        this._config = config

        //Default IsActive state
        this._IsActive = false

        //Create UI Elemetns
        this._NavbarItem = dom.li("nav-item")
        this._NavbarItemBrand = dom.a("nav-link", this._config.title)
        this._NavbarItemBrand.style.cursor = "pointer" //Set correct cursor type

        //Determine state based on URL
        const base_url = window.location.origin
        const dest_url = base_url + this._config.route_destination
        if (dest_url == document.URL) {
            this.IsActive = true
        }
        else {
            this.IsActive = false
        }

        //Add UI Elements to NavbarItem
        this._NavbarItem.appendChild(this._NavbarItemBrand)
    }

    public SetOnClickCallback(callback: (ev: Event, id: number, item: NavbarItem, nav: Navbar) => void, id: number, nav: Navbar) {
        //Store
        this._callback = callback
        this._callback_id = id

        //Assign
        this._NavbarItemBrand.onclick = (ev: Event) => {
            //ev.preventDefault() Prevents the normal HREF behaviour. Might be usefull later!
            this._callback!(ev, this._callback_id!, this, nav)
        }
    }
}