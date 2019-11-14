import React from 'react';
import './App.css';
import {BrowserRouter,Switch,Route} from "react-router-dom";
import Menu from "./Components/Menu/Menu";
import Registratie from "./Pages/Registratie";
import EmailVerificatie from "./Pages/EmailVerificatie";
import RoosterView from "./Pages/RoosterView";
import addFunctions from "./Values/addFunctions";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import MyAccount from "./Pages/MyAccount";
import * as jsonwebtoken from 'jsonwebtoken'
import loadingIcon from "./img/Loding-Icon-zwart.gif";

export interface IState {
    apiLink:string
    serverLink:string
    loggedIn:boolean
    logoutTimeout:number
    loading:boolean
    exp:number
    isWerkgever:boolean
}

class App extends React.Component<{},IState>{
  constructor(props:object) {
      super(props);
      var options = ["http://145.24.222.80:5000", "http://localhost:5000"]
      var server= options[1]
      this.state = {
          apiLink: server+"/api",
          serverLink:server,
          exp:0,
          loggedIn:false,
          logoutTimeout:null,
          loading:false,
          isWerkgever:false
      };
      // this programm adds new string functions
      addFunctions()
  }

  componentDidMount=async ():Promise<void>=> {
      this.setState({loading:true})
      await this.updateAuth()
      this.setState({loading:false})

  }

  getJWTOjbect=(jwt:string)=>{
      const jwtObject=jsonwebtoken.decode(jwt)
      console.log(jwtObject)
      if(typeof jwtObject!=="string"){
          return jwtObject
      }
      return null
  }

  updateStateFromJWT=(jwt:string)=>{
      this.setState<never>(this.getJWTOjbect(jwt))
  }

  updateAuth=async ()=>{
      console.log("update")
      const refreshToken=localStorage.getItem("refreshToken")
      const authToken=sessionStorage.getItem("authToken")
      if(authToken!==null){
          this.setState({loggedIn:true})
          this.updateStateFromJWT(authToken)
      }else if(refreshToken!==null){
              const result=await fetch(this.state.serverLink+"/auth/refresh",{
                  headers:{
                      refreshToken:refreshToken
                  }
              })
              const status=result.status
              if(status===200){
                  var tekst=await result.text()
                  this.setState({loggedIn:true})
                  this.updateStateFromJWT(tekst)
                  sessionStorage.setItem("authToken",tekst)
              }else{
                  this.setState({loggedIn:false})
                  localStorage.removeItem("refreshToken")
              }
      }else{
          this.setState({loggedIn:false})
      }
  }

  changeState=(functie:(oldState:IState)=>Partial<IState>)=>{
      this.setState<never>(oldState=> {return functie(oldState)} )
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<IState>, snapshot?: any): void {
      if (prevState.exp!==this.state.exp){
          if(this.state.logoutTimeout!==null){
              clearTimeout(this.state.logoutTimeout)
          }
          if(this.state.exp!==0){
              var timeOut=window.setTimeout(()=>{
                  sessionStorage.removeItem("authToken")
                  this.updateAuth()
              },this.state.exp*1000-Date.now())
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
                {
                    this.state.loading?
                    <div className="center">
                        <img src={loadingIcon} width={300} style={{margin:"auto"}}/>
                    </div>:
                    <div>

                        <Switch>
                            <Route path={"/emailverificatie/:email"} render={(props:{match:{params:{email:string}}}) => <EmailVerificatie apiLink={this.state.apiLink} email={props.match.params.email}/>}/>
                            {
                                this.state.loggedIn ?
                                    <Switch>
                                        <Route path="/MyAccount" render={() => <MyAccount apiLink={this.state.apiLink} serverLink={this.state.serverLink}/>}/>
                                        <Route path="/" exact render={() => <Home/>}/>
                                        {
                                            this.state.isWerkgever?
                                                <Switch>

                                                </Switch>:
                                                <Switch>
                                                    <Route path="/Rooster" render={() => <RoosterView apiLink={this.state.apiLink}/>}/>
                                                </Switch>
                                        }
                                    </Switch>
                                    :
                                    <Switch>
                                        <Route path="/registratie" render={() => <Registratie apiLink={this.state.apiLink}/>}/>
                                        <Route path="/" render={() => <Login updateAuth={this.updateAuth} apiLink={this.state.apiLink} changeHigherState={this.changeState} serverLink={this.state.serverLink}/>}/>
                                    </Switch>
                            }
                        </Switch>
                    </div>
                }

              </BrowserRouter>
        </div>
    );
  }
}
export default App;
