import React from 'react'
import {ReactComponent as MoreOptions} from "../../../icons/more_horiz-24px.svg";

class WerknemerItem extends React.Component{
    constructor(){
        super()
    }

    render() {
        return(
            <div className="column isideItem">
                <div className="row">
                    <p className="onAccent noTopMargin">{new Date(this.props.itemData.beginTijd).toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"})}-{new Date(this.props.itemData.eindTijd).toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"})}</p>
                    <MoreOptions width={35} height={35} className="onAccent right"/>
                </div>
            </div>
        )
    }

}
export default WerknemerItem