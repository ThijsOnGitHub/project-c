import React from 'react'
import {Link} from "react-router-dom";
import { ReactComponent as CalendarIcon } from "../calendar.svg";
import { ReactComponent as MoneyIcon } from "../money.svg";

import Notification from "../Components/Notification";

class Home extends React.Component{
    constructor(){
        super();
        this.state= {
            uname: "",
            pass: "",
            notifs: []
        };
        this.handleInputChange=this.handleInputChange.bind(this)
    }
    componentDidMount() {
        this.getnotifs();
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
    addNotif(person, messageId, bedrijfId) {
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

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return(
            <div className="Home">
                <div align='center' className="LinebreakPrevent">
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
                    <img className='ScheduleImg' src="https://imgur.com/Y8x0HaC.png" alt="schedule placeholder"/>
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
        )
    }

}
export default Home