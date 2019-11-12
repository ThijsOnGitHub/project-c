import React from "react";
import Notification from "../Components/Notification";

interface IProps{
    apiLink:string
}

interface IState{
    notifs:{name:string,messageType:number,profielFotoLink:string}[]
}

class NotifList extends React.Component<IProps, IState> {

    constructor(props:IProps) {
        super(props);
        this.state={
            notifs:[]
        }
    }

    componentDidMount() : void{
        this.getnotifs()
    }

    addNotif(person:number, messageId:number, bedrijfId:number) {
        fetch(
            "http://localhost:5000/api/addnotif", {
                method:"post",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    "person": person,
                    "messageId": messageId,
                    "bedrijfId": bedrijfId
                })
            }
        )
    }

    getnotifs = () => {
        fetch("http://localhost:5000/api/getnotifs")
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
                    this.setState({notifs:json})
                }
            )
    };


    render() {
        return(
            <div className='Notifs'>
                <h1>Meldingen</h1>
                <button onClick={() => this.addNotif(2, 2, 1)}>Vakantienotificatie</button>
                <button onClick={() => this.addNotif(1, 0, 1)}>Dienstruil notif</button>
                <button onClick={() => this.addNotif(3, 1, 1)}>Ziek melden</button>
                <button onClick={() => this.addNotif(27, 3, 1)}>Rooster Bijgewerkt</button>
                <div className="notifList">
                    {this.state.notifs.map(notif => <Notification person={notif.name} messageId={notif.messageType} imageLink={notif.profielFotoLink} apiLink={this.props.apiLink}/>)}
                </div>
            </div>
        )
    }
}

export default NotifList