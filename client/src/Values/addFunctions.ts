//This page creates new String Functions




export default function () {

    //String functie
    String.prototype.capitalFirst =function () {
        return this.charAt(0).toUpperCase() +this.slice(1)
    };

    //Date Functies

    Date.prototype.toTime = function () {
        return new Date(this.getTime()+2209076372000)
    };

    Date.prototype.getWeekNumber = function(){
        var d:Date = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart:Date = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7)
    };

}

