import React from 'react'
import {ReactComponent as MoreOptions} from "../../../icons/more_horiz-24px.svg";
import OptionWithIcon from "../../OptionWithIcon";
import {itemComponentsData} from "../../../Pages/Rooster";

interface IProps {
    itemData:itemComponentsData
}

class WerknemerItem extends React.Component<IProps>{
    ziekMelden=()=>{
        console.log(this.props.itemData);
        fetch(
            "http://localhost:5000/api/addnotif", {
                method:"post",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    "person": this.props.itemData.UserData[0].userId,
                    "messageId": 1,
                    "roosterId": 1
                })
            }
        )
    };



    render() {
        return(
            <div className="column isideItem">
                <div className="row">
                    <p className="onAccent noMargin">{new Date(this.props.itemData.beginTijd).toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"})}-{new Date(this.props.itemData.eindTijd).toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"})}</p>
                    <details className="chooseMenu right" >
                        <div>
                            <OptionWithIcon icon="people-24px.svg" text="Vervanging regelen"/>
                            <OptionWithIcon icon="local_hospital-24px.svg" text="Ziek melden" onClick={this.ziekMelden}/>
                            <OptionWithIcon icon="disable_person.svg" text="Vrij vragen"/>
                        </div>
                        <summary>
                                <MoreOptions width={35} height={35} className="onAccent right"/>
                        </summary>
                    </details>
                </div>
            </div>
        )
    }

}
export default WerknemerItem