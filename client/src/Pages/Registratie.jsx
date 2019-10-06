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
            img_link: ''
        };
        // Lijst om uit te lezen voor het POST request.
        this.lijst=["firstName","lastName","email","pass","phone","birth","img_link"];
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Converteer de waarden uit de state naar een JSON string om die in een POST request te plaatsen en te versturen.
    handleSubmit() {
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
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    // Verzamel de inputs van de gebruiker om die naar de state te brengen.
    render() {
        return(
            <div>
                <h1>Registratie</h1>
                <div>
                    <label>Voornaam</label>
                    <input type='text' name="firstName" value={this.state.firstName} placeholder="" onChange={this.handleInputChange}/>
                </div>
                <div>
                    <label>Achternaam</label>
                    <input type='text' name="lastName" value={this.state.lastName} placeholder="" onChange={this.handleInputChange}/>
                </div>
                <div>
                    <label>Email</label>
                    <input type='text' name="email" value={this.state.email} placeholder="" onChange={this.handleInputChange}/>
                </div>
                <div>
                    <label>Telefoonnummer</label>
                    <input type='text' name="phone" value={this.state.phone} placeholder="" onChange={this.handleInputChange}/>
                </div>
                <div>
                    <label>Geboortedatum</label>
                    <input type='text' name="birth" value={this.state.birth} placeholder="" onChange={this.handleInputChange}/>
                </div>
                <div>
                    <label>URL gebruikersafbeelding</label>
                    <input type='text' name="img_link" value={this.state.img_link} placeholder="" onChange={this.handleInputChange}/>
                </div>
                <div>
                    <label>Wachtwoord</label>
                    <input type='text' name="pass" value={this.state.pass} placeholder="" onChange={this.handleInputChange}/>
                </div>
                <button onClick={this.handleSubmit}>submit</button>
            </div>
        )
    }
}
export default Registratie