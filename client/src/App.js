import React, { Component }from 'react';
import './App.css';
import logo from './logo.svg'
import {BrowserRouter,Switch,Route} from "react-router-dom";
import Home from './Pages/Home'
import Menu from "./Components/Menu/Menu";
import DataTest from "./Pages/DataTest";



class App extends React.Component {

    constructor() {
        super()
    }




render()
{
    return (
        <div>

            <BrowserRouter>
                <Menu/>
                <Switch>
                    <Route path="/" exact render={() => <Home/>}/>
                    <Route path="/DataTest" render={() => <DataTest/>}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
  }
}

export default App