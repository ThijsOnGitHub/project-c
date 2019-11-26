import React, {Component} from "react";
import {itemComponentsData} from "../../roosterData";
import WerknemerTijden from "./WerknemerTijden";
import {ReactComponent as Done} from "../../../../icons/done-24px.svg";
import {ReactComponent as Create} from "../../../../icons/create-24px.svg";

interface IProps {
    RoosterData:itemComponentsData
    apiLink:string
    close:()=>void

}
export interface IState {
    beginTijd:string
    eindTijd:string
    datum:Date
    werkNemers:{userId:number,naam:string,beginTijd:string,eindTijd:string,itemId:number}[]
    edit:boolean
}

class WijzigTijden extends Component<IProps,IState>{

    constructor(props:IProps){
        super(props)
        this.state={
            beginTijd:"",
            eindTijd:"",
            datum:new Date(),
            werkNemers:[],
            edit:false
        }
    }

    componentDidMount(): void {
        var userData=this.props.RoosterData.UserData.map(value => {
            return Object.assign(value,{beginTijd:new Date(this.props.RoosterData.beginTijd).toLocaleTimeString('nl-NL',{hour:"2-digit",minute:"2-digit"}),eindTijd:new Date(this.props.RoosterData.eindTijd).toLocaleTimeString('nl-NL',{hour:"2-digit",minute:"2-digit"})})
        })
        this.setState({
            beginTijd:new Date(this.props.RoosterData.beginTijd).toLocaleTimeString('nl-NL',{hour:"2-digit",minute:"2-digit"}),
            eindTijd:new Date(this.props.RoosterData.eindTijd).toLocaleTimeString('nl-NL',{hour:"2-digit",minute:"2-digit"}),
            datum:new Date(this.props.RoosterData.datum),
            werkNemers:userData
        })
    }

    handleInputChange=(event:React.ChangeEvent<HTMLInputElement>)=> {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        //: target.type=== 'time'? new Date(target.value)

        this.setState<never>({
            [name]: value
        });
    }

    changeState=(functie:(oldState:IState)=>Partial<IState>)=>{
       this.setState<never>((oldstate)=>{return functie(oldstate)})
    }


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div>
                <h1 className="noTopMargin">Wijzig Roosteritem</h1>
                <table>
                    <tbody >
                    <tr>
                        <td>
                        </td>
                        <td>
                            Datum:
                        </td>
                        <td>
                            {this.state.datum.toLocaleDateString()}
                        </td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                        <td>
                            BeginTijden:
                        </td>
                        <td>
                            {
                            this.state.edit ?
                                <div className="row">
                                    <input type="time" name={"beginTijd"} onChange={this.handleInputChange} value={this.state.beginTijd}/>
                                    <input type="time" name={"eindTijd"} onChange={this.handleInputChange} value={this.state.eindTijd}/>
                                </div> :
                                <div className="row">
                                    <p>{this.state.beginTijd} - {this.state.eindTijd}</p>

                                </div>
                        }
                        </td>
                        <td>
                            {
                                this.state.edit?
                                    <Done onClick={() => {
                                        console.log(this.state.werkNemers)
                                        var newWerknemers=this.state.werkNemers.map(value=>{
                                            fetch(this.props.apiLink+"/rooster/change/"+value.itemId,{
                                                method:"POST",
                                                headers:{
                                                    authToken:sessionStorage.getItem("authToken"),
                                                    'Content-Type': 'application/json'
                                                },
                                                body:JSON.stringify({beginTijd:this.state.beginTijd+":00",eindTijd:this.state.eindTijd+":00"})
                                            })

                                            return {...value,beginTijd:this.state.beginTijd,eindTijd:this.state.eindTijd}
                                        })
                                        console.log(newWerknemers)
                                        this.setState({edit: false})
                                    }}/>
                                    :
                                    <Create onClick={() => {
                                        this.setState({edit: true})
                                    }}/>
                            }
                        </td>
                    </tr>
                    {this.state.werkNemers.map((value,index) => {
                        return(
                           <WerknemerTijden changeHigherState={this.changeState} index={index} itemId={value.itemId} userId={value.userId} naam={value.naam} beginTijd={value.beginTijd} eindTijd={value.eindTijd} apiLink={this.props.apiLink}/>
                        )
                    })}
                    </tbody>
                </table>
                <button className="Button" onClick={this.props.close} >Sluiten</button>
            </div>
        )
    }
}
export default WijzigTijden