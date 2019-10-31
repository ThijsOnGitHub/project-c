import React from 'react'

function OptionWithIcon(props) {
    return(
        <div className="row">
            <img width="40px" src={require("../icons/"+props.icon)}/>
            <p>{props.text}</p>
        </div>
    )
}
export default OptionWithIcon