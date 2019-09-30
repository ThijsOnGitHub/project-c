import React from 'react'
import Bedrijf from "../Components/Bedrijf";
var API_LINK='http://localhost:5000/api'

class DataTest extends React.Component{
    constructor(){
        super()
        this.state={
            content:[],
            img_link: "www.google.com",
            loc: "Banrneveld",
            name: "Bert",
            pass: "123FG",
            phone: "012345"
        }
        this.lijst=["name","phone","loc","pass","img_link"]
        this.handleInputChange= this.handleInputChange.bind(this)
        this.submit=this.submit.bind(this)
        this.refreshData=this.refreshData.bind(this)
    }

    refreshData= async ()=>{
        console.log("get data")
        var request= await fetch(API_LINK+"/bedrijf")
        var json= await request.json()
        this.setState({
            content:json
        })
    }

    componentDidMount= async ()=> {
        this.refreshData()
    }

    submit(){
        var object={}
        this.lijst.forEach((value)=>{
            object[value]=this.state[value]
        })
        console.log("sending")
        console.log(object)
        fetch(API_LINK+"/addbedrijf",{method:"POST",
            body:JSON.stringify(object),
        headers:{
            "content-type":"application/json"
        }}).then((value)=>{
            value.json().then(value1 => {console.log(value1.message)})
            this.refreshData()
        })


    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return(
            <div>
                {this.state.content.map(value =>{ return <Bedrijf naam={value.name} loc={value.loc}/>})}
                {this.lijst.map(value=>{
                    return (
                    <div>
                        <label>{value}</label>
                        <input type='text' name={value} value={this.state[value]}  placeholder={value} onChange={this.handleInputChange}/>
                    </div>
                    )
                })}
                <br/>
                <button onClick={this.submit}>submit</button>


            </div>
        )
    }
}
export default DataTest