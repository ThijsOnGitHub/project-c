import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Switch,Route} from "react-router-dom";
import Home from './Pages/Home'
import Menu from "./Components/Menu/Menu";
import MenuUnderlay from "./Components/Menu/MenuUnderlay";
import DataTest from "./Pages/DataTest";
import Registratie from "./Pages/Registratie";
import Rooster from "./Pages/Rooster";
import addStringFunctions from "./Values/addStringFunctions";

class App extends React.Component{

  constructor(){
    super()
    this.state={
        apiLink:"http://localhost:5000"
    }
  }



  render(){
      // this programm adds new string functions
      addStringFunctions()
    return (
        <div>
        <BrowserRouter>
            <Menu/>
            <MenuUnderlay/>
            <Switch>
              <Route path="/" exact render={()=> <Home /> } />
              <Route path="/DataTest" render={()=><DataTest/>}/>
              <Route path="/Registratie" render={()=><Registratie/>}/>
              <Route path="/Rooster" render={()=><Rooster apiLink={this.state.apiLink}/>}/>
            </Switch>
          </BrowserRouter>
        </div>
    );
  }
}
export default App;
