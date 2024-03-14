import { dom } from "../dom/dom"
import { Router } from "../router"
import { NavbarItem } from "./navbarItem"
import { isColorHex } from "./color_identifier"

export type NavbarData = {
    title: string,
    title_color: string,
    navbar_color: string

    NavbarItems: NavbarItem[]
}

export class Navbar {
    //UI Elements
    protected _Navbar: HTMLElement
    protected _NavbarContainer: HTMLDivElement
    protected _NavbarBrand: HTMLAnchorElement
    protected _NavbarItemContainer: HTMLUListElement

    //Data & Router
    private _data: NavbarData
    private _router: Router

    //Navbar content
    get Content() {
        return this._Navbar
    }

    constructor(data: NavbarData, router: Router) {
        this._data = data
        this._router = router

        //Create needed elements
        this._Navbar = dom.header("navbar navbar-expand-lg bg-dark")
        this._NavbarContainer = dom.div("container-fluid")

        this._NavbarBrand = dom.a("navbar-brand", this._data.title)

        if (isColorHex(this._data.title_color)) {
            this._NavbarBrand.style.color = this._data.title_color
        }
        else {
            this._NavbarBrand.className += " " + this._data.title_color
        }

        //Create container for navbar items
        this._NavbarItemContainer = dom.ul("navbar-nav me-auto mb-2 mb-lg-0")
        
        //Add NavbarItems
        const Items = this._data.NavbarItems
        for (let i = 0; i < this._data.NavbarItems.length; i++) {
            //Get NavbarItem and append it to the Navbar 
            const Item = Items[i]
            this._NavbarItemContainer.appendChild(Item.NavbarItem)

            //Add a route for this NavbarItem
            router.AddRoute({route: Item.RouteDestination, content: Item.RouteContent})

            //Setup the onclick functionality
            Item.SetOnClickCallback(Navbar.callback, i, this)
        }

        //Stich them together
        this._NavbarContainer.appendChild(this._NavbarBrand)
        this._NavbarContainer.appendChild(this._NavbarItemContainer)
        this._Navbar.appendChild(this._NavbarContainer)    
    }

    static callback(ev: Event, id: number, item: NavbarItem, nav: Navbar) {
        //Get items
        const Items = nav._data.NavbarItems
        
        //Set all items to being not active
        for (let i = 0; i < Items.length; i++) {
            const Item = Items[i]
            Item.IsActive = false
        }

        //Set the clicked one to be active.
        Items[id].IsActive = true

        //Determine the destination url
        const base_url = window.location.origin
        const dest_url = base_url + Items[id].RouteDestination

        //Use router to route to that url
        nav._router.Route(dest_url)
    }
}