import { dom } from "../dom/dom"
import { Router } from "../router"
import { Navbar } from "./navbar"
import { NavbarItem } from "./navbarItem"
import { SidebarItem } from "./sidebarItem"


export type SidebarData = {
    navitems: NavbarItem[]
    title: string
    title_color: string
    background_color: string
    navbar_color: string
    alignment?: string
}

export class Sidebar {
    private _Container: HTMLDivElement
    private _TargetContainer: HTMLDivElement
    private _Data: SidebarData
    private _router: Router

    get Router() {
        return this._router
    }

    get Content() {
        return this._Container
    }

    private _SidebarHeaderContainer: HTMLDivElement
    private _SidebarHeader: HTMLHeadingElement

    constructor(data: SidebarData, target_container: HTMLDivElement) {
        this._Data = data
        this._TargetContainer = target_container

        //Create top container
        this._Container = dom.div("offcanvas offcanvas-start show bg-text flex-grow-1")
        this._Container.style.position = "relative"

        //Create header
        this._SidebarHeaderContainer = dom.div("offcanvas header")

        
        //Nav
        const body = dom.div("offcanvas-body")
        body.style.backgroundColor = this._Data.background_color

        this._router = new Router({target_container: target_container})
        
        const nav = new Navbar({
            title: this._Data.title,
            title_color: this._Data.title_color,
            background_color: "",
            navbar_color: this._Data.navbar_color,
            vertical: true,
            alignemnt: this._Data.alignment,
            NavbarItems: this._Data.navitems
        }, this._router)

        body.appendChild(nav.Content)

        /*this.addNav(body)
        this.addNav(body)
        this.addNav(body)
        this.addNav(body)*/

        
        //body.appendChild(body)


        this._Container.appendChild(body)


        this._Container.appendChild(this._SidebarHeaderContainer)
    }


    public addNav(nav: HTMLElement) {
        const ul = dom.ul("navbar-nav justify-content-end flex-grow-1")
        const li = dom.li("nav-item")
        const a = dom.a("nav-link", "boi")

        li.appendChild(a)
        ul.appendChild(li)
        nav.appendChild(ul)
    }
}

