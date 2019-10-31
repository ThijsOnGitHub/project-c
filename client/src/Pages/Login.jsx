import React from 'react';

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={
            email:"",
            pass:""
        }
        this.lijst=["email, pass"];
        this.handleInputChange=this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


     handleSubmit=async (event)=> {
        var object = {};
        this.lijst.forEach((value) => {
            var returnValue = this.state[value]
        });
        console.log("sending");
        console.log(object);
        var result=await fetch(this.props.apiLink+"/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({email: this.state.email, pass: this.state.pass}) // body data type must match "Content-Type" header
        })
         console.log(object)


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
            <div id="Login">
                <form>
                    <table>
                        <tbody>
                        <tr>
                            <td><input type="email" id="email" name="email" placeholder="Email" value={this.state.email} onChange={this.handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><input type="password" id="pass" name="pass" placeholder="Wachtwoord" value={this.state.pass} onChange={this.handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><a href="#">Wachtwoord vergeten?</a></td>
                        </tr>
                        <tr>
                            <button onClick={this.handleSubmit}>Login</button>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        )
    }

}
export default Login