import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Switch,Route} from "react-router-dom";
import Menu from "./Components/Menu/Menu";
import Registratie from "./Pages/Registratie";
import Rooster from "./Pages/Rooster";
import addFunctions from "./Values/addFunctions";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import MyAccount from "./Pages/MyAccount";


export interface IState {
    apiLink:string
    loggedIn:boolean
}



class App extends React.Component<{},IState>{

  constructor(props:object) {
      super(props);
      var options = ["http://145.24.222.80:5000", "http://localhost:5000"]
      this.state = {
          apiLink: options[1]+"/api/",
          loggedIn:false
      };
  }

  componentDidMount(): void {
      // this programm adds new string functions
      addFunctions()
  }

  changeState=(functie:(oldState:IState)=>Partial<IState>)=>{
      this.setState(oldState=>{functie(oldState)})
  }

    render(){
    return (
        <div>
            <BrowserRouter>
                <Menu/>
                <Switch>
                    <Route path="/" exact render={()=> <Login apiLink={this.state.apiLink} changeHigherState={this.changeState}/> } />
                    <Route path="/Registratie" render={()=><Registratie apiLink={this.state.apiLink}/>}/>
                    <Route path="/MyAccount" render={()=><MyAccount apiLink={this.state.apiLink}/>}/>
                    <Route path="/Rooster" render={()=><Rooster apiLink={this.state.apiLink}/>}/>
                    <Route path="/Home" render={()=><Home/>}/>
                </Switch>
              </BrowserRouter>
        </div>
    );
  }
}
export default App;
