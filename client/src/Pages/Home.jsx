import React from 'react'
import {Link} from "react-router-dom";

class Home extends React.Component{
    constructor(){
        super()
    }

    render() {
        return(
        <div id="intro">
            <table>
                <tbody>
                <tr>
                    <td>
                        <h1>Welkom bij</h1><img id="logo" src="https://i.imgur.com/QdRROLE.png"/>
                    </td>
                    <td><form>
                        <table>
                        <tbody>
                        <tr>
                            <td><input type="text" id="uname" name="uname" value="Gebruiksersnaam"/></td>
                        </tr>
                        <tr>
                            <td><input type="text" id="pass" name="pass" value="Wachtwoord"/>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td><a href="#">Wachtwoord vergeten</a></td>
                                        <td><img id="btnLogin" src="https://i.imgur.com/oPCJcCA.png"/></td>

                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </form></td>

                </tr>
                </tbody>
            </table>















        </div>
        )
    }

}
export default Home