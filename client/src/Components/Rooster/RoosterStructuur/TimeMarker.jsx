import React from 'react'
import functions from "../../../Values/functions";

class TimeMarker extends React.Component{

    constructor(){
        super()
        this.state={
            uren:[],
            beginTijd:null,
            eindTijd:null
        }
    }

    componentDidMount() {

        //Hier wordt een lijst gemaakt met alle uren om weer te geven (i.p.v. uren kan er ook een lijn worden weergegeven)
        var lijst=[{tijd:this.props.beginTijd.toTime(),y:0}]
        var interval=this.props.interval.toTime()
        for(let i=1;new Date(lijst[i-1].tijd.getTime()+interval.getTime()).getTime()<=this.props.eindTijd.toTime().getTime();i++){
            lijst.push({tijd:new Date(lijst[i-1].tijd.getTime()+interval.getTime()),y:lijst[i-1].y+(this.props.hourHeight*(interval.getTime()/1000/60/60))})
        }
        this.setState({uren:lijst})
    }

    //Deze functie zorgt ervoor dat de datum niet meeteld bij getTime on je bij 00:00:00 ook 0 ms krijgt
    makeDateZero(date){
        return new Date(new Date(1970,0,1,1).getTime()+date)
    }

    render() {
        return(
            <div style={{height:this.props.height,position:"relative",minWidth:50}}>
                {
                    // Hier worden voor alle tijden of lijnen op de uren geplaatst
                    this.state.uren.map((value,index,list) =>{
                        var item=<div></div>;
                    var data={position:"absolute",left:0,top:value.y,textAlign:"center",margin:0}

                    //Hier wordt gedefineerd of er een lijn of een tijd wordt weergegeven
                    if (this.props.type==="line"){
                        if(index!==0 && index!==list.length-1) {
                            Object.assign(data, {marginTop: -2})
                            item = <div className="lineMarker" style={data}></div>
                        }
                    }else{
                        Object.assign(data,{marginTop:-24/2,width:"100%"})
                        item=<p style={data}>{value.tijd.toLocaleTimeString('nl-NL',{hour:"2-digit",minute:"2-digit",timeZone:"UTC"})}</p>
                    }

                    return item
                })}
            </div>
        )
    }
}
export default TimeMarker