import React from 'react';
import {IState as AppState} from "../App";

interface IProps {
    apiLink:string
    changeHigherState:(functie:(oldState:AppState)=>Partial<AppState>)=>void
}

interface IState {
    email:string
    pass:string
}


class Login extends React.Component<IProps,IState>{
    constructor(props:IProps){
        super(props)
        this.state={
            email:"",
            pass:""
        }
    }


     handleSubmit=async (event:React.MouseEvent<HTMLButtonElement,MouseEvent>)=> {
        event.preventDefault()
        var result=await fetch(this.props.apiLink+"/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({email: this.state.email, pass: this.state.pass}) // body data type must match "Content-Type" header
        })
         console.log(result.status)
         alert(result.status)

         if(result.status===200){
             alert("I hope you can pass")
             this.props.changeHigherState((oldstate)=>{
                 return {loggedIn:true}
             })
         }else{
             alert("You shall not pass")
         }


    }

    handleInputChange=(event:React.ChangeEvent<HTMLInputElement>)=> {
        const target = event.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState<never>({
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