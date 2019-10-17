import React from 'react'
import {Link} from "react-router-dom";
import { ReactComponent as CalendarIcon } from "../calendar.svg";
import { ReactComponent as MoneyIcon } from "../money.svg";

import Notification from "../Components/Notification";

class Home extends React.Component{
    constructor(){
        super();
        this.state={
            uname:"",
            pass:""
        };
        this.handleInputChange=this.handleInputChange.bind(this)
    }
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
        const notifs = [{
            "id": "1",
            "person": "John Magellan",
            "messageType": "2"
        },
            {
                "id": "2",
                "person": "Hendrik Groen",
                "messageType": "1"
            },
            {
                "id": "3",
                "person": "Duikbroek Verheemst",
                "messageType": "0"
            },
            {
                "id": "40,",
                "person": "Geel Hoofd",
                "messageType": "3"
            },
            {
                "id": "40,",
                "person": "Geel Hoofd",
                "messageType": "3"
            },
            {
                "id": "40,",
                "person": "Geel Hoofd",
                "messageType": "3"
            },
            {
                "id": "40,",
                "person": "Geel Hoofd",
                "messageType": "3"
            },
            {
                "id": "40,",
                "person": "Geel Hoofd",
                "messageType": "3"
            },
            {
                "id": "40,",
                "person": "Geel Hoofd",
                "messageType": "3"
            },
            {
                "id": "40,",
                "person": "Geel Hoofd",
                "messageType": "2"
            },
            {
                "id": "40,",
                "person": "Geel Hoofd",
                "messageType": "1"
            },
            {
                "id": "40,",
                "person": "Geel Hoofd",
                "messageType": "0"
            },
            {
                "id": "40,",
                "person": "Geel Hoofd",
                "messageType": "0"
            },
            {
                "id": "40,",
                "person": "Geel Hoofd",
                "messageType": "0"
            },
            {
                "id": "40,",
                "person": "Geel Hoofd",
                "messageType": "2"
            },
        ];
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
                <div>
                    <button onClick={(() => {this.addNotif(2, 2, 1)})}>Voeg Notificatie Toe (tijdelijk)</button>
                </div>
                <div className="LinebreakPrevent">
                    <img className='ScheduleImg' src="https://imgur.com/Y8x0HaC.png" alt="schedule placeholder"/>
                    <div className='Notifs'>
                        <h1>Meldingen</h1>
                        <div className="notifList">
                            {notifs.map(notif => <Notification key={notif.id} person={notif.person} messageId={notif.messageType}/>)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
export default Home