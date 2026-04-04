import Record from '../models/recordModel.js';
import {
    calculatePercentageChange,
    generateInsight,
    getTopCategory,
    calculateSavingsRate,
    getAverageDailySpending,
    getHighestSpendingDay,
    getIncomeExpenseRatio,
    checkOverspending,
    getMonthlyPrediction,
    getMostFrequentCategory
} from "../utils/calculateInsights.js";



// MAIN DASHBOARD SERVICE 
export const getDashboardData = async (user) => {


    
    //1. Get all records for the user's organization
    const records = await Record.find({
        organizationId: user.organizationId,
        isDeleted:false, //exclude deleted records
    })

    //2.calculate totals
    let totalIncome=0;
    let totalExpense=0;

    for(const record of records){
        if(record.type === "income"){
            totalIncome += record.amount;
        } else if(record.type === "expense"){
            totalExpense += record.amount;
        }
    }

    const netBalance = totalIncome - totalExpense;


    //3.Category Breakdown
    const categoryMap = {};

    records.forEach((r) => {
    if (!categoryMap[r.category]) {
        categoryMap[r.category] = {
            income: 0,
            expense: 0,
        };
    }

    if (r.type === "income") {
        categoryMap[r.category].income += r.amount;
    } else {
        categoryMap[r.category].expense += r.amount;
    }
});


    //4.Monthly Trends
    const monthlyTrends = {};

records.forEach((r) => {
    const month = new Date(r.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
    });

    if (!monthlyTrends[month]) {
        monthlyTrends[month] = {
            income: 0,
            expense: 0,
        };
    }

    if (r.type === "income") {
        monthlyTrends[month].income += r.amount;
    } else {
        monthlyTrends[month].expense += r.amount;
    }
});



//5. This Month vs Last Month (BASED ON DATA, NOT SYSTEM DATE)

// sort records by date (latest first)
const sortedRecords = records
    .filter(r => r.type === "expense")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

// get latest month from data
const latestDate = sortedRecords[0]?.date;
const latestMonth = new Date(latestDate).getMonth();
const latestYear = new Date(latestDate).getFullYear();

// previous month
const prevMonthDate = new Date(latestYear, latestMonth - 1);
const prevMonth = prevMonthDate.getMonth();
const prevYear = prevMonthDate.getFullYear();

let thisMonth = 0;
let lastMonth = 0;

sortedRecords.forEach((r) => {
    const d = new Date(r.date);
    const m = d.getMonth();
    const y = d.getFullYear();

    if (m === latestMonth && y === latestYear) {
        thisMonth += r.amount;
    } else if (m === prevMonth && y === prevYear) {
        lastMonth += r.amount;
    }
});

    const percentChange = calculatePercentageChange(thisMonth,lastMonth);

    const trendMessage = generateInsight(percentChange, "Overall Spending");



    //6.Advanced Insights
    const topCategory = getTopCategory(records);
    const savingsRate = calculateSavingsRate(totalIncome,totalExpense);
    const averageDailySpending = getAverageDailySpending(records);
    const highestSpendingDay = getHighestSpendingDay(records);
    const incomeExpenseRatio = getIncomeExpenseRatio(totalIncome,totalExpense);
    const overspendingAlert = checkOverspending(totalIncome,totalExpense);
    const mostFrequentCategory = getMostFrequentCategory(records);
    const monthlyPrediction = getMonthlyPrediction(records);



    //FINAL RESPONSE
    return{
        summary:{
            totalIncome,
            totalExpense,
            netBalance,
        },

        categoryBreakdown: categoryMap,

        monthlyTrends,

        insights:{
            percentChange,
            trendMessage,
            topCategory,
            savingsRate,
            averageDailySpending,
            highestSpendingDay,
            incomeExpenseRatio,
            overspendingAlert,
            mostFrequentCategory,
            monthlyPrediction,
        },
    };

    
};