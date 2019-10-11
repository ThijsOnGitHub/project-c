import React from 'react'
import {ReactComponent as RoosteritLogo} from '../logo.svg';

function Logo(props) {
        var style={}
        if(props.color){
            style["--accentColor"]=props.color
        }
        style = Object.assign(style, props.style)
        return (
            <RoosteritLogo className={props.className} style={style}/>
        )
}
export default Logo