import React from 'react';
import {IState as AppState} from "../App";
import * as jsonwebtoken from 'jsonwebtoken'

interface IProps {
    apiLink:string
    serverLink:string
    changeHigherState:(functie:(oldState:AppState)=>Partial<AppState>)=>void
}

interface IState {
    email:string
    pass:string
    loading:boolean
    error:string
}


class Login extends React.Component<IProps,IState>{
    constructor(props:IProps){
        super(props)
        this.state={
            email:"",
            pass:"",
            loading:false,
            error:""
        }
    }


     handleSubmit=async (event:React.MouseEvent<HTMLButtonElement,MouseEvent>)=> {
        this.setState({loading:true})
        event.preventDefault()
         if(localStorage.getItem("refreshToken")===null) {
             var result = await fetch(this.props.serverLink + "/auth/login", {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 credentials: "include",
                 body: JSON.stringify({email: this.state.email, pass: this.state.pass})// body data type must match "Content-Type" header
             })
             if (result.status === 200) {
                 var token = await result.json()
                 console.log(result.status)
                 localStorage.setItem("refreshToken", token.refreshToken)
                 sessionStorage.setItem("authToken", token.sessionToken)
                 let tokenObject = jsonwebtoken.decode(token.sessionToken)
                 if (typeof tokenObject !== "string") {
                     var exp = tokenObject.exp
                     this.props.changeHigherState((oldstate) => {
                         return {authEnd: exp, loggedIn: true}
                     })
                 }
             } else {
                 var text = await result.text()
                 console.log(text)
                 this.setState({error: text})
             }
         }else {
             this.props.changeHigherState(oldState => {return{loggedIn:true,authEnd:(Date.now()+200)/1000}})
         }
     this.setState({loading:false})
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
                            <td><input type="email" className={this.state.error.length!==0 && "error"} id="email" name="email" placeholder="Email" value={this.state.email} onChange={this.handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><input type="password" className={this.state.error.length!==0 && "error"} id="pass" name="pass" placeholder="Wachtwoord" value={this.state.pass} onChange={this.handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td><a href="#">Wachtwoord vergeten?</a></td>
                        </tr>
                        <tr>
                            <td className="center errorMessage">{this.state.error}</td>
                        </tr>
                        <tr>
                        {
                            this.state.loading
                                ?
                                <p id='msg'>Loading...</p>
                                :
                                <button onClick={this.handleSubmit}>Login</button>

                        }
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        )
    }

}
export default Login