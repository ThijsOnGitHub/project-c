import React from 'react'
import {Link} from "react-router-dom";
var API_LINK='http://localhost:5000/api';


class Home extends React.Component{
    constructor(props){
        super(props);
        this.state={
            email:"",
            pass:""
        };
        this.lijst=["email", "pass"];
        this.handleInputChange=this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        var object={};
        this.lijst.forEach((value)=>{
            object[value]=this.state[value]
        });
        console.log("sending");
        console.log(object);
        fetch(API_LINK+"/gebruiker",{method:"POST",
            body:JSON.stringify(object),
            headers:{
                "content-type":"application/json"
            }}).then((value)=>{
            value.json().then(value1 => {console.log(value1.message)})
        });
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
                            <td><input type="text" id="email" name="email" placeholder="Gebruikersnaam" value={this.state.uname} onChange={this.handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><input type="password" id="pass" name="pass" placeholder="Wachtwoord" value={this.state.pass} onChange={this.handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><a href="#">Wachtwoord vergeten?</a></td>
                        </tr>
                        <tr>
                            <button onClick={this.handleSubmit}>Inloggen</button>
                        </tr>
                        </tbody>

                    </table>
                </form>
            </div>
        )
    }

}
export default Home