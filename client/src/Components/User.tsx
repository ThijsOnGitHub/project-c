import React from'react'
import {inflate} from "zlib";

interface IState {
    avatar:string
    firstName:string
    lastName:string
    mail:string
    telefoon:string
    geboorte:string
    serverLink:string
}
interface IProps {
    apiLink:string
}

class User extends React.Component<IProps,IState> {
    private lijst: (keyof IState)[]

    constructor(props: IProps) {
        super(props);
        // Lijst om uit te lezen voor het POST request.
        this.lijst = ["firstName", "lastName", "mail", "telefoon", "geboorte"];
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Converteer de waarden uit de state naar een JSON string om die in een POST request te plaatsen en te versturen.
    handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        // Maak een nieuw rooster aan in de database.
        fetch(this.props.apiLink + "/addrooster", {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                newVoornaam: this.state.firstName,
                newAchternaam: this.state.lastName,
                newEmail: this.state.mail,
                newTelefoon: this.state.telefoon,
                newGeboorte: this.state.geboorte
            })
        });
    };


    return(
        <div id="reg">
        <form id="account">
                <table>
                <tbody>
                    <tr>
                        <td colSpan={3} >
                            {/*Check if the user has an avatar picture, if not -> standard avatar for users*/}
                            {props.avatar.match("^http")?
                            <img src='https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png'/> :
                            <img className='avatar' src={props.serverLink+"/api/avatar/"+props.avatar}/>}
                        </td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Voornaam:</p></td>
                        <td className="rightValue"><p>{props.firstName}</p></td>
                        <td><input type='text' name="newVoornaam" value={props.firstName}/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Achternaam:</p></td>
                        <td className="rightValue"><p>{props.lastName}</p></td>
                        <td><input type='text' name="newAchternaam" value={props.lastName}/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Email:</p></td>
                        <td className="rightValue"><p>{props.mail}</p></td>
                        <td><input type='text' name="newEmail" value={props.mail}/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Telefoonnummer:</p></td>
                        <td className="rightValue"><p>{props.telefoon}</p></td>
                        <td><input type='text' name="newTelefoon" value={props.telefoon}/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Geboortedatum:</p></td>
                        <td className="rightValue"><p>{props.geboorte}</p></td>
                        <td><input type='text' name="newGeboorte" value={props.geboorte}/></td>
                    </tr>
                    <tr>
                        <td colSpan={3}><button onClick={this.handleSubmit}>Wijzigen</button></td>
                    </tr>
                </tbody>
                </table>
            </form>
        </div>
    )
};

export default User