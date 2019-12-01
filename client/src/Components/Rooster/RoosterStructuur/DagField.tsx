import React, {ReactElement} from 'react'
import TimeMarker from "./TimeMarker";
import RoosterItem from "../RoosterItems/RoosterItem";
import {TimeMarkerTypes} from "./TimeMarkerTypes";


export interface IProps {
    renderItems:{[datum:string]:(RoosterData:DagData)=>ReactElement<RoosterItem>}[]
    markerInterval:Date
    eindTijd:Date
    beginTijd:Date
    hourHeight:number
    height:number
    datum:Date
}

export type DagData=Omit<IProps,'renderItems'>

class DagField extends React.Component<IProps>{
    render() {
        return(
            <div>

                <div className="DagField" style={{height:this.props.height}}>
                    <div className="DagLijnen absolute">
                        <TimeMarker interval={this.props.markerInterval} beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={this.props.hourHeight} height={this.props.height} type={TimeMarkerTypes.line}/>
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