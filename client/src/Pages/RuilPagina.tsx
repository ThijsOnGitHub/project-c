import React from 'react';

interface IProps{
    id:string
}

interface IState {
    id:string
}

class RuilPagina extends React.Component<IProps, IState>{

    constructor(props:IProps) {
        super(props)
    }

    render=()=>{
        return(
            <p>{this.props.id}</p>
        )
    }
}


export default RuilPagina