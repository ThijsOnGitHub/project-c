import React, {MouseEventHandler} from 'react';
import {Link} from "react-router-dom";
import {Redirect} from 'react-router-dom';
import ProfielFotoBijsnijder from "../Components/ProfielFotoBijsnijder";

interface IState {
    // Globale variabelen.
    firstName: string,
    lastName: string,
    email: string,
    pass: string,
    secondPass: string,
    phone: string,
    birth: string,
    foto: string,
    isWerkgever: boolean,
    roosterName: string,
    koppelCodeWerknemer: string,
    koppelCodeWerkgever: string,
    // Feedback
    registratieSucces: boolean,
    addgebruikerSuccess: boolean,
    addroosterSuccess: boolean,
    checkemailSuccess: boolean,
    koppelgebruikerSuccess: boolean,
    // Beschrijf de toegestane symbolen voor de inputvelden.
    letters: RegExp,
    numbers: RegExp,
    // Sla op of inputvelden al zijn aangeraakt door de gebruiker.
    touched: {
        firstName: boolean,
        lastName: boolean,
        email: boolean,
        pass: boolean,
        secondPass: boolean,
        phone: boolean,
        birth: boolean,
        roosterName: boolean,
        koppelCodeWerknemer: boolean
    },
    fotoFile: File,
    blackCircle: boolean,
    getImage: () => Promise <Blob>
}

interface IProps {
    apiLink:string
}

class Registratie extends React.Component<IProps,IState>{
    private lijst:(keyof IState)[];

    constructor(props:IProps){
        super(props);
        this.state = {
            // Globale variabelen.
            firstName: '',
            lastName: '',
            email: '',
            pass: '',
            secondPass: '',
            phone: '',
            birth: '',
            foto: '',
            isWerkgever: false,
            roosterName: '',
            koppelCodeWerknemer: '',
            koppelCodeWerkgever: '',
            // Feedback
            registratieSucces: false,
            addgebruikerSuccess: false,
            addroosterSuccess: false,
            checkemailSuccess: false,
            koppelgebruikerSuccess: false,
            // Beschrijf de toegestane symbolen voor de inputvelden. Geen spaties voor en na inputs, wel mogen in namen spaties zitten.
            letters: /^[^\s][A-Z\sa-z]+[^\s]$/,
            numbers: /^[^\s][0-9]+[^\s]$/,
            // Sla op of inputvelden al zijn aangeraakt door de gebruiker.
            touched: {
                firstName: false,
                lastName: false,
                email: false,
                pass: false,
                secondPass: false,
                phone: false,
                birth: false,
                roosterName: false,
                koppelCodeWerknemer: false
            },
            fotoFile: null,
            blackCircle: true,
            getImage: null
        };
        // Lijst om uit te lezen voor het POST request.
        this.lijst = ["firstName", "lastName", "email", "pass", "phone", "birth", "isWerkgever"];
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.generateKoppelCode();
    };

    generateKoppelCode = async () => {
        // Genereer een willekeurige serie van nummers.
        let value: string = (Math.floor(Math.random() * 100000 ) + 1).toString();

        // Controlleer of de gegenereerde koppelcode al in de database staat.
        let koppelcode: any = await fetch(this.props.apiLink + "/checkkoppelcode", {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({value})
        }).then(res => res.json());

        // Verwerk de feedback vanuit de server.
        if (koppelcode.koppelCodeCheck == 0) {
            this.setState({koppelCodeWerkgever: value});
        } else if (koppelcode.koppelCodeCheck == 1) {
            this.generateKoppelCode();
        }
    };

    // Controlleer of de waarden in een veld wel verstuurd kunnen worden.
    canBeSubmitted() {
        const errors = this.validate(this.state.firstName, this.state.lastName, this.state.email, this.state.pass, this.state.phone, this.state.birth, this.state.roosterName, this.state.koppelCodeWerknemer, this.state.secondPass);
        const isDisabled = Object.values(errors).some(value => value);
        return !isDisabled;
    }

