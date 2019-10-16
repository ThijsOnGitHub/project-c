import React from "react"

class NotificationItem extends React.Component {
    constructor() {
        super();
    }


    sendNotif() {
        let messages = [" wil een dienst ruilen.", " heeft zich ziek gemeld.", " gaat op vakantie.", " heeft je rooster bijgewerkt."];

        return (
            <div className='NotifItem'>
                <p>{this.person}{messages[this.messageId]}</p>
            </div>
        )
    }

    render() {
        const notifToSend = new NotificationItem(this.props.person, this.props.messageId);
        return (
            <p>{notifToSend.sendNotif()}</p>
        )
    }
}

export default NotificationItem