import React from 'react'
import {ReactComponent as MoreOptions} from "../../../icons/more_horiz-24px.svg";
import OptionWithIcon from "../../OptionWithIcon";
import {itemComponentsData} from "../roosterData";


interface IProps {
    itemData:itemComponentsData
}

class WerknemerItem extends React.Component<IProps>{

    render() {
        return(
            <div className="column isideItem">
                <div className="row">
                    <p className="onAccent noMargin">{new Date(this.props.itemData.beginTijd).toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"})}-{new Date(this.props.itemData.eindTijd).toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"})}</p>
                    <details className="chooseMenu right" >
                        <div>
                            <OptionWithIcon icon="people-24px.svg" text="Vervanging Regelen"/>
                            <OptionWithIcon icon="local_hospital-24px.svg" text="Ziek Melden"/>
                            <OptionWithIcon icon="disable_person.svg" text="Vrij Vragen"/>
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