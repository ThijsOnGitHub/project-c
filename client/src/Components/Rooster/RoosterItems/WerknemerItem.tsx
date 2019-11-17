import React from 'react'
import {ReactComponent as MoreOptions} from "../../../icons/more_horiz-24px.svg";
import OptionWithIcon from "../../OptionWithIcon";
import {ItemData} from "../../../Pages/Rooster";

interface IProps {
    itemData:ItemData
}

class WerknemerItem extends React.Component<IProps>{



        handleSubmit=async (event:React.MouseEvent<HTMLButtonElement,MouseEvent>)=> {
            this.setState({loading: true})
            event.preventDefault()
        }
    render() {
        return(
            <div className="column isideItem">
                <div className="row">
                    <p className="onAccent noMargin">{new Date(this.props.itemData.beginTijd).toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"})}-{new Date(this.props.itemData.eindTijd).toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"})}</p>
                    <details className="chooseMenu right" >
                        <div>
                            <button><OptionWithIcon icon="people-24px.svg"  text="Vervanging Regelen"/></button>

                            <button><OptionWithIcon icon="local_hospital-24px.svg" text="Ziek Melden"/></button>
                            <button><OptionWithIcon icon="disable_person.svg" text="Vrij Vragen"/></button>
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