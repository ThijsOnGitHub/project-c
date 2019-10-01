import React from 'react'
import RoosterComponent from "../Components/Rooster/RoosterComponent";

class Rooster extends React.Component{
    constructor(){
        super()
    }

    render() {
        return (
            <div>
                <RoosterComponent startDate={new Date(2019,8,30,0,0,0)} beginTijd={10} eindTijd={24} height={500}/>
            </div>
        );
    }
}
export default Rooster