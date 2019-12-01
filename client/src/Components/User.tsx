import React from'react'

interface IState {
    newVoornaam:string
    newAchternaam:string
    newEmail:string
    newTelefoon:string
}
interface IProps {
    apiLink:string
    avatar:string
    firstName:string
    lastName:string
    mail:string
    telefoon:string
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
            newTelefoon: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(): void {
        this.setState({
            newVoornaam: this.props.firstName,
            newAchternaam: this.props.lastName,
            newEmail: this.props.mail,
            newTelefoon: this.props.telefoon
            }

        )
    }

    // Converteer de waarden uit de state naar een JSON string om die in een POST request te plaatsen en te versturen.
    handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        // Maak een nieuw rooster aan in de database.
        fetch(this.props.apiLink + "/updategebruiker", {
            headers: {'Content-Type': 'application/json', authToken: sessionStorage.getItem('authToken')},
            method: 'PUT',
            body: JSON.stringify({
                newVoornaam: this.state.newVoornaam,
                newAchternaam: this.state.newAchternaam,
                newEmail: this.state.newEmail,
                newTelefoon: this.state.newTelefoon

            })
        });
    };

    handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) =>{
        const target = event.target;
        // Laat de waarde de waarde zijn van het actieve veld. Als het input-type een checkbox is is de waarde of deze aangevinkt is of niet.
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState<never> ({[name]: value});
    }

render(){
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
                        <td><input onChange={this.handleInputChange} type='text' name="newVoornaam" value={this.state.newVoornaam}/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Achternaam:</p></td>
                        <td className="rightValue"><p>{this.props.lastName}</p></td>
                        <td><input onChange={this.handleInputChange} type='text' name="newAchternaam" value={this.state.newAchternaam}/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Email:</p></td>
                        <td className="rightValue"><p>{this.props.mail}</p></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Telefoonnummer:</p></td>
                        <td className="rightValue"><p>{this.props.telefoon}</p></td>
                        <td><input onChange={this.handleInputChange} type='text' name="newTelefoon" value={this.state.newTelefoon}/></td>
                    </tr>
                    <tr>
                        <td colSpan={3}><button onClick={this.handleSubmit}>Wijzigen</button></td>
                    </tr>
                </tbody>
                </table>
            </form>
        </div>
    )}
}

export default User