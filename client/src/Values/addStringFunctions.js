//This page creates new String Functions

export default function () {
    String.prototype.capitalFirst =function () {
        return this.charAt(0).toUpperCase() +this.slice(1)
    }
    Date.prototype.toTime = function () {
        return new Date(this.getTime()+2209076372000)
    }
}

