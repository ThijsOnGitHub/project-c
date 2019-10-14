import React from "react"

class NotificationItem {
    constructor(person, messageId) {
        this.person = person;
        this.messageId = messageId;
    }

    sendNotif() {
        let messages = [" wil een dienst ruilen.", " heeft zich ziek gemeld.", " gaat op vakantie.", " heeft je rooster bijgewerkt."];
        return (
            <div className='NotifItem'>
                <p>{this.person}{messages[this.messageId]}</p>
            </div>
        )
    }
}

function Notification(props) {
    const notifToSend = new NotificationItem(props.person, props.messageId);
    return (
        <p>{notifToSend.sendNotif()}</p>
    )
}

export default Notification