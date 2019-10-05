import React from 'react'
import {Link} from "react-router-dom";
import Logo from "../Logo";

class Menu extends React.Component{
    constructor(){
        super()
    }

    render() {
        return(
            <div>
                <Logo style={{width:350,padding:25}}/>
                <Link to={'/'} >Home</Link>
                <br/>
                <Link to={"/DataTest"}>DataTest</Link>
                <br/>
                <Link to={"/Rooster"}>Rooster</Link>
                <p>Dit is het Menu</p>
            </div>
        )
    }
}
export default Menu