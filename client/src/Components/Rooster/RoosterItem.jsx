import React from 'react'

class RoosterItem extends React.Component{
    constructor(){
        super()
        this.state={
            top:0,
            lengte:0
        }
    }

    componentDidMount() {
        this.setState({length:this.calcHeightfromHours(this.props.beginTijd,this.props.eindTijd),top:this.calcHeightfromHours(this.props.roosterData.beginTijd,this.props.beginTijd)})

    }

    calcHeightfromHours(beginTijd,eindTijd){
        var miliseconden=eindTijd.getTime()-beginTijd.getTime()
        var aantalUur=miliseconden/1000/60/60
        return this.props.roosterData.hourHeight*aantalUur
    }

    render() {

        return(
            <div  className="absolute roosterItem" style={{top:this.state.top,height:this.state.length}}>
            </div>
        )
    }
}
export default RoosterItem