    // Ververs de waarden wanneer deze veranderd worden door de gebruiker.
    handleInputChange(event:React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        // Laat de waarde de waarde zijn van het actieve veld. Als het input-type een checkbox is is de waarde of deze aangevinkt is of niet.
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.checkEmail();

        if (target.type === "file"){
            this.setState<never> ({[name+"File"]: target.files[0]})
        }
        this.setState<never> ({[name]: value});
    }

    // Verander de waarde van touched voor een inputveld naar true.
    handleBlur = (field:string) => (event:React.FocusEvent) => {
        this.setState({
            touched: {...this.state.touched, [field]: true},
        });
    };

    checkEmail = async () => {
        let email: any = await fetch(this.props.apiLink + "/checkemail", {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({email: this.state.email})
        }).then(res => res.json());

        console.log(email.emailCheck);
        this.setState({checkemailSuccess: email.emailCheck});
    };

    validate(firstName:string, lastName:string, email:string, pass:string, phone:string, birth:string, roosterName:string, koppelCodeWerknemer:string, secondPass:string) {
        // Als een waarde hier true is betekent dat dat het veld niet valide is.

        return {
            firstName: firstName.length === 0 || firstName.length >= 30 || !firstName.match(this.state.letters),
            lastName: lastName.length === 0 || lastName.length >= 30 || !lastName.match(this.state.letters),
            // Controlleer hier of een email al aanwezig is in de database of niet door een nieuwe functie aan te roepen.
            email: email.length === 0 || email.length >= 30 || !this.state.checkemailSuccess,
            pass: pass.length === 0,
            secondPass: secondPass.length === 0 || !secondPass.match(this.state.pass),
            phone: phone.length === 0 || phone.length >= 20 || !phone.match(this.state.numbers),
            birth: birth.length === 0,
            roosterName: this.state.isWerkgever && roosterName.length === 0,
            koppelCodeWerknemer: !this.state.isWerkgever && koppelCodeWerknemer.length === 0
        };
    }

    // Converteer de waarden uit de state naar een JSON string om die in een POST request te plaatsen en te versturen.
    handleSubmit = async (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        // Laat de data niet verstuurd worden wanneer de input validatie niet succesvol is.
        if (!this.canBeSubmitted()) {return;}

        // Stel de informatie samen voor het toevoegen van de gebruiker.
        await this.setState({blackCircle:false});
        let image = null;
        if (this.state.foto != "") {image = await this.state.getImage();}

        let formData = new FormData();
        formData.append("profielFoto",image);
        this.lijst.forEach( value => {
            let val = this.state[value];
            formData.append(value, val.toString())
        });

        // Voeg de gebruiker toe aan de database.
        let addgebruiker: any = await fetch(this.props.apiLink+"/addgebruiker",{
            method:'POST',
            body:formData
        }).then(res => res.json());
        // Verwerk de feedback vanuit de server.
        this.setState({addgebruikerSuccess: addgebruiker.addgebruikerSuccess});

        // Maak een nieuw rooster aan in de database.
        if (this.state.isWerkgever) {
            let addrooster: any = await fetch(this.props.apiLink + "/addrooster", {
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({roosterName: this.state.roosterName, koppelCodeWerkgever: this.state.koppelCodeWerkgever, email: this.state.email})
            }).then(res => res.json());
            // Verwerk de feedback vanuit de server.
            this.setState({addroosterSuccess: addrooster.addroosterSuccess});
        }

        // Koppel een gebruiker aan het rooster dat bij zijn koppelcode hoort.
        if (!this.state.isWerkgever) {
            let koppelgebruiker: any = await fetch(this.props.apiLink + "/koppelgebruiker", {
                headers: {'Content-Type': 'application/json'},
                method: 'PUT',
                body: JSON.stringify({email: this.state.email, koppelCodeWerknemer: this.state.koppelCodeWerknemer})
            }).then(res => res.json());
            // Verwerk de feedback vanuit de server.
            this.setState({koppelgebruikerSuccess: koppelgebruiker.koppelgebruikerSuccess})
        }

        // Geef door dat de registratie succesvol is wanneer...
        if (this.state.isWerkgever && this.state.addgebruikerSuccess && this.state.addroosterSuccess) {
            this.setState({registratieSucces: true});
            alert("Registratie succesvol.");
        } else if (!this.state.isWerkgever && this.state.addgebruikerSuccess && this.state.koppelgebruikerSuccess) {
            this.setState({registratieSucces: true});
            alert("Registratie succesvol.");
        }
    };

