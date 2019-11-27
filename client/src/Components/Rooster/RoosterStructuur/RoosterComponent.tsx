import React, {ReactElement} from 'react'
import DagField, {DagData} from "./DagField";
import TimeMarker from "./TimeMarker";
import '../Rooster.css'
import DagTitel from "./DagTitel";
import RoosterItem from "../RoosterItems/RoosterItem";
import {TimeMarkerTypes} from './TimeMarkerTypes';
import {fullRenderItem} from "../roosterData";




interface IProps {
    startDate:Date
    eindTijd:Date
    beginTijd: Date
    height:number
    markerInterval:Date
    renderItems:fullRenderItem
}


/*
    Dit component zorgt dat er een timemarker aan de linkerkant komt en er 7 dagen daarnaast staan
    Daarnaast zorgt hij ervoor dat de begintijden en eindtijden op alle velden hetzelfde zijn
    En dat de roosterItems verdeeld worden over de dagen
 */
class RoosterComponent extends React.Component<IProps>{

    render() {
        // Hier worden alle datums die weergeven moeten worden gegenereerd
        var datums=[0,2,3,4,5,6].map((value,index) => {
            var newDate=new Date(this.props.startDate.toString());
            var newValue=newDate.getDate()+index;
            newDate.setDate(newValue);
            return newDate
        });

        // Hier wordt berekend hoeveel pixels 1 uur is
        var hourHeight=this.props.height/(this.props.eindTijd.getHours()-this.props.beginTijd.getHours());
        return(
            <div>
                <div className="rooster">
                    <div className="dag dagTitles">
                        {datums.map(value => {
                            return <DagTitel datum={value}/>
                        })}
                    </div>
                    <div className="roosterVelden ">
                        {/*Hier wordt de zijkant met de tijden gegenereerd  */}
                    <TimeMarker type={TimeMarkerTypes.time} interval={this.props.markerInterval} beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={hourHeight} height={this.props.height} />
                    <div className="row dag dagTijden">
                    {
                        datums.map(value => <DagField  datum={value} renderItems={
                            /* *1 Hier worden alle roosterItems verdeeld over de dagen d.m.v. de datum die in het object stond */
                            this.props.renderItems[value.toISOString()]||{}

                        } beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={hourHeight} height={this.props.height} markerInterval={this.props.markerInterval}/>)
                    }
                    </div>
                    </div>
                </div>


            </div>
            )
    }
}

export default RoosterComponent