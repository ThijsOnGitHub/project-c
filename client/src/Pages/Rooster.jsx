import React from 'react'
import RoosterComponent from "../Components/Rooster/RoosterComponent";
import RoosterItem from "../Components/Rooster/RoosterItem";
import WerknemerItem from "../Components/Rooster/WerknemerItem";
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
                {/*Rooster Component maakt de rooster structuur waar roosterItems ingaan*/}
                <RoosterComponent markerInterval={new Date(0,0,0,0,30)}  startDate={new Date(2019,8,30,0,0,0)} beginTijd={new Date(0,0,0,7)} eindTijd={new Date(0,0,0,20)} height={600}
                    /*
                    In de prop renderItems worden alle items gemaakt die in het rooster gaan
                    De items worden een object met {datum:genereer functie}
                    In RoosterComponent worden de items verdeeld over de dagen d.m.v. de datum key zie *1
                    In rooster component kan 'html' worden gevoegd zodat het item ook wat uiterlijk heeft
                    Zo kan het roosterComponent ook worden gebruikt voor de baas
                    (let op de roosterItems worden pas in 'DagField echt geplaatst nu zijn ze nog functies
                    */
                renderItems={ this.state.agendaJSON.map(value => {return {[new Date(value.datum).getTime()]: ((roosterData)=>{
                            return (

                                <RoosterItem roosterData={roosterData} beginTijd={new Date(value.beginTijd)} eindTijd={new Date(value.eindTijd)}>
                                {/* Hier komen de items in het rooster component*/}
                                    <WerknemerItem itemData={value}/>
                                </RoosterItem>

                            )})}})} />
            </div>
        );
    }
}
export default Rooster