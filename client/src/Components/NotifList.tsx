import React         from "react";
import Notification  from "../Components/Notification";
import werkgever from "../App"

interface IProps{
    apiLink:string
    isWerkgever:string
}

interface IState{
    notifs:{name:string,messageType:number,profielFotoLink:string, roosterItemId:number, notifId:number, isForBoss:boolean}[],
    bossNotifs:{name:string,messageType:number,profielFotoLink:string, roosterItemId:number, notifId:number, isForBoss:boolean}[]
}

class NotifList extends React.Component<IProps, IState> {

    constructor(props:IProps) {
        super(props);
        this.state={
            notifs:[],
            bossNotifs:[]
        }
    }

    componentDidMount() : void{
        this.getnotifs(false);
        console.log("Werkgever: ", this.props.isWerkgever);
        if (this.props.isWerkgever) {
            this.getnotifs(true)
        }
    }


    getnotifs = (isForBoss:boolean) => {
        fetch("http://localhost:5000/api/getnotifs", {method:'post',
            headers:{
                authToken:sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({"isForBoss":isForBoss})
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
                    (!isForBoss) ? this.setState({notifs:json}) : this.setState({bossNotifs:json})
                }
            )
    };


    render() {
        return(
            <div className='Notifs'>
                <h1>Meldingen</h1>
                <div className='notifList'>
                    {this.state.bossNotifs.map(notif => <Notification person={notif.name} messageId={notif.messageType} imageLink={notif.profielFotoLink} apiLink={this.props.apiLink} roosterItemId={notif.roosterItemId} notifId={notif.notifId}/>)}
                </div>

                <div className="notifList">
                    {this.state.notifs.map(notif => <Notification person={notif.name} messageId={notif.messageType} imageLink={notif.profielFotoLink} apiLink={this.props.apiLink} roosterItemId={notif.roosterItemId} notifId={notif.notifId}/>)}
                </div>
            </div>
        )
    }
}

export default NotifList