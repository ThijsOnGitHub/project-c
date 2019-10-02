import React from 'react'
import functions from "../../Values/functions";

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
        var aantalUren=this.props.eindTijd.getHours()-this.props.beginTijd.getHours()
        var lijst=[{tijd:this.props.beginTijd.getHours(),y:0}]

        for(let i=1;i<aantalUren+1;i++){
            lijst.push({tijd:lijst[i-1].tijd+1,y:lijst[i-1].y+this.props.hourHeight})
        }
        this.setState({uren:lijst})
    }

    render() {
        return(
            <div style={{height:this.props.height,position:"relative",minWidth:50}}>
                {this.state.uren.map(value =>{
                    var item;
                    var data={position:"absolute",left:0,top:value.y,textAlign:"center",margin:0,width:"100%"}
                    if (this.props.type==="line"){
                        item=<hr className="lineMarker" noshade style={data}/>
                    }else{
                        Object.assign(data,{marginTop:-24/2})
                        item=<p style={data}>{functions.addZeros(value.tijd,2)+":00"}</p>
                    }
                    return item
                })}
            </div>
        )
    }
}
export default TimeMarker