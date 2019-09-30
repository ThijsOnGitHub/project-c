import React from 'react'

function Bedrijf(props) {
    return(
        <div style={{border:"solid 2px black",textAlign:"center"}}>
            <h1 >BEDRIJF</h1>
            <p>{props.naam}</p>
            <p>{props.loc}</p>
        </div>
    )
}

export default Bedrijf