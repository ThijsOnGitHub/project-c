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
                            <tr>
                                <label>Voornaam</label>
                                <td>Test</td>
                            </tr>
                            <tr>
                                <label>Voornaam</label>
                                <td>Test</td>
                            </tr>
                            <tr>
                                <label>Voornaam</label>
                                <td>Test</td>
                            </tr>
                            <tr>
                                <label>Voornaam</label>
                                <td>Test</td>
                            </tr>
                            <tr>
                                <label>Voornaam</label>
                                <td>Test</td>
                            </tr>
                            <tr>
                                <label>Voornaam</label>
                                <td>Test</td>
                            </tr>
                            <tr>
                                <label>Voornaam</label>
                                <td>Test</td>
                            </tr>
                            <tr>
                                <label>Voornaam</label>
                                <td>Test</td>
                            </tr>
                            <tr>
                                <td><button onClick={this.handleSubmit}>Registreer</button></td>
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