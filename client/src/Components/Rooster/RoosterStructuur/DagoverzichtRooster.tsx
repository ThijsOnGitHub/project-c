import React from 'react'
import DagField, {DagData} from "./DagField";
import TimeMarker from "./TimeMarker";
import '../Rooster.css'
import {TimeMarkerTypes} from './TimeMarkerTypes';


interface IProps {
    eindTijd:Date
    beginTijd: Date
    width:number
    markerInterval:Date
    renderItems:WerknemerRenderObject
}

export interface WerknemerRenderObject{
    naam:string
    userId:string
    function:DagData
}

/*
    Dit component zorgt dat er een timemarker aan de linkerkant komt en er 7 dagen daarnaast staan
    Daarnaast zorgt hij ervoor dat de begintijden en eindtijden op alle velden hetzelfde zijn
    En dat de roosterItems verdeeld worden over de dagen
 */
class DagoverzichtRooster extends React.Component<IProps>{

    render() {
        // Hier wordt berekend hoeveel pixels 1 uur is
        var hourHeight=this.props.width/((this.props.eindTijd.getHours()+this.props.eindTijd.getMinutes()/60)-(this.props.beginTijd.getHours()+this.props.beginTijd.getMinutes()/60));
        return(
            <div>
                <div className="rooster">
                    <div className="roosterVelden ">
                        {/*Hier wordt de zijkant met de tijden gegenereerd  */}
                    <TimeMarker type={TimeMarkerTypes.time} interval={this.props.markerInterval} beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={hourHeight} height={this.props.width} />
                    <div className="row dag dagTijden">
                    {
                        Object.entries(this.props.renderItems).map(value => <DagField  renderItems={
                            /* *1 Hier worden alle roosterItems verdeeld over de dagen d.m.v. de datum die in het object stond */
                            //this.props.renderItems[value.toISOString()]||{}
                                {}
                        } beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={hourHeight} height={this.props.width} markerInterval={this.props.markerInterval}/>)
                    }
                    </div>
                    </div>
                </div>
            </div>
            )
    }
}

export default DagoverzichtRooster