import React, {Component, ReactElement} from "react";
import WeekKiezer from "../Components/Rooster/WeekKiezer";
import loadingIcon from "../img/Loding-Icon-zwart.gif";
import RoosterComponent from "../Components/Rooster/RoosterStructuur/RoosterComponent";
import {DagData} from "../Components/Rooster/RoosterStructuur/DagField";
import RoosterItem from "../Components/Rooster/RoosterItems/RoosterItem";
import WerknemerItem from "../Components/Rooster/RoosterItems/WerknemerItem";
import WerkgeverItem from "../Components/Rooster/RoosterItems/WerkgeverItem";
import PopUp from "../Components/Rooster/PopUps/PopUp";
import ItemWijzigen from "../Components/Rooster/PopUps/WijzigTijden/ItemWijzigen";
import RoosterData, {
    BeginEindTijd,
    fullRenderItem,
    itemComponentsData,
    roosterItemRenderFunc
} from "../Components/Rooster/roosterData";
import OptionWithIcon from "../Components/OptionWithIcon";
import WerknemerInroosteren from "../Components/Rooster/PopUps/Inroosteren/WerknemerInroosteren";
import {sortDataOnTime, sortedData} from "../Components/Rooster/RoosterStructuur/sortData";
import Functions from "../Extra Functions/functions";
import StructureItem from "../Components/Rooster/RoosterItems/StructureItem";
import TijdvakWeergeven from "../Components/Rooster/PopUps/structureItem/TijdvakWeergeven";



interface roosterStructuurData{
    id:number
    roosterid:number
    dagNummer:number
    titel: string
    aantalWerknemers:number
    beginTijd:string
    eindTijd:string
    color:string
}
export type roosterStructuurItemData=roosterStructuurData & {werknemers:{beginTijd:Date,eindTijd:Date,naam:string,userId:number,itemId:number}[],datum:string,beginTijd:string,eindTijd:string}


