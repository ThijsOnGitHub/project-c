import React from "react";

interface IState{
    sickPerson: string,
    exchangePerson: string
}

interface IProps {
    apiLink:string,
    serverLink:string,
}

class ZiekMeld extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state={
            sickPerson:"",
            exchangePerson:""
        }
    }
    render() {
        return (
            <div id="reg">
                <table>
                    <tbody>
                        <tr>
                            <td align={"center"}>Persoon A heeft zich ziek gemeld, van x tot x op x dag.<br/>Wil je deze dienst overnemen?</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ZiekMeld