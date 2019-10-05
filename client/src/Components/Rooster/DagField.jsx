import React from 'react'
import DagTitel from "./DagTitel";
import RoosterItem from "./RoosterItem";
import TimeMarker from "./TimeMarker";
class DagField extends React.Component{

    constructor(){
        super()
    }

    componentDidMount() {
    }

    render() {

        return(
            <div>
                <DagTitel datum={this.props.datum}/>
                <div className="DagField" style={{height:this.props.height}}>
                    <div className="DagLijnen absolute">
                        <TimeMarker interval={this.props.markerInterval}beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={this.props.hourHeight} height={this.props.height} type="line"/>
                    </div>
                    <div className="Items absolute">
                        {this.props.dagJSON.map(value => {
                            console.log(new Date(value.eindTijd))
                            return <RoosterItem roosterData={this.props} beginTijd={new Date(value.beginTijd)} eindTijd={new Date(value.eindTijd)}/>
                        })}
                    </div>
                </div>
            </div>
        )
    }

}
export default DagField