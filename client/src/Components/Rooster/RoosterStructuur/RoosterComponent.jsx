import React from 'react'
import DagField from "./DagField";
import TimeMarker from "./TimeMarker";
import '../Rooster.css'
import DagTitel from "./DagTitel";



/*
    Dit component zorgt dat er een timemarker aan de linkerkant komt en er 7 dagen daarnaast staan
    Daarnaast zorgt hij ervoor dat de begintijden en eindtijden op alle velden hetzelfde zijn
    En dat de roosterItems verdeeld worden over de dagen
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
                <div className="rooster">
                    <div className="dagVelden dagTitles">
                        {datums.map(value => {
                            return <DagTitel datum={value}/>
                        })}
                    </div>
                    <div className="roosterVelden">
                        {/*Hier wordt de zijkant met de tijden gegenereerd  */}
                    <TimeMarker interval={this.props.markerInterval} beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={hourHeight} height={this.props.height} />
                    <div className="row dagVelden">
                    {
                        datums.map(value => <DagField datum={value} renderItems={
                            /* *1 Hier worden alle roosterItems verdeeld over de dagen d.m.v. de datum die in het object stond */
                            this.props.renderItems.filter(value1=>{
                            return Number.parseInt(Object.keys(value1)[0])===value.getTime()

                        })} beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={hourHeight} height={this.props.height} markerInterval={this.props.markerInterval}/>)
                    }
                    </div>
                    </div>
                </div>


            </div>
            )
    }
}
export default RoosterComponent