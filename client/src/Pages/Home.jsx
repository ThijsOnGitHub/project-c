import React from 'react'
import {Link} from "react-router-dom";
var API_LINK='http://localhost:5000/api';



class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
         email: '',
         pass: ''
        };

     this.lijst=["email", "pass"];
     this.handleSubmit = this.handleSubmit.bind(this);
     }

    handleSubmit() {
        var object = {};
        this.lijst.forEach((value) => {
            object[value] = this.state[value]
        });
        console.log("sending");
        console.log(object);
        fetch(API_LINK+"/addgebruiker",{method:"POST",
            body:JSON.stringify(object),
            headers:{
                "content-type":"application/json"
            }}).then((value)=>{
            value.json().then(value1 => {console.log(value1.message)})
        });
    }

        render(){
            return (

                <div className="base-container" ref={this.props.containerRef}>
                    <div className="header">Login</div>
                    <div className="content">
                        <br/>
                        <div className="form">
                            <div className="form-group">
                                <label htmlFor="username">Email</label>
                                <input type="text" name="Username" placeholder="Email"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" placeholder="password"/>
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <button type="button" className="btn">
                            Login
                        </button>
                    </div>
                </div>
            );
        }


}
export default Home