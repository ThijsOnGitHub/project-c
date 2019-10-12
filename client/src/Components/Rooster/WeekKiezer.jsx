import React from 'react'
import Functions from "../../Values/functions";
import {ReactComponent as NextIcon} from "../../icons/arrow_next.svg";
import {ReactComponent as BackIcon} from "../../icons/arrow_back.svg";


class WeekKiezer extends React.Component{
    constructor(){
        super()
       this.state={
            week:1,
           year:2019,
           kiesbareWeken:Functions.range(52,1),
           kiesbareJaren:Functions.range(new Date().getFullYear(),2000)
       }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]:value}, this.updateDate  )

    }

    changeWeek=(amount)=>{
        var week=parseInt(this.state.week)
        var year=this.state.year

        week+=amount
        if (week>52){
            week=week-52
            year+=1
        }else if (week<1){
            week=52-week
            year-=1
        }
        this.setState({week:week,year:year},this.updateDate)
    }

    updateDate=()=>{
        this.props.changeBeginDatum(Functions.getDateOfISOWeek(this.state.week,this.state.year))
    }

    changeToMonday=(date)=>{
        return new Date(date.getTime() - ((24*60*60*1000)*(date.getDay()-1)) )
    }

    updateSelects=()=>{
        this.setState({year:this.props.beginDatum.getFullYear(),week:this.props.beginDatum.getWeekNumber()})
    }

    componentDidMount() {
        // Als de ingevoederde datum geen maandag is wordt deze meteen omgezet naar de maandag in de week
        if(this.props.beginDatum.getDay()!==1){
            this.props.changeBeginDatum(this.changeToMonday(this.props.beginDatum))
        }
        this.updateSelects()
    }

    render() {
        return(
            <div className="row WeekKiezer">
                <select name="week"  value={this.state.week} onChange={this.handleInputChange}>
                        {this.state.kiesbareWeken.map((value)=><option style={{backgroundColor:this.state.week===value? "lightgray":undefined}} value={value} name='week'>Week {value}</option> )}
                </select>
                <select name="year"  value={this.state.year} onChange={this.handleInputChange}>
                        {this.state.kiesbareJaren.map((value)=><option style={{backgroundColor:this.state.year===value? "lightgray":undefined}} value={value} name='year'>{value}</option> )}
                </select>
                <BackIcon onClick={()=>this.changeWeek(-1)}/>
                <NextIcon onClick={()=>this.changeWeek(1)}/>
                <button onClick={()=>{
                    this.props.changeBeginDatum(this.changeToMonday(new Date())).then(()=>{
                        this.updateSelects()
                    })

                }}>Deze week</button>
            </div>
            )

    }
}
export default WeekKiezer