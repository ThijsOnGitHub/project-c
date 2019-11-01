import React from 'react'

function User(props) {

    return(
        <div id="reg">
        <form id="account">
                <table>
                <tbody>
                    <tr>
                        <td colspan="3">
                            {/*Check if the user has an avatar picture, if not -> standard avatar for users*/}
                            {props.avatar===undefined ?
                            <img src='https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png'/> :
                            <img class='avatar' src={props.avatar}/>}
                        </td>
                    </tr>
                    <tr>
                        <td class="leftInfo"><p>Voornaam:</p></td>
                        <td class="rightValue"><p>{props.naam}</p></td>
                        <td><input type='text' name="newVoornaam"/></td>
                    </tr>
                    <tr>
                        <td class="leftInfo"><p>Achternaam:</p></td>
                        <td class="rightValue"><p>{props.achternaam}</p></td>
                        <td><input type='text' name="newAchternaam"/></td>
                    </tr>
                    <tr>
                        <td class="leftInfo"><p>Email:</p></td>
                        <td class="rightValue"><p>{props.mail}</p></td>
                        <td><input type='text' name="newEmail"/></td>
                    </tr>
                    <tr>
                        <td class="leftInfo"><p>Telefoonnummer:</p></td>
                        <td class="rightValue"><p>{props.telefoon}</p></td>
                        <td><input type='text' name="newTelefoon"/></td>
                    </tr>
                    <tr>
                        <td class="leftInfo"><p>Geboortedatum:</p></td>
                        <td class="rightValue"><p>{props.geboorte}</p></td>
                        <td><input type='text' name="newGeboorte"/></td>
                    </tr>
                    <tr>
                        <td colSpan="3"><button>Wijzigen</button></td>
                    </tr>
                </tbody>
                </table>
            </form>
        </div>
    )
}

export default User