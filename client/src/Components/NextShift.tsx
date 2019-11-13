import React from "react";

interface IProps {
    apiLink:string
}

class NextShift extends React.Component<IProps> {
    constructor(props:IProps){
        super(props);
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
                    this.setState({notifs:json})
                }
            )
    };
    render() {
        return(
            <p>Placeholder</p>
        )
    }
}

export default NextShift