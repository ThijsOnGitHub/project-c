import React from "react"

class NotificationItem extends React.Component {
    constructor() {
        super();
    }


    sendNotif() {
        let messages = [" wil een dienst ruilen.", " heeft zich ziek gemeld.", " gaat op vakantie.", " heeft je rooster bijgewerkt."];
        let persons = ["Herman Zwaaihoofd", "Vierman Kloopt", "Superbme"];
        let jsondata;
        fetch("http://localhost:5000/api/getnotifs")
            .then(
                function(u){
                    return u.json();
                }
            )
            .then(
                function(json) {
                    jsondata = json;
                }
            );
        var jsonstring = JSON.parse(jsondata);
        return (
            <div className='NotifItem'>
                <p>{persons[jsonstring.name]}{messages[jsonstring.messageType]}</p>
            </div>
        )
    }

    render() {
        const notifToSend = new NotificationItem(this.props.person, this.props.messageId);
        return (
            <div>
                {notifToSend.sendNotif()}
            </div>
        )
    }
}

export default NotificationItem