import React from "react";
import {Link} from "react-router-dom";

interface IState{
    RoosterAndPerson:{
        naam:string,
        beginTijd:string,
        eindTijd:string,
        datum:string,
        userId:number
    }
}

interface IProps {
    apiLink:string,
    serverLink:string,
    roosterItemId:number,
    notifId:number,
    currentUser:number
}

class ZiekMeld extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state={
            RoosterAndPerson : {
                naam : "" ,
                beginTijd : "" ,
                eindTijd : "" ,
                datum : "",
                userId:null
            }
        }
    }

    componentDidMount() : void{
        this.getRoosterAndPerson()
    }

    accept = () => {
        console.log("Changing schedule item to new user...");
        fetch(this.props.apiLink+"/ziekAccept", {method:"post",
            headers:{
                authToken:sessionStorage.getItem("authToken"),
                "content-type":"application/json"
            },
            body: JSON.stringify({roosterItemId:this.props.roosterItemId})
        });
        fetch(this.props.apiLink+'/delNotif', {method:'post',
            headers:{
                authToken:sessionStorage.getItem('authToken'),
                "content-type":"application/json"
            },
            body:JSON.stringify({notifId:this.props.notifId})})
    };

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
                            <td align={"center"}>{(this.state.RoosterAndPerson.userId == this.props.currentUser) ? "Je hebt jezelf ziek gemeld op " + new Date(this.state.RoosterAndPerson.datum).toLocaleDateString("nl-NL", {weekday:"long", day:"numeric", month:"long", year:"numeric"}) + " van " + this.state.RoosterAndPerson.beginTijd + " tot " + this.state.RoosterAndPerson.eindTijd + ".\n Wil je je ziektemelding annuleren?" : this.state.RoosterAndPerson.naam + " heeft zich ziek gemeld, van " + this.state.RoosterAndPerson.beginTijd + " tot " + this.state.RoosterAndPerson.eindTijd + " op " + new Date(this.state.RoosterAndPerson.datum).toLocaleDateString("nl-NL", {weekday:"long", day:"numeric", month:"long", year:"numeric"}) + ".\nWil je deze dienst overnemen?"}</td>
                        </tr>
                        <tr>
                            <Link to={"/"}><button className="Button" onClick={this.accept}>Ja</button></Link>
                            <Link to={"/"}><button className="Button">Nee</button></Link>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ZiekMeld