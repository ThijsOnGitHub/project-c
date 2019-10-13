import React from 'react'
import {Link} from "react-router-dom";

class Home extends React.Component{
    constructor(){
        super()
        this.state={
            uname:"",
            pass:""
        }
        this.handleInputChange=this.handleInputChange.bind(this)
    }


    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return(
            <div id="intro">
                <form>
                    <table>
                        <tbody>
                        <tr>
                            <td><input type="text" id="uname" name="uname" placeholder="Gebruikersnaam" value={this.state.uname} onChange={this.handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><input type="password" id="pass" name="pass" placeholder="Wachtwoord" value={this.state.pass} onChange={this.handleInputChange} /></td>
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