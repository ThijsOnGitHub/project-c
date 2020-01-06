import React from 'react'
import {Link} from "react-router-dom";
import { ReactComponent as CalendarIcon } from "../calendar.svg";
import { ReactComponent as MoneyIcon } from "../money.svg";
import NotifList from "../Components/NotifList";
import NextShift from "../Components/NextShift";

interface IState {
    content:{firstName:string,lastName:string,email:string,phone:string,birth:string,profielFotoLink:string}[],
    firstName: string,
    lastName:string,
    email: string,
    phone: string,
    birth: string,
    profielFotoLink: string,
    isWerkgever: string
}
interface IProps{
    apiLink : string
    serverLink : string
}
class Home extends React.Component<IProps,IState>{
    lijst:string[];
    constructor(props:IProps){
        super(props);
        this.state= {
            content:[],
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            birth: "",
            profielFotoLink: "",
            isWerkgever: ""
        };
        this.handleInputChange=this.handleInputChange.bind(this);
        this.lijst=["firstName","lastName","email","phone","birth","profielfoto","isWerkgever"];
        this.refreshData=this.refreshData.bind(this)
    }

    refreshData= async ()=>{
        console.log("get data");
        var request= await fetch(this.props.apiLink+"/getgebruikerinfo",{headers:{authToken:sessionStorage.getItem("authToken")}});
        var json= await request.json();
        console.log(json);
        this.setState({
            content:json
        })
    };
    componentDidMount() {
        this.refreshData();
    }

    handleInputChange(event:React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState<never>({
            [name]: value
        });
    }

    render() {
        return(
            <div className="Home">
                <div className="underlay">
                    <h1>Welkom, <span className="weighted">{this.state.content.length>0 && this.state.content[0].firstName}</span>!</h1>
                </div>
                <div style={{textAlign: "center"}} className="LinebreakPrevent">
                    <Link to='./Rooster'>
                        <figure>
                            <CalendarIcon width="150" height="150"/>
                            <figcaption className='Button'>ROOSTER</figcaption>
                        </figure>
                    </Link>
                    <Link to='./Salaris'>
                        <figure>
                            <MoneyIcon width="150" height="150"/>
                            <figcaption className='Button'>SALARIS</figcaption>
                        </figure>
                    </Link>
                </div>
                <div className="LinebreakPrevent">
                    <div className='HomeInfo'>
                        <div className='HomeContents'>
                            <h1>Info</h1>
                            <p>Ingelogd als: {this.state.content.length>0 && this.state.content[0].firstName} {this.state.content.length>0 && this.state.content[0].lastName}</p>
                            <p>Volgende dienst:</p>
                            <NextShift apiLink={this.props.apiLink}/>
                            <Link to='./MyAccount'>
                                <figcaption className='Button'>Accountinstellingen</figcaption>
                            </Link>
                        </div>
                        <div className='HomeInfoC'>
                            <img className='avatar' width='80' height='80' src={this.state.content.length>0 && this.props.apiLink+"/avatar/"+ this.state.content[0].profielFotoLink} alt='profielfoto'/>
                        </div>
                        <NotifList apiLink={this.props.apiLink} />
                    </div>
                </div>
            </div>
        )
    }

}
export default Home