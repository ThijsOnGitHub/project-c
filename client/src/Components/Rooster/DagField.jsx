import React from 'react'
import DagTitel from "./DagTitel";
class DagField extends React.Component{

    constructor(){
        super()
    }

    render() {
        return(
            <div>
                <DagTitel datum={this.props.datum}/>
                <div className="DagField" style={{height:this.props.height,border:"black solid 2px",position:"relative"}}>
                    <div className="DagLijnen">

                    </div>
                </div>
            </div>
        )
    }

}
export default DagField