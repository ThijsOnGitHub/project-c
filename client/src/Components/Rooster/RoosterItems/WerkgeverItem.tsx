import React from 'react'
import {itemComponentsData} from "../../../Pages/Rooster";


interface IProps {
    itemData:itemComponentsData
    apiLink:string
}

class  WerkgeverItem extends React.Component<IProps>{
    private divRef:React.RefObject<HTMLDivElement>

    constructor(props:IProps){
        super(props)
        const divRef=React.createRef()
    }



    render() {
        return(
            <div ref={this.divRef} className="column isideItem roosterItem noOverflow">
                <div className="row">
                    <p className="onAccent noMargin" >{new Date(this.props.itemData.beginTijd).toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"})}-{new Date(this.props.itemData.eindTijd).toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"})}</p>

                    {/*
                        <details className="chooseMenu right">
                            <div>
                                <OptionWithIcon icon="people-24px.svg" text="Vervanging Regelen"/>
                                <OptionWithIcon icon="local_hospital-24px.svg" text="Ziek Melden"/>
                                <OptionWithIcon icon="disable_person.svg" text="Vrij Vragen"/>
                            </div>
                            <summary>
                                <MoreOptions width={35} height={35} className="onAccent right"/>
                            </summary>
                        </details>
                    */}
                </div>
                <p>{"Test"}</p>
                <p>{this.divRef && this.divRef.current.clientHeight}</p>
                {
                    this.props.itemData.UserData.map(value => {
                        return (
                        <div className="row centerContent">
                            <img className="avatar avatarMini" src={this.props.apiLink+"/avatarwithid/"+value.userId}/>
                            <p className="name">{value.naam}</p>
                        </div>)
                    })
                }


            </div>
        )
    }

}
export default WerkgeverItem