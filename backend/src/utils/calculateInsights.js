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








// [3] Top Category
export const getTopCategory = (records) =>{
    const map={};

    for(const record of records){
        if(record.type === "expense"){
            map[record.category]=(map[record.category] || 0) + record.amount;
        }
    }

    //find category with max amount
    let topCategory=null;
    let maxAmount=0;

    for(let cat in map){
        if(map[cat]>maxAmount){
            maxAmount=map[cat];
            topCategory=cat;
        }
    }

    return{
        category: topCategory,
        amount: maxAmount,
    };

};






// [4] Savings Rate
export const calculateSavingsRate = (income,expense) => {
    if(income===0) return 0; //avoid division by zero

    const savingsRate = ((income-expense)/income)*100;
    return savingsRate.toFixed(1); //round to 1 decimal
}




// [5] Average Daily Spending
export const getAverageDailySpending = (records) => {
    let totalExpense = 0;
    const dates = new Set();

    for(const record of records){
        if(record.type === "expense"){
            totalExpense += record.amount;
            dates.add(record.date.toDateString()); //group by date
        }
    }
    const days = dates.size || 1; //avoid division by zero
    const avgDaily = totalExpense/days;
    return avgDaily.toFixed(2);
}





// [6] Highest Spending Day
export const getHighestSpendingDay = (records) => {
    const map={};

    for(const record of records){
        if(record.type === "expense"){
            const date=record.date.toDateString();
            map[date]=(map[date] || 0) + record.amount;
        }
    }

    let maxDay=null;
    let maxAmount=0;

    for (let day in map){
        if(map[day]>maxAmount){
            maxAmount=map[day];
            maxDay=day;
        }
    }

    return{
        date: maxDay,
        amount: maxAmount,
    };
}




// [7] Income to Expense Ratio
export const getIncomeExpenseRatio = (income,expense) => {
    if(income === 0) return 0; //avoid division by zero
    const ratio = expense/income;
    return ratio.toFixed(2);
}



// [8] Warning for overspending (if expense > income)
export const checkOverspending = (income,expense) => {
    if(expense > income){
        return "Warning: Your expenses exceed your income";
    }

    return "Your spending is within your income.";
}



// [9] Frequent Spending Category
export const getMostFrequentCategory = (records) =>{
    const freq={};

    for(const record of records){
        if(record.type === "expense"){
            freq[record.category]=(freq[record.category] || 0) + 1;
        }
    }

    let mostFreqCat=null;
    let maxFreq=0;

    for(let cat in freq){
        if(freq[cat]>maxFreq){
            maxFreq=freq[cat];
            mostFreqCat=cat;
        }
    }

    return{
        category: mostFreqCat,
        frequency: maxFreq,
    };
}





// [10] Predict Future Spending (simple prediction based on average)
export const getMonthlyPrediction = (records) => {
    let totalExpense = 0;
    const count=0;

    for(const record of records){
        if(record.type === "expense"){
            totalExpense += record.amount;
            count++;
        }
    }

    if(count === 0) return 0; //avoid division by zero

    const avgExpense = totalExpense/count;
    return avgExpense*30; //predict for 30 days

}

