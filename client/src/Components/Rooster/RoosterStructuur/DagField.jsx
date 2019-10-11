import React from 'react'
import DagTitel from "./DagTitel";
import RoosterItem from "../RoosterItems/RoosterItem";
import TimeMarker from "./TimeMarker";
class DagField extends React.Component{

    constructor(){
        super()
    }

    componentDidMount() {
    }

    render() {
        console.log(this.props.renderItems)
        return(
            <div>

                <div className="DagField" style={{height:this.props.height}}>
                    <div className="DagLijnen absolute">
                        <TimeMarker interval={this.props.markerInterval}beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={this.props.hourHeight} height={this.props.height} type="line"/>
                    </div>
                    <div className="Items absolute">
                        {
                            // Hier wordt het rooster items echt uitgevoerd en geplaasts
                            this.props.renderItems.map(value=>{
                                return Object.values(value)[0](this.props)
                            })
                        }

                    </div>
                </div>
            </div>
        )
    }

}
export default DagField