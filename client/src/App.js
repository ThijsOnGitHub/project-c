import React, { Component }from 'react';
import './App.css';
import {BrowserRouter,Switch,Route} from "react-router-dom";
import Home from './Pages/Home'
import Menu from "./Components/Menu/Menu";
import MenuUnderlay from "./Components/Menu/MenuUnderlay";
import DataTest from "./Pages/DataTest";

import Loginpage from "./Pages/Loginpage";
import { login } from "./Pages/index.txs";

import Registratie from "./Pages/Registratie";
import Rooster from "./Pages/Rooster";
import addStringFunctions from "./Values/addStringFunctions";




class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogginActive: true,
            apiLink:"http://localhost:5000"
        };
    }



    render() {
        addStringFunctions()
        const { isLogginActive } = this.state;
        const current = isLogginActive ? "Register" : "Login";
        return (
            <div className="App">
                <div className="login">
                    <div className="container" ref={ref => (this.container = ref)}>
                        {isLogginActive && (
                            <login containerRef={ref => (this.current = ref)} />
                        )}
                        <div>
                            <BrowserRouter>
                                <Menu/>
                                <MenuUnderlay/>
                                <Switch>
                                    <Route path="/" exact render={() => <Home/>}/>
                                    <Route path="/DataTest" render={() => <DataTest/>}/>
                                    <Route path="/login" render={() => <Loginpage/>}/>
                                    <Route path="/Registratie" render={()=><Registratie/>}/>
                                    <Route path="/Rooster" render={()=><Rooster apiLink={this.state.apiLink}/>}/>

                                </Switch>
                            </BrowserRouter>


                        </div>
                    </div>
                </div>
            </div>


        );
    }
}


export default App



