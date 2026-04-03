// Feature	                Purpose

// % change	                trend
// top category	           spending behavior
// savings rate	           financial health
// avg daily	           habits
// highest day	           anomaly
// ratio	               balance
// warning	               alert
// frequent category	    behavior
// prediction	           future insight



// [1] Percentage Change in anything (income, expense, savings)
export const calculatePercentageChange = (current,previous) =>{
    if(previous===0){
        if(current===0) return 0;

        return 100; //from 0 to some value is 100% increase
    }
    return ((current-previous)/previous)*100;
}



// [2] Data Insights .. convert data into textual insights
//tell %increase in income, expense, savings with some text
export const generateInsight = (percent, label="value", positive="increased",negative="decreased") => {

    const value = Math.abs(percent).toFixed(1); //round to 1 decimal

    if(percent > 0){
        return `Your ${label} has ${positive} by ${value}% compared to last month.`;
    }

    if(percent < 0){
        return `Your ${label} has ${negative} by ${value}% compared to last month.`;
    }

    return `Your ${label} is unchanged compared to last month.`;
}











