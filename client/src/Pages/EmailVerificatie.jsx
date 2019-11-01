import React from 'react';
import {Link} from "react-router-dom";

class EmailVerificatie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }

    verify() {
        fetch(this.props.apiLink + "/api/activeergebruiker", {
            method: 'PUT',
            body: JSON.stringify({
                email: window.location.pathname.split('/')[2]
            }),
            headers: { "Content-Type": "application/json; charset=utf-8" }
        })
    }

    componentDidMount() {
        this.verify();
    }

    render() {
        return(
            <div id="reg">
                <table>
                    <tbody>
                    <tr>
                        <td>Uw verificatie is succesvol, u kunt deze pagina verlaten.</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
export default EmailVerificatie