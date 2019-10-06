import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Switch,Route} from "react-router-dom";
import Home from './Pages/Home'
import Menu from "./Components/Menu/Menu";
import DataTest from "./Pages/DataTest";
import LoginIn from "./Pages/Inlogpagina";

class App extends React.Component{

  constructor(){
    super()
  }


  render(){
    return (
        <div>

        <BrowserRouter>
            <Menu/>
            <Switch>
              <Route path="/" exact render={()=> <Home /> } />
              <Route path="/DataTest" render={()=><DataTest/>}/>
              <Route path="/Login" render={()=><LoginIn/>}/>
            </Switch>
          </BrowserRouter>
        </div>
    );
  }

}

export default App;
