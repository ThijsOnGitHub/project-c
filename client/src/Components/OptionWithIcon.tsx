import React from 'react'

interface IProps {
    icon:string
    text:string
}

function OptionWithIcon(props:IProps) {
    return(
        <div className="row">
            <img width="40px" src={require("../icons/"+props.icon)}/>
            <p>{props.text}</p>
        </div>
    )
}
export default OptionWithIcon