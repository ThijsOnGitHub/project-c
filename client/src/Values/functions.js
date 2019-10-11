export default{
    addZeros:(value,amount)=>{
        return ("0".repeat(amount-value.toString().length)+value)
    }
}