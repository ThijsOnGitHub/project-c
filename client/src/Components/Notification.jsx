import React from "react"

class NotificationItem extends React.Component {
    constructor() {
        super();
    }

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