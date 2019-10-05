import React from 'react'
import DagField from "./DagField";
import TimeMarker from "./TimeMarker";
import './Rooster.css'


/*
    Dit component zorgt dat er een timemarker aan de linkerkant komt en er 7 dagen daarnaast staan
    Daarnaast zorgt hij ervoor dat de begintijden en eindtijden op alle velden hetzelfde zijn
 */
class RoosterComponent extends React.Component{

    constructor(){
        super()
    }


    render() {
        // Hier worden alle datums die weergeven moeten worden gegenereerd
        var datums=[0,1,2,3,4,5,6].map((value,index) => {
            var newDate=new Date(this.props.startDate.toString())
            var newValue=newDate.getDate()+index
            newDate.setDate(newValue)
            return newDate
        })

        // Hier wordt berekend hoeveel pixels 1 uur is
        var hourHeight=this.props.height/(this.props.eindTijd.getHours()-this.props.beginTijd.getHours())
        return(
            <div>
                <div className="agendaFields">
                    <div style={{marginTop:132}}>
                        {/*Hier wordt de zijkant met de tijden gegenereerd  */}
                        <TimeMarker interval={this.props.markerInterval} beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={hourHeight} height={this.props.height} />
                    </div>
                    <div className="dagFields">
                    {
                        // Hier worden alle dagVelden gemaakt

                        datums.map(value => <DagField datum={value}

                            // Aan deze velden word json waarvan de dag hetzelfde is als de dag die wordt weergegeven
                          dagJSON={this.props.agendaJSON.filter(value1 => {
                            var datum=new Date(value1.datum)
                            return datum.getTime()===value.getTime()
                            }
                        )} beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={hourHeight} height={this.props.height} markerInterval={this.props.markerInterval}/>)
                    }
                    </div>
                </div>


            </div>
            )
    }
}
export default RoosterComponent