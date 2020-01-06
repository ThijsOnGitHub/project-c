import React from 'react';
import {Redirect} from 'react-router-dom';
import {posix} from "path";

interface IState {
    newVoornaam:string,
    newAchternaam:string,
    newEmail:string,
    newTelefoon:string,
    OldPass: string,
    newPass1: string,
    newPass2: string,
    secondPassSame: boolean,
    updateDone: boolean,
    checkemailSuccess: boolean,
    checkoldpasswordSuccess: boolean,
    letters: RegExp,
    numbers: RegExp,
    passwords: RegExp,
    touched: {
        newVoornaam: boolean,
        newAchternaam: boolean,
        newEmail: boolean,
        newTelefoon: boolean,
        OldPass: boolean,
        newPass1: boolean,
        newPass2: boolean
    }
}

interface IProps {
    apiLink:string
    avatar:string
    firstName:string
    lastName:string
    mail:string
    telefoon:string
    wachtwoord:string
    geboorte:string
    serverLink:string
}

class User extends React.Component<IProps,IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            newVoornaam: '',
            newAchternaam: '',
            newEmail: '',
            newTelefoon: '',
            OldPass: '',
            newPass1: '',
            newPass2: '',
            secondPassSame: false,
            updateDone: false,
            checkemailSuccess: false,
            checkoldpasswordSuccess: false,
            letters: /^[A-Za-z]+$/,
            numbers: /^[0-9]+$/,
            passwords: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,}$/,
            touched: {
                newVoornaam: false,
                newAchternaam: false,
                newEmail: false,
                newTelefoon: false,
                OldPass: false,
                newPass1: false,
                newPass2: false
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount(): void {
        this.setState({
            newVoornaam: this.props.firstName,
            newAchternaam: this.props.lastName,
            newEmail: this.props.mail,
            newTelefoon: this.props.telefoon,
            OldPass: '',
            newPass1: '',
            newPass2: ''
            }
        )
    }

    // Converteer de waarden uit de state naar een JSON string om die in een POST request te plaatsen en te versturen.
    handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        // Maak een nieuw rooster aan in de database.
        fetch(this.props.apiLink + "/updategebruiker", {
            headers: {'Content-Type': 'application/json', authToken: sessionStorage.getItem('authToken')},
            method: 'PUT',
            body: JSON.stringify({
                newVoornaam: this.state.newVoornaam,
                newAchternaam: this.state.newAchternaam,
                newEmail: this.state.newEmail,
                newTelefoon: this.state.newTelefoon,
                newPass: this.state.newPass1

            })

        });

        this.setState({updateDone: true});
    };

    handleInputChange = async (event:React.ChangeEvent<HTMLInputElement>) =>{
        const target = event.target;
        // Laat de waarde de waarde zijn van het actieve veld. Als het input-type een checkbox is is de waarde of deze aangevinkt is of niet.
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;



        console.log(this.state.checkemailSuccess);
        if (target.name === "newEmail") {this.checkEmail(); }


        // Check of de waarden van het eerste en tweede wachtwoord gelijk zijn. Verander de state naar aanleiding van de uitkomst.
        if(target.name === "newPass1" || target.name === "newPass2") {
            if (this.state.newPass2 == this.state.newPass1) { await this.setState({secondPassSame: true});
            } else { await this.setState({secondPassSame: false}) }
        }

        await this.setState<never> ({[name]: value});
        if (target.name === "OldPass") {this.checkPass(); }
    }

    // Verander de waarde van touched voor een inputveld naar true.
    handleBlur = (field:string) => (event:React.FocusEvent) => {
        this.setState({
            touched: {...this.state.touched, [field]: true},
        });
    };

    checkEmail = async () => {
        let email: any = await fetch(this.props.apiLink + "/account/checkemail", {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({email: this.state.newEmail})
        }).then(res => res.json());

        this.setState({checkemailSuccess: email.emailCheck});
    };

    checkPass = async () => {
        if (this.state.OldPass == ''){
            return
        }
            let oldpassword= await fetch(this.props.apiLink + "/account/checkpassword", {
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({oldpassword: this.state.OldPass, email: this.props.mail})
            })
            let result=await oldpassword.json()

            this.setState({checkoldpasswordSuccess: result});
    };

    validate(newVoornaam:string, newAchternaam:string, newEmail:string, newTelefoon:string, OldPass:string, newPass1: string, newPass2: string) {
        // Als een waarde hier true is betekent dat dat het veld niet valide is.
        return {
            newVoornaam: newVoornaam.length === 0 || newVoornaam.length >= 30 || !newVoornaam.match(this.state.letters),
            newAchternaam: newAchternaam.length === 0 || newAchternaam.length >= 30 || !newAchternaam.match(this.state.letters),
            newEmail: !newEmail.includes("@") || (newEmail.length === 0 || newEmail.length >= 30) || !this.state.checkemailSuccess && (this.state.newEmail != this.props.mail),
            newTelefoon: newTelefoon.length < 9 || newTelefoon.length >= 11 || !newTelefoon.match(this.state.numbers),
            OldPass: this.state.checkoldpasswordSuccess,
            newPass1: newPass1.length === 0 || !newPass1.match(this.state.passwords),
            newPass2: newPass2.length === 0 || !this.state.secondPassSame,


        };
    }
    // Controlleer of de waarden in een veld wel verstuurd kunnen worden.
    canBeSubmitted() {
        const errors = this.validate(this.state.newVoornaam, this.state.newAchternaam, this.state.newEmail, this.state.newTelefoon,this.state.OldPass, this.state.newPass1, this.state.newPass2);
        const isDisabled = Object.values(errors).some(value => value);
        return !isDisabled;
    }

