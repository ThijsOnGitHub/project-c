import React from 'react'
import {Link} from "react-router-dom";

class Home extends React.Component{
    constructor(){
        super()
    }

    render() {
        return(
            <div className="Home">
                <p align="center">This is a line. I will now edit this line, so that it may become meaningful.</p>
                <h1 align="center">Welcome to Planit.</h1>
                <div align='center' className="LinebreakPrevent">
                    <Link to='./Rooster'>
                        <figure>
                            <img src='https://svgshare.com/i/FKH.svg' alt="Calendar Icon" width='150' height='150'/>
                            <figcaption>SCHEDULE</figcaption>
                        </figure>
                    </Link>
                    <Link to='./Salaris'>
                        <figure>
                            <img src='https://svgshare.com/i/FL7.svg' alt="money" width='150' height='150'/>
                            <figcaption>SALARY</figcaption>
                        </figure>
                    </Link>
                </div>
            </div>
        )
    }

}
export default Home