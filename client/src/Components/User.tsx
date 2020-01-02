import React from'react'
import {Redirect} from 'react-router-dom'
import {posix} from "path";

interface IState {
    newVoornaam:string,
    newAchternaam:string,
    newEmail:string,
    newTelefoon:string,
    newWachtwoord: string,
    updateDone: boolean,
    letters: RegExp,
    numbers: RegExp,
    touched: {
        newVoornaam: boolean,
        newAchternaam: boolean,
        newEmail: boolean,
        newTelefoon: boolean,
        newWachtwoord: boolean
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
    private lijst: (keyof IState)[]

    constructor(props: IProps) {
        super(props);
        this.state = {
            newVoornaam: '',
            newAchternaam: '',
            newEmail: '',
            newTelefoon: '',
            newWachtwoord: '',
            updateDone: false,
            letters: /^[A-Za-z]+$/,
            numbers: /^[0-9]+$/,
            touched: {
                newVoornaam: false,
                newAchternaam: false,
                newEmail: false,
                newTelefoon: false,
                newWachtwoord: false
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount(): void {
        this.setState({
            newVoornaam: this.props.firstName,
            newAchternaam: this.props.lastName,
            newEmail: this.props.mail,
            newTelefoon: this.props.telefoon,
            newWachtwoord: this.props.wachtwoord
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
                newWachtwoord: this.state.newWachtwoord

            })

        });
        this.setState({updateDone: true});
    };

    handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) =>{
        const target = event.target;
        // Laat de waarde de waarde zijn van het actieve veld. Als het input-type een checkbox is is de waarde of deze aangevinkt is of niet.
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState<never> ({[name]: value});
    }
    // Verander de waarde van touched voor een inputveld naar true.
    handleBlur = (field:string) => (event:React.FocusEvent) => {
        this.setState({
            touched: {...this.state.touched, [field]: true},
        });
    };
    validate(newVoornaam:string, newAchternaam:string, newEmail:string, newTelefoon:string, newWachtwoord:string) {
        // Als een waarde hier true is betekent dat dat het veld niet valide is.
        return {
            newVoornaam: newVoornaam.length === 0 || newVoornaam.length >= 30 || !newVoornaam.match(this.state.letters),
            newAchternaam: newAchternaam.length === 0 || newAchternaam.length >= 30 || !newAchternaam.match(this.state.letters),
            newEmail: !newEmail.includes("@") || (newEmail.length === 0 || newEmail.length >= 30),
            newTelefoon: newTelefoon.length < 9 || newTelefoon.length >= 11 || !newTelefoon.match(this.state.numbers),
            newWachtwoord: newTelefoon.length < 9 || newTelefoon.length >= 11 || !newTelefoon.match(this.state.numbers),
        };
    }
    // Controlleer of de waarden in een veld wel verstuurd kunnen worden.
    canBeSubmitted() {
        const errors = this.validate(this.state.newVoornaam, this.state.newAchternaam, this.state.newEmail, this.state.newTelefoon, this.state.newWachtwoord);
        const isDisabled = Object.values(errors).some(value => value);
        return !isDisabled;
    }

render(){
    type fields = {newVoornaam: boolean, newAchternaam: boolean, newEmail: boolean, newTelefoon: boolean, newWachtwoord: boolean}
    const errors:fields = this.validate(this.state.newVoornaam, this.state.newAchternaam, this.state.newEmail, this.state.newTelefoon, this.state.newWachtwoord);
    const isDisabled = Object.values(errors).some(value => value);

    // Valideer of een fout getoond zou moeten worden.
    const shouldMarkError = (field: keyof typeof errors) => {
        const hasError = errors[field];
        const shouldShow = this.state.touched[field];
        return hasError ? shouldShow : false;
    };
        console.log(this.state.updateDone)
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
                        <td className="leftInfo"><p>Wachtwoord:</p></td>
                        <td className="rightValue"><p>{this.props.wachtwoord}</p></td>
                        <td><input className={shouldMarkError('newWachtwoord') ? "error" : ""}
                                   onBlur={this.handleBlur('newWachtwoord')} onChange={this.handleInputChange} type='text' name="newWachtwoord" value={this.state.newWachtwoord}/></td>
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