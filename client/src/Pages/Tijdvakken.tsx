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
        aantalWerknemers: number,
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
                        <th scope="col">Id </th>
                        <th scope="col">RoosterId </th>
                        <th scope="col">DagNummer </th>
                        <th scope="col">Titel </th>
                        <th scope="col">Aantal Werknemers </th>
                        <th scope="col">Begintijd </th>
                        <th scope="col">Eindtijd </th>
                        <th scope="col">color </th>
                        <th></th>
                        <th>{<OptionWithIcon onClick={event => this.updateTijdvakken(value.roosterid)} icon="save.svg" text="Sla Bewerkingen Op"/>}</th>


                    </tr>

                    {this.state.user.map(value => {
                        return (
                            <tr>


                                <td scope="col" ><div contentEditable>{value.id}</div> </td>
                                <td scope="col"><div contentEditable>{value.roosterId}</div></td>
                                <td scope="col"><div contentEditable>{value.dagNummer}</div></td>
                                <td scope="col"><div contentEditable>{value.titel}</div></td>
                                <td scope="col"><div contentEditable>{value.aantalWerknemers}</div></td>
                                <td scope="col"><div contentEditable>{value.beginTijd}</div></td>
                                <td scope="col"><div contentEditable>{value.eindTijd}</div></td>
                                <td scope="col"><div contentEditable>{value.color}</div></td>

                            </tr>)
                    })}
                </table>
            </div>


        )
    }
}

export default TijdvakPagina
