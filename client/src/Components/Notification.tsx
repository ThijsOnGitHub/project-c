import React from "react"

interface IProps {
    person:string
    messageId:number
    imageLink:string
    apiLink:string
}




class NotificationItem extends React.Component<IProps> {
    render() {
        let messages = [" wil een dienst ruilen.", " heeft zich ziek gemeld.", " gaat op vakantie.", " heeft je rooster bijgewerkt."];
        return (
            <div className='NotifItem'>
                <img className='avatar' width="40px" height="40px" src={this.props.imageLink.length>0 && this.props.apiLink+"/avatar/"+ this.props.imageLink} alt='profielfoto'/>
                <p>{this.props.person}{messages[this.props.messageId]}</p>
            </div>
        )
    }
}

export default NotificationItem