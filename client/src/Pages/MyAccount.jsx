import React from 'react'

class MyAccount extends React.Component{
    constructor(){
        super()
    }



    render() {
        return(
            <>
                <div className="underlay">
                    <h1><span className="weighted">Gebruiker's</span> account informatie</h1>
                </div>
                <div id="reg">
                    <form>
                        <table>
                            <tbody>
                            <tr>Avatar URL</tr>
                            <tr>
                                <label>Voornaam:</label>
                                <td>%firstname%</td>
                            </tr>
                            <tr>
                                <label>Achternaam:</label>
                                <td>%lastname%</td>
                            </tr>
                            <tr>
                                <label>Email:</label>
                                <td>%email%t</td>
                            </tr>
                            <tr>
                                <label>Telefoonnummer:</label>
                                <td>%phone-numer%</td>
                            </tr>
                            <tr>
                                <label>Geboortedatum:</label>
                                <td>%birthdate%</td>
                            </tr>
                            <tr>
                                <label>Werkgever:</label>
                                <td>%Ja / Nee%</td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </>
        )
    }

}
export default MyAccount