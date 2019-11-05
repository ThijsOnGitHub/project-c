import React from 'react';
import './App.css';
import {BrowserRouter,Switch,Route} from "react-router-dom";
import Menu from "./Components/Menu/Menu";
import Registratie from "./Pages/Registratie";
import EmailVerificatie from "./Pages/EmailVerificatie";
import Rooster from "./Pages/Rooster";
import addFunctions from "./Values/addFunctions";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import MyAccount from "./Pages/MyAccount";
import * as jsonwebtoken from 'jsonwebtoken'

export interface IState {
    apiLink:string
    serverLink:string
    authEnd:number
    loggedIn:boolean
    logoutTimeout:number
}

class App extends React.Component<{},IState>{
  constructor(props:object) {
      super(props);
      var options = ["http://145.24.222.80:5000", "http://localhost:5000"]
      var server= options[1]
      this.state = {
          apiLink: server+"/api",
          serverLink:server,
          authEnd:0,
          loggedIn:false,
          logoutTimeout:null
      };
      // this programm adds new string functions
      addFunctions()
  }

  componentDidMount=async ():Promise<void>=> {
      this.updateAuth()

  }

  getExp=(jwt:string)=>{
      const jwtObject=jsonwebtoken.decode(jwt)
      if(typeof jwtObject!=="string"){
          return jwtObject.exp
      }
      return null
  }

  updateAuth=async ()=>{
      const authToken=sessionStorage.getItem("authToken")
      if(authToken!==null){
          this.setState({loggedIn:true,authEnd:this.getExp(authToken)})
      }else{
          const refreshToken=localStorage.getItem("refreshToken")
          if(refreshToken!==null){
              const result=await fetch(this.state.serverLink+"/auth/refresh",{
                  headers:{
                      refreshToken:refreshToken
                  }
              })
              const status=result.status
              if(status===200){
                  var tekst=await result.text()
                  this.setState({loggedIn:true,authEnd:this.getExp(tekst)})
                  sessionStorage.setItem("authToken",tekst)
              }else{
                  this.setState({loggedIn:false})
                  localStorage.removeItem("refreshToken")
              }
          }
      }
  }

  changeState=(functie:(oldState:IState)=>Partial<IState>)=>{
      this.setState<never>(oldState=> {return functie(oldState)} )
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<IState>, snapshot?: any): void {
      if (prevState.authEnd!==this.state.authEnd){
          if(this.state.logoutTimeout!==null){
              clearTimeout(this.state.logoutTimeout)
          }
          if(this.state.authEnd!==0){
              var timeOut=window.setTimeout(()=>{
                  sessionStorage.removeItem("authToken")
                  this.updateAuth()
              },this.state.authEnd*1000-Date.now())
              this.setState({logoutTimeout:timeOut})
          }
      }
  }

  logout=()=>{
      fetch(this.state.serverLink+"/auth/logout",{method:"Delete",
      headers:{
          refreshToken:localStorage.getItem("refreshToken")
      }})
      localStorage.removeItem("refreshToken")
      sessionStorage.removeItem("authToken")
      clearTimeout(this.state.logoutTimeout)
      this.setState({loggedIn:false,logoutTimeout:null})
  }

    render(){
    return (
        <div>
            <BrowserRouter>
                <Menu logoutFunction={this.logout} loggedIn={this.state.loggedIn}/>
                <Switch>
                    {
                        this.state.loggedIn ?
                            <Switch>
                                <Route path="/MyAccount" render={() => <MyAccount apiLink={this.state.apiLink} serverLink={this.state.serverLink}/>}/>
                                <Route path="/Rooster" render={() => <Rooster apiLink={this.state.apiLink}/>}/>
                                <Route path="/" render={() => <Home/>}/>
                            </Switch>
                            :
                            <Switch>
                                <Route path="/registratie" render={() => <Registratie apiLink={this.state.apiLink}/>}/>
                                <Route path="/" render={() => <Login apiLink={this.state.apiLink} changeHigherState={this.changeState} serverLink={this.state.serverLink}/>}/>
                            </Switch>
                    }
                </Switch>
              </BrowserRouter>
        </div>
    );
  }
}
export default App;
