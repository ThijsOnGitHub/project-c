import React, {Component, ReactElement} from "react";
import {Person} from "../Inroosteren/WerknemerInroosteren";
import TextField from "@material-ui/core/TextField";
import {Chip} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import {Autocomplete} from "@material-ui/lab";
import Functions from "../../../../Extra Functions/functions";
import {roosterStructuurItemData} from "../../../../Pages/Rooster";
import DagoverzichtRooster, {WerknemerRenderObject} from "../../RoosterStructuur/DagoverzichtRooster";
import RoosterItem from "../../RoosterItems/RoosterItem";
import {DagData} from "../../RoosterStructuur/DagField";


interface IProps {
    RoosterData:roosterStructuurItemData
    apiLink:string
    close:()=>void
    add:(component:React.ReactElement)=>void
}

export interface IState {
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
            names:[],
            newNames:[],
            selectedNames:[],
            inroosteren:false,
        }
        this.beginTijd=React.createRef()
        this.eindTijd=React.createRef()
    }

    componentDidMount=async()=> {
        await this.getUsers()
        this.updateNewNames()
    }

    getUsers= async ()=>{
        const result=await fetch(this.props.apiLink+"/GetMedewerkers",{headers:{authToken:sessionStorage.getItem("authToken")}})
        const resultJSON:Person[]=await result.json()
        await this.setState({names:resultJSON})
    }

    updateNewNames=async ()=>{
        const personList=this.state.names.filter(value => {
            return !this.props.RoosterData.werknemers.some(value1 => value1.userId===value.id)
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
                    date: new Date(this.props.RoosterData.datum),
                    beginTijd: new Date(this.props.RoosterData.beginTijd).toLocaleTimeString(),
                    eindTijd: new Date(this.props.RoosterData.eindTijd).toLocaleTimeString(),
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
        this.setState({inroosteren:false,selectedNames:[]})
    }


    getRenderdItems=():WerknemerRenderObject[]=>{
        console.log(this.props.RoosterData.werknemers)
        return this.props.RoosterData.werknemers.map(value => {
            return {userId:value.userId,itemId:value.itemId,naam:value.naam,beginTijd:value.beginTijd,eindTijd:value.eindTijd,status:0,"function":
                    (roosterData:DagData):ReactElement<RoosterItem>=>{
                        return (
                            <RoosterItem  roosterData={roosterData} beginTijd={value.beginTijd} eindTijd={value.eindTijd}>
                                <div style={{backgroundColor:"var(--accent)",width:"100%",height:50}}></div>
                            </RoosterItem>
                        )}
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
                            {new Date(this.props.RoosterData.datum).toLocaleDateString()}
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
                                <p>{new Date(this.props.RoosterData.beginTijd).toLocaleTimeString()} - {new Date(this.props.RoosterData.eindTijd).toLocaleTimeString()}</p>
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
                                }} >inroosteren</button>
                            }

                        </td>
                    </tr>
                    </tbody>
                </table>
                {

                 <table className="maxFullHeight overFlowAuto thinScrollBar minHeight">
                    <DagoverzichtRooster  addPopUp={this.props.add} closePopUp={this.props.close} apiLink={this.props.apiLink} eindTijd={new Date(0,0,0,23,59,59)} beginTijd={new Date(0,0,0,0,0,0)} width={700} markerInterval={new Date(0,0,0,2)} renderItems={
                        this.getRenderdItems()
                    }/>
                </table>

                }

                <button className="Button" onClick={this.props.close} >Sluiten</button>
            </div>
        )
    }
}
export default TijdvakWeergeven