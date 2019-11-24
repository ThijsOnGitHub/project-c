import React, {Component, ReactElement} from "react";
import WeekKiezer from "../Components/Rooster/WeekKiezer";
import loadingIcon from "../img/Loding-Icon-zwart.gif";
import RoosterComponent from "../Components/Rooster/RoosterStructuur/RoosterComponent";
import {DagData} from "../Components/Rooster/RoosterStructuur/DagField";
import RoosterItem from "../Components/Rooster/RoosterItems/RoosterItem";
import WerknemerItem from "../Components/Rooster/RoosterItems/WerknemerItem";
import WerkgeverItem from "../Components/Rooster/RoosterItems/WerkgeverItem";
import RoosterData, {
    formatedRoosterItems,
    fullRenderItem,
    itemComponentsData, roosterItem,
    roosterItemRenderFunc
} from "../Components/Rooster/roosterData";






interface IState {
    agendaJSON:fullRenderItem,
    beginDatum:Date,
    loading:boolean
}

interface IProps {
    apiLink:string
    isWerkgever:boolean
}

class Rooster extends Component<IProps,IState>{

    constructor(props:IProps){
        super(props);
        this.state={
            agendaJSON:{},
            beginDatum:new Date(),
            loading:true
        }
    }

    componentDidMount=async ()=> {
        this.refreshRooster()
    };

    refreshRooster=async ()=>{
        //Hier wordt de data uit de server gehaald en in de state gezet
        var res=await fetch(this.props.apiLink+"/getRooster",{headers:{"authToken":sessionStorage.getItem("authToken")}}).catch(reason => {console.log(reason)});
        var agendaJSON=[];
        if(typeof res !=="undefined"){
            agendaJSON=await res.json();
        }

        var roosterData=new RoosterData(agendaJSON)
        var renderdAgendaJSON=roosterData.getRenderdItems(this.retrurnRenderdItems)
        this.setState({
            agendaJSON:renderdAgendaJSON,
            loading:false
        })
    };


    //Hier Wordt de beginDatum van het rooster veranderd
    //Deze functie wordt gebruikt door de weerkiezer
    changeBeginDatum=(datum:Date)=>{
        return new Promise((resolve => {
                this.setState({beginDatum:datum},resolve)
            })
        )

    };

    //Hier wordt gekozen welke items er moeten worden gegenereerd
    retrurnRenderdItems=(value:itemComponentsData,width?:string,startWidth?:string):roosterItemRenderFunc=>{
        return ((roosterData:DagData):ReactElement<RoosterItem>=>{
            return (
                <RoosterItem  roosterData={roosterData} startWidth={startWidth} width={width} beginTijd={new Date(value.beginTijd)} eindTijd={new Date(value.eindTijd)}>
                    {/* Hier komen de items in het rooster component*/}
                    {
                        this.props.isWerkgever?
                            <WerkgeverItem
                                apiLink={this.props.apiLink} itemData={value} />
                            :
                            <WerknemerItem itemData={value}/>
                    }

                </RoosterItem>
            )})
    };

    };

    render() {
        return (
            <div>
                <div className='row'>
                    <WeekKiezer beginDatum={this.state.beginDatum} changeBeginDatum={this.changeBeginDatum}/>
                </div>
                {/*Rooster Component maakt de rooster structuur waar roosterItems ingaat*/}
                {
                    this.state.loading
                        ?
                        <div className="center">
                            <img src={loadingIcon} width={300} style={{margin: "auto"}}/>
                        </div>
                        :
                        <RoosterComponent
                            startDate={this.state.beginDatum}
                            markerInterval={new Date(0, 0, 0, 0, 30)}
                            beginTijd={new Date(0, 0, 0, 7)}
                            eindTijd={new Date(0, 0, 0, 20)}
                            height={600}

                            /*
                            In de prop renderItems worden alle items gemaakt die in het rooster gaan
                            De items worden een object met {datum:genereer functie}
                            In RoosterComponent worden de items verdeeld over de dagen d.m.v. de datum key zie *1
                            In rooster component kan 'html' worden gevoegd zodat het item ook wat uiterlijk heeft
                            Zo kan het roosterComponent ook worden gebruikt voor de baas
                            (let op de roosterItems worden pas in 'DagField echt geplaatst nu zijn ze nog functies
                            */

                            renderItems={this.state.agendaJSON}
                        />
                }
            </div>
        );
    }

}
export default Rooster

