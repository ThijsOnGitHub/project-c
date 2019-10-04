import React from 'react'
import RoosterComponent from "../Components/Rooster/RoosterComponent";
class Rooster extends React.Component{
    constructor(){
        super()
        this.state={
            agendaJSON:[]
        }
    }

    componentDidMount=async ()=> {
        //Hier wordt de data uit de server gehaald en in de state gezet
        var res=await fetch(this.props.apiLink+"/api/getAgenda/2").catch(reason => {console.log(reason)})
        var agendaJSON=await res.json()
        this.setState({agendaJSON:agendaJSON})

    }

    render() {
        return (
            <div>
                <RoosterComponent markerInterval={new Date(0,0,0,0,30)} agendaJSON={this.state.agendaJSON} startDate={new Date(2019,8,30,0,0,0)} beginTijd={new Date(0,0,0,7)} eindTijd={new Date(0,0,0,20)} height={600}/>
            </div>
        );
    }
}
export default Rooster