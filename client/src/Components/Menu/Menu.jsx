import React from 'react'
import {Link} from "react-router-dom";


class Menu extends React.Component{
    constructor(){
        super()
    }

    render() {
        return(
            <div>
                <Link to={'/'} >Home</Link>
                <br/>
                <Link to={"/DataTest"}>DataTest</Link>
                <br/>
                <Link to={"Login/"}>Login</Link>
                <br/>



            </div>
        )
    }
}
export default Menu