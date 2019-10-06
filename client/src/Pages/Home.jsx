import React from 'react'
import {Link} from "react-router-dom";

class Home extends React.Component{
    constructor(){
        super()
    }

    render() {
        return(
        <div id="intro">
            <form>
            <table>
                <tbody>
                <tr>
                    <td><input type="text" id="uname" name="uname" value="Gebruikersnaam"/></td>
                </tr>
                <tr>
                    <td><input type="text" id="pass" name="pass" value="Wachtwoord"/></td>
                </tr>
                <tr>
                    <td><a href="#">Wachtwoord vergeten?</a></td>
                </tr>
                <tr>
                    <button>Inloggen</button>
                </tr>
                </tbody>
            </table>
            </form>
        </div>
        )
    }

}
export default Home