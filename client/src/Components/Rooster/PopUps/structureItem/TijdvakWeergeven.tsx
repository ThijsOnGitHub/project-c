import React, {Component} from "react";
import {itemComponentsData} from "../../roosterData";
import {ReactComponent as Done} from "../../../../icons/done-24px.svg";
import {ReactComponent as Create} from "../../../../icons/create-24px.svg";
import {Person} from "../Inroosteren/WerknemerInroosteren";
import TextField from "@material-ui/core/TextField";
import {Chip} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import {Autocomplete} from "@material-ui/lab";
import Functions from "../../../../Extra Functions/functions";
import {roosterStructuurItemData} from "../../../../Pages/Rooster";
import LosItemWijzigen from "../WijzigTijden/LosItemWijzigen";

interface IProps {
    RoosterData:roosterStructuurItemData
    apiLink:string
    close:()=>void
    add:(component:React.ReactElement<any, string | React.JSXElementConstructor<any>>)=>void
}

export interface IState {
    beginTijd:string
    eindTijd:string
    datum:Date
    werkNemers:{userId:number,naam:string,beginTijd:string,eindTijd:string,itemId:number}[]
    edit:boolean
    validToSubmit:boolean
    names:Person[]
    newNames:Person[]
    selectedNames:Person[],
    inroosteren:boolean
}

class TijdvakWeergeven extends Component<IProps,IState>{
    private beginTijd: React.RefObject<HTMLInputElement>
    private eindTijd: React.RefObject<HTMLInputElement>

    constructor(props:IProps){
        super(props)
        this.state={
            beginTijd:"",
            eindTijd:"",
            datum:new Date(),
            werkNemers:[],
            edit:false,
            validToSubmit:true,
            names:[],
            newNames:[],
            selectedNames:[],
            inroosteren:false
        }
        this.beginTijd=React.createRef()
        this.eindTijd=React.createRef()
    }



    getUsers= async ()=>{
        const result=await fetch(this.props.apiLink+"/GetMedewerkers",{headers:{authToken:sessionStorage.getItem("authToken")}})
        const resultJSON:Person[]=await result.json()
        await this.setState({names:resultJSON})
    }

    updateNewNames=async ()=>{
        console.log(this.state.werkNemers)
        const personList=this.state.names.filter(value => {
            return !this.state.werkNemers.some(value1 => value1.userId===value.id)
        })
        await this.setState({newNames:personList})
    }

    inroosteren=async ()=>{
        this.setState({inroosteren:true})
        var names = this.state.selectedNames
        const result = await fetch(this.props.apiLink + "/rooster/add",
            {
                method: "POST",
                headers: {
                    authToken: sessionStorage.getItem("authToken"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: new Date(this.state.datum),
                    beginTijd: this.state.beginTijd + ":00",
                    eindTijd: this.state.eindTijd + ":00",
                    users: names.map(value => value.id)
                })
            })
                const jsonResult = await result.json()
                console.log(jsonResult)
                console.log(Functions.range(jsonResult.insertId + jsonResult.affectedRows-1,jsonResult.insertId ))
                const itemIds = Functions.range(jsonResult.insertId + jsonResult.affectedRows-1,jsonResult.insertId )
                var objects = names.map((value, index) => {
                    return Object.assign(value,{itemId:itemIds[index]})
                });
                this.setState(oldState=>{
                    objects.forEach(value =>{
                        oldState.werkNemers.push({beginTijd:this.state.beginTijd,eindTijd:this.state.eindTijd,naam:value.naam,itemId:value.itemId,userId:value.id})
                    })
                    return {selectedNames:[],werkNemers:oldState.werkNemers,inroosteren:false}},this.updateNewNames
                )

      }

    addGebruiker=()=>{
        var werknemersNieuw=this.state.werkNemers
        this.state.selectedNames.forEach((value,index) => {

        })
    }

     componentDidMount=async ()  =>{
        var userData=this.props.RoosterData.werknemers.map(value => {
            return Object.assign(value,{beginTijd:new Date(this.props.RoosterData.beginTijd).toLocaleTimeString('nl-NL',{hour:"2-digit",minute:"2-digit"}),eindTijd:new Date(this.props.RoosterData.eindTijd).toLocaleTimeString('nl-NL',{hour:"2-digit",minute:"2-digit"})})
        })
        this.setState({
            beginTijd:new Date(this.props.RoosterData.beginTijd).toLocaleTimeString('nl-NL',{hour:"2-digit",minute:"2-digit"}),
            eindTijd:new Date(this.props.RoosterData.eindTijd).toLocaleTimeString('nl-NL',{hour:"2-digit",minute:"2-digit"}),
            datum:new Date(this.props.RoosterData.datum),
            werkNemers:userData
        })
        await this.getUsers()
        this.updateNewNames()
    }

    handleInputChange=(event:React.ChangeEvent<HTMLInputElement>)=> {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        //: target.type=== 'time'? new Date(target.value)

        if(target.checkValidity()){
            this.setState({validToSubmit:true})
        }else{
            this.setState({validToSubmit:false})
        }

        this.setState<never>({
            [name]: value
        });
    }

    changeState=(functie:(oldState:IState)=>Partial<IState>)=>{
       this.setState<never>((oldstate)=>{return functie(oldstate)},() => {
           this.updateNewNames()
           if(this.state.werkNemers.length===0){
               this.props.close()
           }
       })
    }



    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div className="hunderMaxHeight heightTable scrolOverflow">
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
                            Titel Tijdvak:
                        </td>
                        <td>
                            {this.props.RoosterData.titel}
                        </td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                        <td>
                            Begintijden:
                        </td>
                        <td>
                            <div className="row">
                                <p>{this.state.beginTijd} - {this.state.eindTijd}</p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Personen:</td>
                        <td>
                            <Autocomplete
                            noOptionsText={"Geen werknemer gevonden"}
                            multiple={true}
                            filterSelectedOptions={true}
                            value={this.state.selectedNames}
                            renderInput={params => (
                                <TextField {...params} variant="outlined" fullWidth />
                            )}
                            options={this.state.newNames}
                            renderTags={(value:Person[], getTagProps) => {
                                return value.map((value,index) =>{
                                    return <Chip {...getTagProps({ index })} avatar={<Avatar src={this.props.apiLink+"/avatarWithId/"+value.id}/>} label={value.naam} />
                                })
                            }}
                            renderOption={option => {
                                return(
                                    <div className="row centerContent">
                                        <img className="avatar avatarMini" src={this.props.apiLink+"/avatarWithId/"+option.id}/>
                                        <p>{option.naam}</p>
                                    </div>
                                )
                            }}
                            style={{ width: 300 }}
                            onChange={(event, value) => {
                                this.setState({selectedNames:value})
                            }}
                        />
                        </td>
                        <td>
                            {
                                (this.state.inroosteren || this.state.selectedNames.length===0)  ||
                                <button className="Button" onClick={ event => {
                                    this.inroosteren()
                                    this.updateNewNames()
                                }} >inroosteren</button>
                            }

                        </td>
                    </tr>
                    </tbody>
                </table>
                <table className="maxFullHeight overFlowAuto thinScrollBar minHeight">

                </table>
                <button className="Button" onClick={this.props.close} >Sluiten</button>
            </div>
        )
    }
}
export default TijdvakWeergeven