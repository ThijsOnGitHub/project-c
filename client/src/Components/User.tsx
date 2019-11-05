import React from'react'
import {inflate} from "zlib";

interface IProps {
    avatar:string
    firstName:string
    lastName:string
    mail:string
    telefoon:string
    geboorte:string
    serverLink:string
}

function User(props:IProps) {
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
                        <td><input type='text' name="newVoornaam"/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Achternaam:</p></td>
                        <td className="rightValue"><p>{props.lastName}</p></td>
                        <td><input type='text' name="newAchternaam"/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Email:</p></td>
                        <td className="rightValue"><p>{props.mail}</p></td>
                        <td><input type='text' name="newEmail"/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Telefoonnummer:</p></td>
                        <td className="rightValue"><p>{props.telefoon}</p></td>
                        <td><input type='text' name="newTelefoon"/></td>
                    </tr>
                    <tr>
                        <td className="leftInfo"><p>Geboortedatum:</p></td>
                        <td className="rightValue"><p>{props.geboorte}</p></td>
                        <td><input type='text' name="newGeboorte"/></td>
                    </tr>
                    <tr>
                        <td colSpan={3}><button>Wijzigen</button></td>
                    </tr>
                </tbody>
                </table>
            </form>
        </div>
    )
}

export default User