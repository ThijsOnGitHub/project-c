import React from 'react';
import {IState as AppState} from "../App";


interface IProps {
    apiLink:string
    serverLink:string
}

interface IState {

}


class Melding extends React.Component<IProps,IState>{
    constructor(props:IProps){
        super(props)
        this.state={
            email:"",
            pass:"",
            loading:false,
            error:""
        }
    }

    render() {

        return(
            <div id="Login">
                <form>
                    <table>
                        <tbody>
                        <tr>
                            Test
                        </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        )
    }

}
export default Melding