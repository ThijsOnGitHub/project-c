import React from 'react'
import {Link} from "react-router-dom";
import { ReactComponent as CalendarIcon } from "../calendar.svg";
import { ReactComponent as MoneyIcon } from "../money.svg";
import Notification from "../Components/Notification";
var API_LINK='http://localhost:5000/api';

interface IState {
    notifs:{name:string,messageType:number}[],
    content:{firstName:string,lastName:string,email:string,phone:string,birth:string,profielFotoLink:string}[],
    firstName: string,
    lastName:string,
    email: string,
    phone: string,
    birth: string,
    profielFotoLink: string,
    isWerkgever: string
}
interface IProps{
    apiLink : string
    serverLink : string
}
class Home extends React.Component<IProps,IState>{
    lijst:string[];
    constructor(props:IProps){
        super(props);
        this.state= {
            notifs:[],
            content:[],
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            birth: "",
            profielFotoLink: "",
            isWerkgever: ""
        };
        this.handleInputChange=this.handleInputChange.bind(this);
        this.lijst=["firstName","lastName","email","phone","birth","profielfoto","isWerkgever"];
        this.refreshData=this.refreshData.bind(this)
    }

    refreshData= async ()=>{
        console.log("get data");
        var request= await fetch(this.props.apiLink+"/getgebruikerinfo",{headers:{authToken:sessionStorage.getItem("authToken")}});
        var json= await request.json();
        console.log(json);
        this.setState({
            content:json
        })
    };
    componentDidMount() {
        this.getnotifs();
        this.refreshData();
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

    handleInputChange(event:React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState<never>({
            [name]: value
        });
    }

    render() {
        return(
            <div className="Home">
                <div className="underlay">
                    <h1>Welkom, <span className="weighted">{this.state.content.length>0 && this.state.content[0].firstName}</span>!</h1>
                </div>
                <div style={{textAlign: "center"}} className="LinebreakPrevent">
                    <Link to='./Rooster'>
                        <figure>
                            <CalendarIcon width="150" height="150"/>
                            <figcaption>ROOSTER</figcaption>
                        </figure>
                    </Link>
                    <Link to='./Salaris'>
                        <figure>
                            <MoneyIcon width="150" height="150"/>
                            <figcaption>SALARIS</figcaption>
                        </figure>
                    </Link>
                </div>
                <div className="LinebreakPrevent">
                    <div className='HomeInfo'>
                        <div className='HomeContents'>
                            <h1>Info</h1>
                            <p>Ingelogd als: {this.state.content.length>0 && this.state.content[0].firstName} {this.state.content.length>0 && this.state.content[0].lastName}</p>
                            <p>Volgende dienst:</p>
                        </div>
                        <img src={this.state.content.length>0 && this.state.content[0].profielFotoLink} alt='profielfoto'/>
                        <div className='Notifs'>
                            <h1>Meldingen</h1>
                            <button onClick={() => this.addNotif(2, 2, 1)}>Vakantienotificatie</button>
                            <button onClick={() => this.addNotif(1, 0, 1)}>Dienstruil notif</button>
                            <button onClick={() => this.addNotif(3, 1, 1)}>Ziek melden</button>
                            <button onClick={() => this.addNotif(27, 3, 1)}>Rooster Bijgewerkt</button>
                            <div className="notifList">
                                {this.state.notifs.map(notif => <Notification person={notif.name} messageId={notif.messageType}/>)}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

}
export default Home