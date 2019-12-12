import React    from "react"
import { Link } from "react-router-dom";

interface IProps{}

class OvernameFeedback
    extends React.Component<IProps> {
    render() {
        return (
            <div id="reg">
                <table>
                    <tbody>
                    <tr>
                        <td align={ "center" }>Je hebt de dienst overgenomen.<br/><Link to="/">Klik hier om door te gaan.</Link></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default OvernameFeedback