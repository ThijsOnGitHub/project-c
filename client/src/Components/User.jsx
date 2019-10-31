import React from 'react'

function User(props) {
    return(
        <div style={{border:"solid 2px black",textAlign:"center"}}>
            <h1 >Userinfo</h1>
            <p>{props.naam}</p>
            <p>{props.achternaam}</p>
        </div>
    )
}

export default User