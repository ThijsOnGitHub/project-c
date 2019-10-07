import React from 'react'
import {Link} from "react-router-dom";
import notifComponent from "./"

import Notification from "../Components/Notification";

class Home extends React.Component{
    constructor(){
        super()
    }

    render() {
        const username = "User";
        const notifComponent = dbNotifsmap(notif => <Notification key={notif.id} person={notif.person} messageId={notif.messageId}/>);
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
                        {notifComponent}
                    </div>
                </div>
            </div>
        )
    }

}
export default Home