import { dom } from "../dom/dom"

export type NavbarItemData = {
    title: string
    title_active_color: string
    title_unactive_color: string
    href: string
}

export class NavbarItem {
    protected _NavbarItem: HTMLElement
    protected _NavbarItemBrand: HTMLElement

    private _callback?: (ev:Event, id:number, item: NavbarItem, nav: Navbar) => void
    private _callback_id?: number

    private _data: NavbarItemData

    get NavbarItem() {
        return this._NavbarItem
    }

    private _IsActive: boolean
    set IsActive(state: boolean) {
        this._IsActive = state
        if (state == false) {
            this._IsActive = false
            this._NavbarItemBrand.className = "nav-link"
            this._NavbarItemBrand.style.color = this._data.title_unactive_color
        }
        else {
            this._IsActive = true
            this._NavbarItemBrand.className = "nav-link active"
            this._NavbarItemBrand.style.color = this._data.title_active_color
        }
    }
    get IsActive() {
        return this._IsActive
    }

    constructor(data: NavbarItemData) {
        this._data = data

        this._IsActive = false

        this._NavbarItem = dom.li("nav-item")
        this._NavbarItemBrand = dom.a("nav-link", this._data.title, this._data.href)
        this._NavbarItemBrand.style.color = this._data.title_unactive_color

        this._NavbarItem.appendChild(this._NavbarItemBrand)
    }

    public SetOnClickCallback(callback: (ev: Event, id: number, item: NavbarItem, nav: Navbar) => void, id: number, nav: Navbar) {
        //Store
        this._callback = callback
        this._callback_id = id

        //Assign
        addEventListener("click", (ev: MouseEvent) => {
            console.log("HIIII")
            this._callback!(ev, this._callback_id!, this, nav)
        })
    }
}

export type NavbarData = {
    title: string,
    title_color: string,
    navbar_color: string

    NavbarItems: NavbarItem[]
}

export class Navbar {
    protected _Navbar: HTMLElement
    protected _NavbarContainer: HTMLDivElement
    protected _NavbarBrand: HTMLAnchorElement
    protected _NavbarItemContainer: HTMLUListElement

    private _data: NavbarData

    get Navbar() {
        return this._Navbar
    }

    constructor(data: NavbarData) {
        this._data = data

        //Create needed elements
        this._Navbar = dom.nav("navbar navbar-expand-lg bg-dark")
        this._NavbarContainer = dom.div("container-fluid")

        this._NavbarBrand = dom.a("navbar-brand", "Navbar")
        this._NavbarBrand.style.color = "#FFFFFF"

        //Create container for navbar items
        this._NavbarItemContainer = dom.ul("navbar-nav me-auto mb-2 mb-lg-0")
        
        for (let i = 0; i < this._data.NavbarItems.length; i++) {
            const Item = this._data.NavbarItems[i]
            this._NavbarItemContainer.appendChild(Item.NavbarItem)
            Item.SetOnClickCallback(Navbar.callback, i, this)

            if (i == 0) {
                Item.IsActive = true
            }
        }



        //Stich them together
        this._NavbarContainer.appendChild(this._NavbarBrand)
        this._NavbarContainer.appendChild(this._NavbarItemContainer)
        this._Navbar.appendChild(this._NavbarContainer)    


    }

    static callback(ev: Event, id: number, item: NavbarItem, nav: Navbar) {
        console.log(id)

        const Items = nav._data.NavbarItems
        
        //Set all items to being not active
        for (let i = 0; i < Items.length; i++) {
            const Item = Items[i]
            Item.IsActive = false
        }

        //Set the clicked one to be active.
        Items[id].IsActive = true
    }
}