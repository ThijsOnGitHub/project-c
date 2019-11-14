import React from "react";

interface IProps {
    apiLink:string
}

interface IState {
    NextShift:{datum:string, beginTijd:string, eindTijd:string}[]
}

class NextShift extends React.Component<IProps, IState> {
    constructor(props:IProps){
        super(props);
        this.state={
            NextShift:null
        }
    }
    componentDidMount() {
        this.getNextShift()
    }

    getNextShift = () => {
        fetch("http://localhost:5000/api/getNextShift", {headers:{authToken:sessionStorage.getItem('authToken')}})
            .then(
                (u) => {
                    try{
                        return u.json()
                    }
                    catch(error){
                        console.error(error)
                    }
                }
            )
            .then(
                (json) => {
                    console.log(json);
                    this.setState({NextShift:json})
                }
            )
    };
    render() {
        return(
            <div>
                <p>{this.state.NextShift[0].datum} fjck</p>
            </div>
        )
    }
}

export default NextShift