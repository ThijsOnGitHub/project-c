import React from 'react'
import {Link} from "react-router-dom";

class Menu extends React.Component{
    constructor(){
        super()
    }

    render() {
        return(
            <div class="top-menu">
                <h1><i>RoosterIT</i></h1>
                <nav>
                <Link to={'/'} >Home</Link>
                <Link to={'/'} >Inloggen</Link>
                <Link to={'/'} >Mijn account</Link>
                <Link to={"/DataTest"}>Contact</Link>
                </nav>
            </div>

        )
    }
}
export default Menu