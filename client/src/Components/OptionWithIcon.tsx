import React from 'react'

interface IProps {
    icon:string
    text:string
    onClick?:(event:React.MouseEvent)=>void
}

function OptionWithIcon(props:IProps) {
    return(
        <div onClick={props.onClick} className="row clickAble">
            <img width="30px" src={require("../icons/"+props.icon)}/>
            <p>{props.text}</p>
        </div>
    )
}
export default OptionWithIcon