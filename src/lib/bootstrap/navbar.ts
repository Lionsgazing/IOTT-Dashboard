import { dom } from "../dom/dom"
import { Router } from "../router"
import { NavbarItem } from "./navbarItem"
import { isColorHex } from "./color_identifier"

export type NavbarData = {
    title: string,
    title_color: string,
    navbar_color: string,
    background_color: string,
    vertical: boolean
    alignemnt?: string

    NavbarItems: NavbarItem[]
}

export class Navbar {
    //UI Elements
    protected _Navbar: HTMLElement
    protected _NavbarContainer: HTMLDivElement
    protected _NavbarBrand: HTMLAnchorElement

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
        if (this._data.vertical) {
            this._Navbar = dom.header("navbar navbar-expand-lg p-0")
        }
        else {
            this._Navbar = dom.header("navbar navbar-expand-lg")
        }
        
        if (isColorHex(this._data.background_color)) {
            this._Navbar.style.backgroundColor = this._data.background_color
        }
        else {
            this._Navbar.className += " " + this._data.background_color
        }

        this._NavbarBrand = dom.a("navbar-brand", this._data.title)

        if (isColorHex(this._data.title_color)) {
            this._NavbarBrand.style.color = this._data.title_color
        }
        else {
            this._NavbarBrand.className += " " + this._data.title_color
        }

        if (this._data.vertical) {
            //Create container
            this._NavbarContainer = dom.div("d-flex flex-column flex-grow-1")

            //Append brand
            this._NavbarContainer.appendChild(this._NavbarBrand)

            //Add NavbarItems
            const Items = this._data.NavbarItems
            for (let i = 0; i < this._data.NavbarItems.length; i++) {
                //Create container for navbar items
                const NavbarItemContainer = dom.ul("navbar-nav flex-grow-1")
                NavbarItemContainer.className += " " + this._data.alignemnt
                //Get NavbarItem and append it to the Navbar 
                const Item = Items[i]
                NavbarItemContainer.appendChild(Item.NavbarItem)
                this._NavbarContainer.appendChild(NavbarItemContainer)  

                //Add a route for this NavbarItem
                router.AddRoute({route: Item.RouteDestination, content: Item.RouteContent})

                //Setup the onclick functionality
                Item.SetOnClickCallback(Navbar.callback, i, this)
            }

            this._Navbar.appendChild(this._NavbarContainer)   
        }
        else {
            this._NavbarContainer = dom.div("container-fluid")
            this._NavbarContainer.appendChild(this._NavbarBrand)

            const NavbarItemContainer = dom.ul("navbar-nav me-auto mb-2 mb-lg-0")
            
            //Add NavbarItems
            const Items = this._data.NavbarItems
            for (let i = 0; i < this._data.NavbarItems.length; i++) {
                //Get NavbarItem and append it to the Navbar 
                const Item = Items[i]
                NavbarItemContainer.appendChild(Item.NavbarItem)

                //Add a route for this NavbarItem
                router.AddRoute({route: Item.RouteDestination, content: Item.RouteContent})

                //Setup the onclick functionality
                Item.SetOnClickCallback(Navbar.callback, i, this)
            }

            //Stich them together
            this._NavbarContainer.appendChild(NavbarItemContainer)
            this._Navbar.appendChild(this._NavbarContainer)    
        }
    }

    public setActive(route_destination: string) {
        const Items = this._data.NavbarItems

        //Set all to not being active first.
        for (let i = 0; i < Items.length; i++) {
            const Item = Items[i]
            if (Item.RouteDestination == route_destination) {
                Item.IsActive = true
            }
            else {
                Item.IsActive = false
            }
        }

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
        nav._router.Route(dest_url, item.UpdateURL)
    }
}