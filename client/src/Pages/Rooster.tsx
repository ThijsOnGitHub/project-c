import React, {Component, ReactElement} from "react";
import WeekKiezer from "../Components/Rooster/WeekKiezer";
import loadingIcon from "../img/Loding-Icon-zwart.gif";
import RoosterComponent from "../Components/Rooster/RoosterStructuur/RoosterComponent";
import {DagData} from "../Components/Rooster/RoosterStructuur/DagField";
import RoosterItem from "../Components/Rooster/RoosterItems/RoosterItem";
import WerknemerItem from "../Components/Rooster/RoosterItems/WerknemerItem";
import WerkgeverItem from "../Components/Rooster/RoosterItems/WerkgeverItem";


export type itemComponentsData={beginTijd:string,eindTijd:string,datum:string,UserData:{naam:string,userId:number}[]}
export type roosterItems={datum:string,beginTijd:string,eindTijd:string,userId:number,naam:string}
export type itemValues={naam:string,userId:number}[]
type formatedDayItem={[tijd:string]:{naam:string,userId:number}[]}
type formatedRoosterItems={[datum:string]:formatedDayItem}


export type roosterItemRenderFunc=(RoosterData:DagData)=>ReactElement<RoosterItem>

export type dayRenderItem={[tijd:string]:roosterItemRenderFunc}
export type fullRenderItem={[datum:string]:dayRenderItem}



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
        //Hier wordt de data uit de server gehaald en in de state gezet
        var res=await fetch(this.props.apiLink+"/getRooster",{headers:{"authToken":sessionStorage.getItem("authToken")}}).catch(reason => {console.log(reason)});
        var agendaJSON=[]

        if(typeof res !=="undefined"){
            agendaJSON=await res.json();
        }
        var newAgendaJSON=this.sortOnSameTime(agendaJSON)
        var renderAgendaJSON=this.returnFormatedSortedJSON(newAgendaJSON)
        console.log(this.isSubListOf2([0, 2, 3, 4],[0, 2, 3, 4, 6]))
        this.setState({
            agendaJSON:renderAgendaJSON,
            loading:false
        })
    };

    changeBeginDatum=(datum:Date)=>{
        return new Promise((resolve => {
                this.setState({beginDatum:datum},resolve)
            })
        )

    };

    retrurnRenderdItems=(value:itemComponentsData,width?:string,startWidth?:string):roosterItemRenderFunc=>{
        return ((roosterData:DagData):ReactElement<RoosterItem>=>{
            return (
                <RoosterItem  roosterData={roosterData} startWidth={startWidth} width={width} beginTijd={new Date(value.beginTijd)} eindTijd={new Date(value.eindTijd)}>
                    {/* Hier komen de items in het rooster component*/}
                    {
                        this.props.isWerkgever?
                            <WerkgeverItem apiLink={this.props.apiLink} itemData={value}/>
                            :
                            <WerknemerItem itemData={value}/>
                    }

                </RoosterItem>
            )})
    }

    isSubListOf2=(list1:number[],list2:number[])=>{
        return list1.every(value => list2.includes(value))
    }

    returnFormatedSortedJSON=(json:formatedRoosterItems):fullRenderItem=>{
        var formatJson:any=Object.assign({},json)
        Object.keys(formatJson).forEach(value => {

            var allIntersecties:number[][] = []
            var ObjectList=Object.keys(formatJson[value])

            ObjectList.forEach((value1, index) => {
                const gesplitst=value1.split(";")
                const beginTijd=new Date(gesplitst[0]).getTime()
                const eindTijd=new Date(gesplitst[1]).getTime()
                var lijst: number[]=[index]
                ObjectList.forEach(((value2, index2) => {
                    if(index!==index2){
                        const gesplitst1=value2.split(";")
                        const beginTijd1=new Date(gesplitst1[0]).getTime()
                        const eindTijd1=new Date(gesplitst1[1]).getTime()
                        var isIntersect=false

                        if(!(beginTijd>=eindTijd1||eindTijd<=beginTijd1)){
                            lijst.push(index2)
                        }
                    }
                }))

                console.log("intersect with")
                if(!allIntersecties.some(value2 => value2.equals(lijst.sort()))){
                    allIntersecties.push(lijst.sort())
                }
            })

            console.log("hallo")
            var orginalItersections=allIntersecties.filter((value1,index) => {
                return !allIntersecties.some((value2,index1)=> {
                    return (index===index1? false: this.isSubListOf2(value2,value1))
                })
            })
            console.log(value)
            console.log(orginalItersections)

            var amount:{[id:string]:number}={}
            var indexen:number[]=[]
            ObjectList.forEach((value1,index) => {
                indexen.push(index)
                amount[index.toString()]=orginalItersections.reduce((previousValue, currentValue) => previousValue+(currentValue.includes(index)?1:0),0)
            })
            console.log(amount)

            var itemSort=indexen.sort((a, b) => amount[b]-amount[a])

            console.log(itemSort)

            var itemStyleData:{[id:string]:{width:number,start:number}}={}

            itemSort.forEach(value1 => {
                var intersections=orginalItersections.filter(value2 => value2.includes(value1))
                if(intersections.length!==0){
                    var intersectionLengthSort=intersections.sort((a, b) => b.length-a.length)
                    var maxIntersection=intersectionLengthSort[0]

                    var shareAmount=maxIntersection.length
                    var reserverdWidth=maxIntersection.reduce((previousValue, currentValue) => {
                        var addValue=0
                        if(itemStyleData[currentValue]){
                            shareAmount-=1
                            addValue=itemStyleData[currentValue].width
                        }
                        return previousValue+addValue
                    },0)

                    var width=(100-reserverdWidth)/shareAmount
                    itemStyleData[value1]={width:width,start:reserverdWidth}
                }
            })
            console.log(itemStyleData)
            ObjectList.forEach((value1, index) => {
                const gesplitst=value1.split(";")
                const beginTijd=gesplitst[0]
                const eindTijd=gesplitst[1]
                const values=formatJson[value][value1]
                formatJson[value][value1]=this.retrurnRenderdItems({beginTijd:beginTijd,eindTijd:eindTijd,datum:value,UserData:values},itemStyleData[index]&&itemStyleData[index].width+"%",itemStyleData[index]&&itemStyleData[index].start+"%")
            })


        })
        return formatJson
    }

    beginEindString=(beginTijd:string,eindTijd:string):string=>{
        return beginTijd+";"+eindTijd
    }

    sortOnSameTime=(json:roosterItems[]):formatedRoosterItems=>{
        var returnObject:formatedRoosterItems={}
        json.forEach(value => {
            if(value.datum in returnObject){
                var datumVak=returnObject[value.datum]
                if(this.beginEindString(value.beginTijd,value.eindTijd) in datumVak){
                    var tijdVak=datumVak[this.beginEindString(value.beginTijd,value.eindTijd)]
                    tijdVak.push({userId:value.userId,naam:value.naam})
                }else{
                    datumVak[this.beginEindString(value.beginTijd,value.eindTijd)]=[{userId:value.userId,naam:value.naam}]
                }
            }else{
                returnObject[value.datum]={[this.beginEindString(value.beginTijd,value.eindTijd)]:[{userId:value.userId,naam:value.naam}]}
            }

        })
        console.log(returnObject)
        return returnObject
    }



    render() {
        return (
            <div>
                <WeekKiezer beginDatum={this.state.beginDatum} changeBeginDatum={this.changeBeginDatum}/>
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

