import React from 'react'
import MenuItem from "./MenuItem";


interface IProps {
    loggedIn:boolean
    logoutFunction:()=>void
}

class Menu extends React.Component <IProps>{

    render() {
        return(
            <div className="menu">
                <ul>
                    <li><img id='logo' src="https://i.imgur.com/HVmQHos.png" alt="Logo RoosterIT"/></li>
                    <MenuItem tekst={this.props.loggedIn?"Home":"Inloggen"} path={"/"}/>
                {
                    this.props.loggedIn?
                        <div>
                            <MenuItem tekst={"Mijn Account"} path={"/MyAccount"}/>
                            <MenuItem  path={"/Rooster"} tekst={"Rooster"}/>
                            <li ><a onClick={this.props.logoutFunction}>Uitloggen</a></li>
                        </div>:
                        <div>
                            <MenuItem tekst={"Registeren"} path={'/Registratie'}/>.
                        </div>

                }
                </ul>
            </div>
        )
    }
}
export default Menu