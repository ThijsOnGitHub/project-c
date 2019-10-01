import React from 'react'
import DagTitel from "./DagTitel";
import DagField from "./DagField";
import TimeIndicator from "./TimeIndicator";

class RoosterComponent extends React.Component{
    constructor(){
        super()

    }


    render() {
        var datums=[0,1,2,3,4,5,6].map((value,index) => {
            var newDate=new Date(this.props.startDate.toString())
            var newValue=newDate.getDate()+index
            newDate.setDate(newValue)
            return newDate
        })
        var hourHeight=this.props.height/(this.props.eindTijd-this.props.beginTijd)
        return(
            <div>
                <div className="agendaFields">
                    <TimeIndicator beginTijd={this.props.beginTijd} eindTijd={this.props.eindTijd} hourHeight={hourHeight} height={this.props.height}/>
                    <div className="dagFields">
                    {
                        datums.map(value => <DagField datum={value} beginTijd={this.props.beginTijd} eindTijd={this.props.eindtijd} hourHeight={hourHeight} height={this.props.height} />)
                    }
                    </div>
                </div>


            </div>
            )
    }
}
export default RoosterComponent