render(){
    type fields = {newVoornaam: boolean, newAchternaam: boolean, newEmail: boolean, newTelefoon: boolean, OldPass: boolean, newPass1: boolean, newPass2: boolean}
    const errors:fields = this.validate(this.state.newVoornaam, this.state.newAchternaam, this.state.newEmail, this.state.newTelefoon, this.state.OldPass, this.state.newPass1, this.state.newPass2);
    const isDisabled = Object.values(errors).some(value => value);

    // Valideer of een fout getoond zou moeten worden.
    const shouldMarkError = (field: keyof typeof errors) => {
        const hasError = errors[field];
        const shouldShow = this.state.touched[field];
        return hasError ? shouldShow : false;
    };

    return(
        <div id="reg">
        <form id="account">
                <table>
                <tbody>
                    <tr>
                        <td colSpan={3}>
                            {/*Check if the user has an avatar picture, if not -> standard avatar for users*/}
                            {this.props.avatar.match("^http")?
                            <img src='https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png'/> :
                            <img className='avatar' src={this.props.serverLink+"/api/avatar/"+this.props.avatar}/>}
                        </td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Voornaam:</p></td>
                        <td className="rightValue"><p>{this.props.firstName}</p></td>
                        <td><input className={shouldMarkError('newVoornaam') ? "error" : ""}
                                   onBlur={this.handleBlur('newVoornaam')}
                                   type='text' name="newVoornaam" value={this.state.newVoornaam} onChange={this.handleInputChange}/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Achternaam:</p></td>
                        <td className="rightValue"><p>{this.props.lastName}</p></td>
                        <td><input className={shouldMarkError('newAchternaam') ? "error" : ""}
                                   onBlur={this.handleBlur('newAchternaam')} onChange={this.handleInputChange} type='text' name="newAchternaam" value={this.state.newAchternaam}/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Email:</p></td>
                        <td className="rightValue"><p>{this.props.mail}</p></td>
                        <td><input className={shouldMarkError('newEmail') ? "error" : ""}
                                   onBlur={this.handleBlur('newEmail')} onChange={this.handleInputChange} type='text' name="newEmail" value={this.state.newEmail}/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Oud wachtwoord:</p></td>
                        <td className="rightValue"><p>**********</p></td>
                        <td><input className={shouldMarkError('OldPass') ? "error" : ""}
                                   onBlur={this.handleBlur('OldPass')} onChange={this.handleInputChange} type='text' name="OldPass" value={this.state.OldPass}/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Nieuw wachtwoord:</p></td>
                        <td className="rightValue"><p></p></td>
                        <td><input className={shouldMarkError('newPass1') ? "error" : ""}
                                   onBlur={this.handleBlur('newPass1')} onChange={this.handleInputChange} type='text' name="newPass1" value={this.state.newPass1}/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Bevestig nieuw wachtwoord:</p></td>
                        <td className="rightValue"><p></p></td>
                        <td><input className={shouldMarkError('newPass2') ? "error" : ""}
                                   onBlur={this.handleBlur('newPass2')} onChange={this.handleInputChange} type='text' name="newPass2" value={this.state.newPass2}/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Telefoonnummer:</p></td>
                        <td className="rightValue"><p>{this.props.telefoon}</p></td>
                        <td><input className={shouldMarkError('newTelefoon') ? "error" : ""}
                                   onBlur={this.handleBlur('newTelefoon')} onChange={this.handleInputChange} type='text' name="newTelefoon" value={this.state.newTelefoon}/></td>
                    </tr>
                    <tr>
                        <td colSpan={3}><button disabled={isDisabled}  onClick={this.handleSubmit}>Wijzigen</button></td>
                    </tr>
                </tbody>
                </table>
            </form>
        </div>
    )}
}

export default User