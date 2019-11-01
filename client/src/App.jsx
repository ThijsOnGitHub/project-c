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


class App extends React.Component{

  constructor(){
    super();
  var options=["http://145.24.222.80:5000","http://localhost:5000"]
    this.state={
        apiLink:options[1]
    }
  }



  render(){
      // this programm adds new string functions
      addFunctions()
    return (
        <div>
        <BrowserRouter>
            <Menu/>
            <MenuUnderlay/>
            <Switch>
              <Route path="/" exact render={()=> <Login /> } />
              <Route path="/Registratie" render={()=><Registratie apiLink={this.state.apiLink}/>}/>
              <Route path="/Rooster" render={()=><Rooster apiLink={this.state.apiLink}/>}/>
              <Route path="/Home" render={()=><Home/>}/>
            </Switch>
          </BrowserRouter>
        </div>
    );
  }
}
export default App;
