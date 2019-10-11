import React from 'react'
import {Link} from "react-router-dom";

import Notification from "../Components/Notification";

class Home extends React.Component{
    constructor(){
        super()
        this.state={
            uname:"",
            pass:""
        }
        this.handleInputChange=this.handleInputChange.bind(this)
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
        const username = "User";
        var notifs = [{
            "id" : "1",
                "person" : "John Magellan",
                "messageType" : "3"
        },
        {
            "id" : "2",
            "person" : "Hendrik Groen",
            "messageType" : "2"
        },
        {
            "id" : "3",
            "person" : "Duikbroek Verheemst",
            "messageType" : "1"
        },
        {
            "id" : "40,",
            "person" : "Geel Hoofd",
            "messageType" : "4"
        },
            {
                "id" : "40,",
                "person" : "Geel Hoofd",
                "messageType" : "4"
            },
            {
                "id" : "40,",
                "person" : "Geel Hoofd",
                "messageType" : "4"
            },
            {
                "id" : "40,",
                "person" : "Geel Hoofd",
                "messageType" : "4"
            },
            {
                "id" : "40,",
                "person" : "Geel Hoofd",
                "messageType" : "4"
            },
            {
                "id" : "40,",
                "person" : "Geel Hoofd",
                "messageType" : "4"
            },
            {
                "id" : "40,",
                "person" : "Geel Hoofd",
                "messageType" : "4"
            },
            {
                "id" : "40,",
                "person" : "Geel Hoofd",
                "messageType" : "4"
            },
            {
                "id" : "40,",
                "person" : "Geel Hoofd",
                "messageType" : "4"
            },
            {
                "id" : "40,",
                "person" : "Geel Hoofd",
                "messageType" : "4"
            },
            {
                "id" : "40,",
                "person" : "Geel Hoofd",
                "messageType" : "4"
            },
            {
                "id" : "40,",
                "person" : "Geel Hoofd",
                "messageType" : "4"
            },
        ];
        return(
            <div className="Home">
                <h1 align="center" style={{paddingTop: 20}}>Welcome, {username}!</h1>
                <div align='center' className="LinebreakPrevent">
                    <Link to='./Rooster'>
                        <figure>
                            <img src='https://svgshare.com/i/FKH.svg' alt="Calendar Icon" width='150'/>
                            <figcaption>ROOSTER</figcaption>
                        </figure>
                    </Link>
                    <Link to='./Salaris'>
                        <figure>
                            <img src='https://svgshare.com/i/FL7.svg' alt="money" width='150'/>
                            <figcaption>SALARIS</figcaption>
                        </figure>
                    </Link>
                </div>
                <div className="LinebreakPrevent">
                    <img className='ScheduleImg' src="https://imgur.com/Y8x0HaC.png" alt="schedule placeholder"/>
                    <div className='Notifs'>
                        <h1>Meldingen</h1>
                        <div className="notifList">
                            {notifs.map(notif => <Notification key={notif.id} person={notif.person} messageId={notif.messageId}/>)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
export default Home