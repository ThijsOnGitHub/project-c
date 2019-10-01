import React from 'react'



class DagTitel extends React.Component{
    constructor(){
        super()
    }

    render() {

        return(
        <div>

            <h1 className="centerText">{this.props.datum.toLocaleDateString("nl-NL",{weekday:"long"}).capitalFirst()}</h1>
            <p className="centerText">{this.props.datum.toLocaleDateString("nl-NL",{day:"2-digit"})+"-"+this.props.datum.toLocaleDateString("nl-NL",{month:"long"}).capitalFirst()}</p>

            <div>
            </div>
        </div>
        )
    }
}
export default DagTitel