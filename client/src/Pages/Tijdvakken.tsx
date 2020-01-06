import React from 'react';
import User from "../Components/User";
import OptionWithIcon from "../Components/OptionWithIcon";

interface Iprops{
    apiLink:string
}



interface Istate{
    user: {
        id: number,
        roosterId:string,
        dagNummer:string,
        titel: string,
        aantalWerknemers: string,
        beginTijd: number,
        eindTijd: number,
        color: number

    }[]


}




class TijdvakPagina extends React.Component<Iprops,Istate> {

    constructor(props: Iprops){
        super(props)
        this.state={user:[]}
    }



    componentDidMount(): void {


        fetch(this.props.apiLink + "/GetTijdvakItems", {headers: {authToken: sessionStorage.getItem("authToken")}}).then(
            value => {
                value.json().then(value1 => {
                    this.setState({
                            user: value1
                        }, () => console.log(value1)
                    )
                })
            }
        )

    }





    render(){
        return(


            <div>
                <div className="header">
                    <h1>Bewerk tijdvakken</h1>
                </div>
                <table  id='555555'>
                    <tr>
                        <th>Id </th>
                        <th>RoosterId </th>
                        <th>DagNummer </th>
                        <th>Titel </th>
                        <th>Aantal Werknemers </th>
                        <th>Begintijd </th>
                        <th>Eindtijd </th>
                        <th>color </th>



                    </tr>
                    {this.state.user.map(value => {
                        return (
                            <tr>
                                <td>{value.id} </td>
                                <td>{value.roosterId}</td>
                                <td>{value.dagNummer}</td>
                                <td>{value.titel}</td>
                                <td>{value.beginTijd}</td>
                                <td>{value.eindTijd}</td>
                                <td>{value.color}</td>

                            </tr>)
                    })}
                </table>
            </div>


        )
    }
}

export default TijdvakPagina
