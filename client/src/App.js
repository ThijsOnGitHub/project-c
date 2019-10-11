import React, { Component }from 'react';
import './App.scss';
import {BrowserRouter,Switch,Route} from "react-router-dom";
import Home from './Pages/Home'
import Menu from "./Components/Menu/Menu";
import DataTest from "./Pages/DataTest";
import Loginpage from "./Pages/Loginpage";
import {login, Register} from "./Pages/index.txs";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogginActive: true
        };
    }

    render() {
        const { isLogginActive } = this.state;
        const current = isLogginActive ? "Register" : "Login";
        return (
            <div className="App">
                <div className="login">
                    <div className="container" ref={ref => (this.container = ref)}>
                        {isLogginActive && (
                            <login containerRef={ref => (this.current = ref)} />
                        )}
                        {!isLogginActive && (
                            <Register containerRef={ref => (this.current = ref)} />
                            )}
                        )}
                        <div>

                            <BrowserRouter>
                                <Menu/>
                                <Switch>
                                    <Route path="/" exact render={() => <Home/>}/>
                                    <Route path="/DataTest" render={() => <DataTest/>}/>
                                    <Route path="/login" render={() => <Loginpage/>}/>

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