    // Verzamel de inputs van de gebruiker om die in de state op te slaan.
    render() {
        type fields = {birth: boolean, email: boolean, firstName: boolean, lastName: boolean, pass: boolean, phone: boolean, roosterName: boolean, koppelCodeWerknemer: boolean, secondPass: boolean}
        const errors:fields = this.validate(this.state.firstName, this.state.lastName, this.state.email, this.state.pass, this.state.phone, this.state.birth, this.state.roosterName, this.state.koppelCodeWerknemer, this.state.secondPass);
        const isDisabled = Object.values(errors).some(value => value);

        // Valideer of een fout getoond zou moeten worden.
        const shouldMarkError = (field: keyof typeof errors) => {
            const hasError = errors[field];
            const shouldShow = this.state.touched[field];
            return hasError ? shouldShow : false;
        };

    // Verzamel de inputs van de gebruiker om die in de state op te slaan.
    // Als er een foto is geselecteerd wordt hieruit een afbeelding aangemaakt.
        return(
        <div id="reg">
                <form>
                <table>
                <tbody>
                <tr>
                    <h1>Registratie</h1>
                </tr>
                <tr>
                    <label>Preview Profielfoto</label>
                    <td><ProfielFotoBijsnijder size={350} blackCircle={this.state.blackCircle} setImageGetFunction={(functie)=>{this.setState({getImage:functie})}} image={this.state.fotoFile}/></td>
                </tr>
                <tr>
                    <label>Upload Profielfoto</label>
                    <td><input type="file" accept={"image/*"}  onChange={this.handleInputChange} name="foto"/></td>
                </tr>
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
                    <label>Bevestiging wachtwoord</label>
                    <td><input className={shouldMarkError('secondPass') ? "error" : ""}
                               onBlur={this.handleBlur('secondPass')}
                               type='password' name="secondPass" value={this.state.secondPass} placeholder="Wachtwoord" onChange={this.handleInputChange}/></td>
                </tr>
                <tr>
                    <label>Account voor werkgever</label>
                    <td><input type='checkbox' name="isWerkgever" checked={this.state.isWerkgever} placeholder="false" onChange={this.handleInputChange} /></td>
                </tr>

                { this.state.isWerkgever ?
                    <tr>
                        <label>Roosternaam</label>
                        <td><input className={shouldMarkError('roosterName') ? "error" : ""}
                                   onBlur={this.handleBlur('roosterName')}
                                   type='text' name="roosterName" value={this.state.roosterName} placeholder="Roosternaam" onChange={this.handleInputChange}/></td>
                    </tr> : ''
                }
                { this.state.isWerkgever ?
                    <tr>
                        <label>Koppelcode</label>
                        <td><input name="koppelCodeWerkgever" value={this.state.koppelCodeWerkgever}/></td>
                    </tr>
                    :
                    <tr>
                        <label>Koppelcode</label>
                        <td><input className={shouldMarkError('koppelCodeWerknemer') ? "error" : ""}
                                   onBlur={this.handleBlur('koppelCodeWerknemer')}
                                   type='text' name="koppelCodeWerknemer" value={this.state.koppelCodeWerknemer} placeholder="Koppelcode" onChange={this.handleInputChange}/></td>
                    </tr>
                }

                <button disabled={isDisabled} onClick={this.handleSubmit}>Registreer</button>
                {
                    this.state.registratieSucces && <Redirect to={{pathname: '/login', state: {id: '2'}}}/>
                }

                </tbody>
            </table>
            </form>
        </div>
        )
    }
}

export default Registratie
