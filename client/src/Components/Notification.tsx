import React from "react"

interface IProps {
    person:string
    messageId:number
}

class NotificationItem extends React.Component<IProps> {
    render() {
        let messages = [" wil een dienst ruilen.", " heeft zich ziek gemeld.", " gaat op vakantie.", " heeft je rooster bijgewerkt."];
        return (
            <div className='NotifItem'>
                <p>{this.props.person}{messages[this.props.messageId]}</p>
            </div>
        )
    }
}

export default NotificationItem