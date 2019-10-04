import React from 'react'
import {Link} from "react-router-dom";

class Menu extends React.Component{
    constructor(){
        super()
    }

    render() {
        return(
            <div class="top-header">
                <h1>RoosterIT</h1>
                <Link to={'/'} >Home</Link>
                <Link to={"/DataTest"}>DataTest</Link>
            </div>
        )
    }
}
export default Menu