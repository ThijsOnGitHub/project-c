import React from "react"

class NotificationItem {
    constructor(person, messageId) {
        this.person = person;
        this.messageId = messageId;
    }

    sendNotif() {
        return (
            <div className='NotifItem'>
                <p>Person: {this.person},<br/>messageId: {this.messageId}</p>
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