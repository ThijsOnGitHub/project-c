import React from "react";

interface IState{
    RoosterAndPerson:{naam:string, beginTijd:string, eindTijd:string, datum:string}
}

interface IProps {
    apiLink:string,
    serverLink:string,
    roosterItemId:number
}

class ZiekMeld extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state={
            RoosterAndPerson : {naam : "" , beginTijd : "" , eindTijd : "" , datum : ""}
        }
    }

    componentDidMount() : void{
        console.log("yeehaw motherfucker");
        this.getRoosterAndPerson()
    }

    getRoosterAndPerson = () => {
        console.log("Getting person and schedule info NOW!");
        fetch(this.props.apiLink+"/getRoosterAndPerson", {method:"post",
            headers:
                {
                    authToken:sessionStorage.getItem("authToken"),
                    "content-type":"application/json"
                },
            body: JSON.stringify({roosterItemId:this.props.roosterItemId})
        })
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
                            <td align={"center"}>{this.state.RoosterAndPerson.naam} heeft zich ziek gemeld, van {this.state.RoosterAndPerson.beginTijd} tot {this.state.RoosterAndPerson.eindTijd} op {new Date(this.state.RoosterAndPerson.datum).toLocaleDateString("nl-NL", {weekday:"long", day:"numeric", month:"long", year:"numeric"})}.<br/>Wil je deze dienst overnemen?</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ZiekMeld