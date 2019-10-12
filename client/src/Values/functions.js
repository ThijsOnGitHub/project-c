class Functions{
    static range = (max,min) => {

        var lijst=[...Array(max+1-(min||0)).keys()]

        if(min){
            lijst=lijst.map(value => value+min)
        }
        return lijst
    }

    static addZeros=(value,amount)=>{
        return ("0".repeat(amount-value.toString().length)+value)
    }

    static getDateOfISOWeek=(week, year)=> {
        var simple = new Date(year, 0, 1 + (week - 1) * 7);
        var dow = simple.getDay();
        var ISOweekStart = simple;
        if (dow <= 4)
            ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
        else
            ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
        return ISOweekStart;
    }
}
export default Functions