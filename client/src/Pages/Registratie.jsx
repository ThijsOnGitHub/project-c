import React from 'react'
import {Link} from "react-router-dom";

class Registratie extends React.Component{
    constructor(){
        super()
    }

    render() {
        return(
            <div>
                <p>Registratie</p>
                <br/>
                <p>Voornaam</p>
                <br/>
                <p>Achternaam</p>
                <br/>
                <p>Email</p>
                <br/>
                <p>Telefoonnummer</p>
                <br/>
                <p>Geboortedatum</p>
                <br/>
                <p>Wachtwoord</p>
                <br/>
            </div>
        )
    }
}
export default Registratie