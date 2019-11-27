import React from "react";

interface IState{
    RoosterAndPerson:[]
}

interface IProps {
    apiLink:string,
    serverLink:string,
}

class ZiekMeld extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state={
            RoosterAndPerson:null
        }
    }

    componentDidMount() : void{
        this.getRoosterAndPerson()
    }

    getRoosterAndPerson() {
        fetch("/getRoosterAndPerson")
            .then(
                (u) => {
                    try{
                        return u.json()
                    }
                    catch(error){
                        console.error(error)
                    }
                }
            )
            .then(
                (json) => {
                    console.log(json);
                    this.setState({RoosterAndPerson:json})
                }
            )
    };

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