interface IState {
    agendaJSON:fullRenderItem,
    beginDatum:Date,
    loading:boolean
    popUpStack:React.ReactElement<any, string | React.JSXElementConstructor<any>>[]
    minTijd:Date
    maxTijd:Date
    roosterStructuurData:roosterStructuurData[]
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
            loading:true,
            popUpStack:[],
            maxTijd:new Date(),
            minTijd:new Date(),
            roosterStructuurData:[]
        }
    }

    componentDidMount=async ()=> {
        this.updateRoosterStructure()
    }

    refreshRooster=async ()=>{
        var renderdAgendaJSON:sortedData<roosterItemRenderFunc>
        //Hier wordt de data uit de server gehaald en in de state gezet
        this.setState({loading:true})
        var res=await fetch(this.props.apiLink+"/rooster/get",{
            method:"POST",
            headers:{
                "authToken":sessionStorage.getItem("authToken"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({beginDatum:this.state.beginDatum,
            eindDatum:new Date(this.state.beginDatum.getTime()+(1000*60*60*24*7))})
        }).catch(reason => {console.log(reason)});

        var agendaJSON=[];
        if(typeof res !=="undefined"){
            agendaJSON=await res.json();
        }

        var roosterData=new RoosterData(agendaJSON)


        this.setState({minTijd:roosterData.minTijd,maxTijd:roosterData.maxTijd})

        if(this.props.isWerkgever){
            var copyData=this.state.roosterStructuurData.map(value => Object.assign({},value))
            var sturctureData= copyData.map(value => {
                var amountToAdd=(((value.dagNummer-1)%7)+7)%7
                var datum=new Date(this.state.beginDatum.getTime()+amountToAdd*86400000)
                var beginTijd=Functions.timeStringToDate(value.beginTijd).toJSON()
                var eindTijd=Functions.timeStringToDate(value.eindTijd).toJSON()
                var data=Object.assign(value,{datum:datum.toJSON(),werknemers:[],beginTijd:beginTijd,eindTijd:eindTijd})
                return data
            })
            var itemsInTheWeek=sortDataOnTime(sturctureData)
            Object.keys(itemsInTheWeek).forEach(value => {
                var tijdItems=itemsInTheWeek[value]
                var roosterItems=roosterData.data[value]
                Object.keys(tijdItems).forEach(value1 => {
                    var tijd=value1
                    //Er komen geen structuur items tegelijkertijd
                    var item=tijdItems[tijd]
                    if(roosterItems !== undefined){
                        var werknemersLijst=Object.entries(roosterItems)

                        var tijden1=new BeginEindTijd(tijd)
                        werknemersLijst.forEach(value2 => {
                            var tijden2=new BeginEindTijd(value2[0])
                            if(!(tijden1.beginTijdWaarde>=tijden2.eindTijdWaarde||tijden1.eindTijdWaarde<=tijden2.beginTijdWaarde)){
                                value2[1].forEach(value3 => {
                                    item.werknemers.push({beginTijd:tijden2.beginTijd,eindTijd:tijden2.eindTijd,userId:value3.userId,itemId:value3.itemId,naam:value3.naam})
                                })
                            }
                        })
                    }
                })
            })
            var itemsInTheWeekRender=Object.assign({},itemsInTheWeek)
            var renderObject:sortedData<roosterItemRenderFunc>={}
            Object.entries(itemsInTheWeekRender).forEach(value => {
                renderObject[value[0]]={}
                    Object.entries(value[1]).forEach(value1 => {
                        var renderData=this.retrurnStructureItem(value1[1])
                        renderObject[value[0]][value1[0]]=renderData
                    })
                }
            )
            renderdAgendaJSON=renderObject
        }else{
            renderdAgendaJSON=roosterData.getRenderdItems(this.retrurnRenderdItems)
        }

        await this.setState({agendaJSON:{}},() => {
            this.setState({
                agendaJSON:renderdAgendaJSON,
            })
        })

        this.setState({loading:false})
    };


    //Hier Wordt de beginDatum van het rooster veranderd
    //Deze functie wordt gebruikt door de weerkiezer
    changeBeginDatum=(datum:Date)=>{
        return new Promise((resolve => {
                this.setState({beginDatum:datum},()=>{
                    this.refreshRooster()
                    resolve()
                })
            })
        )
    };




    updateRoosterStructure=async ()=>{
        const structuur=await fetch(this.props.apiLink+ "/RoosterStructuur/get",{
            headers:{
                authToken:sessionStorage.getItem("authToken")
            }
        })
        const jsonStructuur:roosterStructuurData[]=await structuur.json()
        await this.setState({roosterStructuurData:jsonStructuur})
        this.refreshRooster()
    }





    //Hier wordt gekozen welke items er moeten worden gegenereerd
    retrurnRenderdItems=(value:itemComponentsData,width?:string,startWidth?:string):roosterItemRenderFunc=>{
        return ((roosterData:DagData):ReactElement<RoosterItem>=>{
            return (
                <RoosterItem  roosterData={roosterData} startWidth={startWidth} width={width} beginTijd={new Date(value.beginTijd)} eindTijd={new Date(value.eindTijd)}>
                {/* Hier komen de items in het rooster component*/}
            {
                this.props.isWerkgever?
                    <WerkgeverItem
                        onClick={event => {
                            this.addPopUp(<ItemWijzigen close={this.closePopUp} RoosterData={value} apiLink={this.props.apiLink} />)
                        }}
                        apiLink={this.props.apiLink} itemData={value} />
                    :
                    <WerknemerItem itemData={value}/>
            }

        </RoosterItem>
            )})
    };

    retrurnStructureItem=(value:roosterStructuurItemData,width?:string,startWidth?:string):roosterItemRenderFunc=>{
        return ((roosterData:DagData):ReactElement<RoosterItem>=>{
            return (
                <RoosterItem  roosterData={roosterData} startWidth={startWidth} width={width} beginTijd={new Date(value.beginTijd)} eindTijd={new Date(value.eindTijd)}>
                    <StructureItem onClick={() => {
                        this.addPopUp(<TijdvakWeergeven RoosterData={value} apiLink={this.props.apiLink} close={this.closePopUp} add={this.addPopUp}/> )
                    }} apiLink={this.props.apiLink} {...value}/>
                </RoosterItem>
            )})
    };

    addPopUp=(item:React.ReactElement<any, string | React.JSXElementConstructor<any>>)=>{
        this.setState(oldState=>{
            oldState.popUpStack.push(item)
            return {popUpStack:oldState.popUpStack}
        })
    }

    closePopUp=()=>{
       this.refreshRooster()
       this.setState(oldState=>{
           oldState.popUpStack.pop()
           return {popUpStack:oldState.popUpStack}
       })
    };

    render() {
        return (
                <div>
                    {
                        this.state.popUpStack.length!==0 &&
                        <PopUp>
                            {this.state.popUpStack[0]}
                        </PopUp>
                    }
                    <div className='row'>
                        <WeekKiezer beginDatum={this.state.beginDatum} changeBeginDatum={this.changeBeginDatum}/>
                      <OptionWithIcon className="Button" onClick={()=>this.refreshRooster()} imgClass="onAccentFilter" icon={"refresh-24px.svg"} text={"Refresh"}/>
                        {
                            this.props.isWerkgever &&
                                <div className="row">
                                    <button className="noHorPadding Button onAccent" onClick={event => {
                                        this.setState(oldState=>{
                                            oldState.popUpStack.push(<WerknemerInroosteren apiLink={this.props.apiLink} close={this.closePopUp}/>)
                                            return {popUpStack:oldState.popUpStack}
                                        })
                                    }} ><OptionWithIcon imgClass="onAccentFilter" icon={"person.svg"} text={"Werknemer Inroosteren"}/>
                                    </button>
                                </div>
                        }

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
                            beginTijd={this.state.minTijd}
                            eindTijd={this.state.maxTijd}
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

