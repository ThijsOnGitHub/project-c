import React from 'react'
import {Link} from "react-router-dom";

class Menu extends React.Component{
    constructor(){
        super()
    }

    render() {
        return(

            <div class="menu">
                <ul>
                    <li><img id='logo' src="https://i.imgur.com/HVmQHos.png"/></li>
                    <li><Link to={'/'} className="active">Home</Link></li>
                    <li><Link to={'/'} >Registreren</Link></li>
                    <li><Link to={"/DataTest"}>Contact</Link></li>
                </ul>
            </div>

        )
    }
}
export default Menu