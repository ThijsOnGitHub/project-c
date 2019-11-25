import React from 'react';
import User from "../Components/User";

interface Iprops{apiLink:string}



interface Istate{
    user: {
        userId: number,
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
                        }

                    )
                })
            }
        )

    }



    render(){
     return(


         <div>
             <div className="header">
                 <h1>Werkgeversoverzicht</h1>
             </div>
             <table>

             {this.state.user.map(value => {
                 return (<div>
                     <th>Id</th>
                     <th>Voornaam </th>
                     <th>Achternaam </th>

                     <tr>
                     <td>{value.userId}</td>
                     <td>{value.firstName} {value.lastName}</td>
                     </tr>

                  </div>)

             })}
             </table>
    </div>


     )
    }
}

export default WerkgeversOverzicht
