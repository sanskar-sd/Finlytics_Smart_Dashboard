import Record from '../models/Record.js';
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
    const record = await Record.find({
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
        categoryMap[r.category] = 0;
        }
        categoryMap[r.category] += r.amount;
    });


    //4.Monthly Trends
    const monthlyTrends = {};
    records.forEach((r) => {
    const month = new Date(r.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!monthlyTrends[month]) {
      monthlyTrends[month] = 0;
    }

    monthlyTrends[month] += r.amount;
  });



  //5.This Month vs Last Month
    let thisMonth=0;
    let lastMonth=0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const lastMonthIndex = currentMonth - 1;

    records.forEach((r) => {
        const recordDate = new Date(r.date);
        const recordMonth = recordDate.getMonth();

        if(recordMonth === currentMonth){
            thisMonth +=r.amount;
        } else if(recordMonth === lastMonthIndex){
            lastMonth +=r.amount;
        }
    });

    const percentChange = calculatePercentageChange(thisMonth,lastMonth);

    const trendMessage = generateInsight({
        percent:percentChange,
        label:"Overall Spending",
    });



    //6.Advanced Insights
    const topCategory = getTopCategory(records);
    const savingsRate = calculateSavingsRate(totalIncome,totalExpense);
    const averageDailySpending = getAverageDailySpending(records);
    const highestSpendingDay = getHighestSpendingDay(records);
    const incomeExpenseRatio = getIncomeExpenseRatio(totalIncome,totalExpense);
    const overspendingAlert = checkOverspending(records);
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