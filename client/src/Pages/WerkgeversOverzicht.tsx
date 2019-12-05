import React from 'react';
import User from "../Components/User";
import OptionWithIcon from "../Components/OptionWithIcon";

interface Iprops{
    apiLink:string
}



interface Istate{
    user: {
        id: number,
        firstName:string,
        lastName:string
    }[]


}




class WerkgeversOverzicht extends React.Component<Iprops,Istate> {

    constructor(props: Iprops){
        super(props)
        this.state={user:[]}
    }



    componentDidMount(): void {


        fetch(this.props.apiLink+ "/GetMedewerkers", {headers:{authToken:sessionStorage.getItem("authToken")}}).then(
            value => {
                value.json().then(value1 => {
                    this.setState({
                        user:value1
                        },() => console.log(value1)
                    )
                })
            }
        )

    }

    deleteUser=(id:number)=> {
        console.log({id:id})
        fetch(this.props.apiLink + "/deleteUser", {
            method:"post",
            headers:{authToken:sessionStorage.getItem("authToken"),
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({id:id})
        });
    }







    render(){
     return(


         <div>
             <div className="header">
                 <h1>Werkgeversoverzicht</h1>
             </div>
             <table  id='555555'>
                 <tr>
                     <th>Voornaam </th>
                     <th>Achternaam </th>
                 </tr>
             {this.state.user.map(value => {
                 return (
                     <tr>
                     <td>{value.firstName} </td>
                     <td>{value.lastName}</td>
                     <td> {<OptionWithIcon onClick={event => this.deleteUser(value.id)} icon="delete.svg" text="Verwijder Werknemer"/>}</td>
                     </tr>)
             })}
             </table>
    </div>


     )
    }
}

export default WerkgeversOverzicht
