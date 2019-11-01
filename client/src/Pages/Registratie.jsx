import React from 'react';
import {Link} from "react-router-dom";

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
            isWerkgever: false,
            // Beschrijf de toegestane symbolen voor de inputvelden.
            letters: /^[A-Za-z]+$/,
            numbers: /^[0-9]+$/,
            // Sla op of inputvelden al zijn aangeraakt door de gebruiker.
            touched: {
                firstName: false,
                lastName: false,
                email: false,
                pass: false,
                phone: false,
                birth: false
            }
        };
        // Lijst om uit te lezen voor het POST request.
        this.lijst = ["firstName","lastName","email","pass","phone","birth","img_link", "isWerkgever"];
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Controlleer of de waarden in een veld wel verstuurd kunnen worden.
    canBeSubmitted() {
        const errors = this.validate(this.state.firstName, this.state.lastName, this.state.email, this.state.pass, this.state.phone, this.state.birth, this.state.img_link);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
    }

    // Verander de waarde van touched voor een inputveld naar true.
    handleBlur = (field) => (event) => {
        this.setState({
            touched: {...this.state.touched, [field]: true},
        });
    };

    validate(firstName, lastName, email, pass, phone, birth, img_link) {
        // Als een waarde hier true is betekent dat dat het veld niet valide is.
        return {
            firstName: firstName.length === 0 || firstName.length >= 30 || !firstName.match(this.state.letters),
            lastName: lastName.length === 0 || lastName.length >= 30 || !lastName.match(this.state.letters),
            email: email.length === 0 || email.length >= 30,
            pass: pass.length === 0 || pass.length >= 30,
            phone: phone.length === 0 || phone.length >= 20 || !phone.match(this.state.numbers),
            birth: birth.length === 0
        };
    }

    // Ververs de waarden wanneer deze veranderd worden door de gebruiker.
    handleInputChange(event) {
        const target = event.target;
        // Laat de waarde de waarde zijn van het actieve veld. Als het input-type een checkbox is is de waarde of deze aangevinkt is of niet.
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    // Converteer de waarden uit de state naar een JSON string om die in een POST request te plaatsen en te versturen.
    handleSubmit(event) {
        // Laat de data niet verstuurd worden wanneer de input validatie niet succesvol is.
        if (!this.canBeSubmitted()) {
            event.preventDefault();
            return;
        }

        let object = {};
        this.lijst.forEach((value) => {
            let returnValue = this.state[value];
            if (typeof returnValue === 'boolean') {
                returnValue = returnValue ? 1 : 0;
            } else if (value === "birth") {
                returnValue = new Date(returnValue).toLocaleDateString('en-US', {year:'2-digit', month:"2-digit", day:"2-digit"}, "UTC");
            }
            object[value] = returnValue;
        });

        console.log("sending");
        console.log(object);
        fetch(this.props.apiLink+"/api/addgebruiker",{
            method:"POST",
            body:JSON.stringify(object),
            headers:{
                "content-type":"application/json"
            }}).then((value)=>{
            value.json().then(value1 => {console.log(value1.message)})
        });
    }

    // Verzamel de inputs van de gebruiker om die in de state op te slaan.
    render() {
        const errors = this.validate(this.state.firstName, this.state.lastName, this.state.email, this.state.pass, this.state.phone, this.state.birth);
        const isDisabled = Object.keys(errors).some(x => errors[x]);

        // Valideer of een fout getoond zou moeten worden.
        const shouldMarkError = (field) => {
            const hasError = errors[field];
            const shouldShow = this.state.touched[field];
            return hasError ? shouldShow : false;
        };

        return(
        <div id="reg">
            <form>
            <table>
                <tbody>
                <tr>
                    <label>Voornaam</label>
                    <td><input className={shouldMarkError('firstName') ? "error" : ""}
                               onBlur={this.handleBlur('firstName')}
                               type='text' name="firstName" value={this.state.firstName} placeholder="Voornaam" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Achternaam</label>
                    <td><input className={shouldMarkError('lastName') ? "error" : ""}
                               onBlur={this.handleBlur('lastName')}
                               type='text' name="lastName" value={this.state.lastName} placeholder="Achternaam" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Email</label>
                    <td><input className={shouldMarkError('email') ? "error" : ""}
                               onBlur={this.handleBlur('email')}
                               type='email' name="email" value={this.state.email} placeholder="Email" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Telefoonnummer</label>
                    <td><input className={shouldMarkError('phone') ? "error" : ""}
                               onBlur={this.handleBlur('phone')}
                               type='text' name="phone" value={this.state.phone} placeholder="Telefoonnummer" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Geboortedatum</label>
                    <td><input className={shouldMarkError('birth') ? "error" : ""}
                               onBlur={this.handleBlur('birth')}
                               type='date' name="birth" value={this.state.birth} placeholder="Geboortedatum" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Wachtwoord</label>
                    <td><input className={shouldMarkError('pass') ? "error" : ""}
                               onBlur={this.handleBlur('pass')}
                               type='password' name="pass" value={this.state.pass} placeholder="Wachtwoord" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Account voor werkgever</label>
                    <td><input type='checkbox' name="isWerkgever" value={this.state.isWerkgever} placeholder="false" onChange={this.handleInputChange}/></td>
                </tr>
                <button disabled={isDisabled} onClick={this.handleSubmit}>Registreer</button>
                </tbody>
            </table>
            </form>
        </div>
        )
    }
}
export default Registratie
