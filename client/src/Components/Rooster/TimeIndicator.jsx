import React from 'react'
import functions from "../../Values/functions";

class TimeIndicator extends React.Component{

    constructor(beginTijd,eindTijd){
        super(beginTijd,eindTijd)
        this.state={
            uren:[]
        }
    }

    componentDidMount() {
        var aantalUren=this.props.eindTijd-this.props.beginTijd
        var lijst=[{tijd:this.props.beginTijd,y:0}]
        for(let i=1;i<aantalUren+1;i++){

            lijst.push({tijd:lijst[i-1].tijd+1,y:lijst[i-1].y+this.props.hourHeight})
        }
        this.setState({uren:lijst})
    }

    render() {

        return(
            <div style={{height:this.props.height,position:"relative",minWidth:50,marginTop:132}}>
                {this.state.uren.map(value =>{
                    return <p style={{position:"absolute",left:0,top:value.y,textAlign:"center",margin:0,marginTop:-24/2,width:"100%"}}>{functions.addZeros(value.tijd,2)+":00"}</p>
                })}
            </div>
        )
    }
}
export default TimeIndicator