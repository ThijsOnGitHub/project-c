import React from 'react'
import {Link} from "react-router-dom";

import Notification from "../Components/Notification";

class Home extends React.Component{
    constructor(){
        super()
    }

    render() {
        const username = "User";
        return(
            <div className="Home">
                <h1 align="center" style={{paddingTop: 20}}>Welcome, {username}!</h1>
                <div align='center' className="LinebreakPrevent">
                    <Link to='./Rooster'>
                        <figure>
                            <img src='https://svgshare.com/i/FKH.svg' alt="Calendar Icon" width='150'/>
                            <figcaption>SCHEDULE</figcaption>
                        </figure>
                    </Link>
                    <Link to='./Salaris'>
                        <figure>
                            <img src='https://svgshare.com/i/FL7.svg' alt="money" width='150'/>
                            <figcaption>SALARY</figcaption>
                        </figure>
                    </Link>
                </div>
                <div className="LinebreakPrevent">
                    <img className='ScheduleImg' src="https://imgur.com/Y8x0HaC.png" alt="schedule placeholder"/>
                    <div className='Notifs'>
                        <h1>Notifications</h1>
                        <Notification/>
                    </div>
                </div>
            </div>
        )
    }

}
export default Home