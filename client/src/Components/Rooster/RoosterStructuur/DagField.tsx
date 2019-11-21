import React from 'react'
import TimeMarker from "./TimeMarker";
import {TimeMarkerTypes} from "./TimeMarkerTypes";
import {dayRenderItem} from "../../../Pages/Rooster";



export interface IProps {
    renderItems:dayRenderItem
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
                            Object.values(this.props.renderItems).map(value => {
                                console.log(this.props.renderItems);
                                return value(this.props)
                            })

                        }

                    </div>
                </div>
            </div>
        )
    }

}
export default DagField