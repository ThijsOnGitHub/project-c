import React from 'react'
import User from "../Components/User";
import Bedrijf from "../Components/Bedrijf";
var API_LINK='http://localhost:5000/api'

class MyAccount extends React.Component{
    constructor(){
        super()
        this.state={
            content:[],
            firstName: "",
            lastName: ""
        }
        this.lijst=["firstName","lastName"]
        this.handleInputChange= this.handleInputChange.bind(this)
        this.submit=this.submit.bind(this)
        this.refreshData=this.refreshData.bind(this)
    }

    refreshData= async ()=>{
        console.log("get data")
        var request= await fetch(API_LINK+"/getgebruikerinfo")
        var json= await request.json()
        this.setState({
            content:json
        })
    }
    componentDidMount= async ()=> {
        this.refreshData()
    }

    render() {
        return(
                <div>
                    {this.state.content.map(value =>{ return <User naam={value.firstName} achternaam={value.lastName}/>})}
                    {this.lijst.map(value=>{
                        return (
                            <div>
                                <label>{value}</label>
                                <input type='text' name={value} value={this.state[value]}  placeholder={value} onChange={this.handleInputChange}/>
                            </div>
                        )
                    })}
                </div>
                )
            }
}
export default User