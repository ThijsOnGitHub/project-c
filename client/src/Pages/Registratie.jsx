import React from 'react';
import {Link} from "react-router-dom";
var API_LINK='http://localhost:5000/api';

class Registratie extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            // Globale variabelen.
            firstName: '',
            lastName: '',
            email: '',
            pass: '',
            phone: '',
            birth: '',
            img_link: '',
            isWerkgever: '',
            errormessage: ''
        };
        // Lijst om uit te lezen voor het POST request.
        this.lijst=["firstName","lastName","email","pass","phone","birth","img_link", "isWerkgever"];
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Controlleer of de waarden in een veld wel verstuurd kunnen worden.
    canBeSubmitted() {
        const {firstName, lastName, email, pass, phone, birth, img_link} = this.state;
        return (
            firstName.length > 0 &&
            lastName.length > 0 &&
            email.length > 0 &&
            pass.length > 0 &&
            phone.length > 0 &&
            birth.length > 0 &&
            img_link.length > 0
        )
    }

    // Converteer de waarden uit de state naar een JSON string om die in een POST request te plaatsen en te versturen.
    handleSubmit(event) {
        // Laat de data niet verstuurd worden wanneer de input validatie niet succesvol is.
        if (!this.canBeSubmitted()) {
            event.preventDefault();
            return;
        }

        var object={};
        this.lijst.forEach((value)=>{
            object[value]=this.state[value]
        });
        console.log("sending");
        console.log(object);
        fetch(API_LINK+"/addgebruiker",{method:"POST",
            body:JSON.stringify(object),
            headers:{
                "content-type":"application/json"
            }}).then((value)=>{
            value.json().then(value1 => {console.log(value1.message)})
        });
    }

    // Ververs de waarden wanneer deze veranderd worden door de gebruiker.
    handleInputChange(event) {
        const target = event.target;
        // Laat de waarde de waarde zijn van het actieve veld. Als het input-type een checkbox is is de waarde of deze aangevinkt is of niet.
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    // Verzamel de inputs van de gebruiker om die in de state op te slaan.
    render() {
        const isEnabled =  this.canBeSubmitted();
        return(
        <div id="reg">
            <form>
            <table>
                <tbody>
                <tr>
                    <label>Voornaam</label>
                    <td><input type='text' name="firstName" value={this.state.firstName} placeholder="Voornaam" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Achternaam</label>
                    <td><input type='text' name="lastName" value={this.state.lastName} placeholder="Achternaam" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Email</label>
                    <td><input type='email' name="email" value={this.state.email} placeholder="Email" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Telefoonnummer</label>
                    <td><input type='text' name="phone" value={this.state.phone} placeholder="Telefoonnummer" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Geboortedatum</label>
                    <td><input type='date' name="birth" value={this.state.birth} placeholder="Geboortedatum" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>URL gebruikersafbeelding</label>
                    <td><input type='text' name="img_link" value={this.state.img_link} placeholder="URL gebruikersafbeelding" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Wachtwoord</label>
                    <td><input type='password' name="pass" value={this.state.pass} placeholder="Wachtwoord" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Account voor werkgever</label>
                    <td><input type='checkbox' name="isWerkgever" value={this.state.isWerkgever} placeholder="false" onChange={this.handleInputChange}/></td>
                </tr>
                <button disabled={!isEnabled} onClick={this.handleSubmit}>Registreer</button>
                </tbody>
            </table>
            </form>
        </div>
        )
    }
}
export default Registratie