import React from 'react';

function Stat({title, value, subtitle}){
  return (
    <div className="stat">
      <div className="num">{value}</div>
      <div style={{fontSize:12,marginTop:6}}>{title}</div>
      {subtitle && <div style={{fontSize:11,opacity:0.7}}>{subtitle}</div>}
    </div>
  )
}

const fmtNumber = v => {
  if (v == null) return '-';
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString(undefined,{maximumFractionDigits:2});
}

const fmtPercent = v => {
  if (v == null) return '-';
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}

const renderVal = v => {
  if (v == null) return '-';
  if (typeof v === 'number') return fmtNumber(v);
  if (typeof v === 'string') return v;
  if (typeof v === 'object') {
    // common patterns: { category, frequency } or { name, value }
    if (v.category && v.frequency !== undefined) return `${v.category} (${v.frequency})`;
    if (v.name && v.value !== undefined) return `${v.name} (${fmtNumber(v.value)})`;
    return JSON.stringify(v);
  }
  return String(v);
}

export default function Insights({data}){
  // data is expected to be the dashboard object returned from backend /api/dashboard
  const summary = data?.summary || {};
  const totalIncome = summary?.totalIncome ?? null;
  const totalExpense = summary?.totalExpense ?? null;
  const net = (totalIncome != null && totalExpense != null) ? (Number(totalIncome || 0) - Number(totalExpense || 0)) : null;

  const byCategory = data?.categoryBreakdown || {};
  const topCategories = Object.entries(byCategory)
    .map(([cat, vals]) => ({ cat, value: (Number(vals?.income || 0) + Number(vals?.expense || 0)) }))
    .sort((a,b)=>b.value - a.value);

  const insights = data?.insights || {};

  return (
    <div className="card">
      <h3>Insights</h3>

      <div style={{marginBottom:12}}>
        <div className="stats">
          <Stat title="Total Income" value={fmtNumber(totalIncome)} />
          <Stat title="Total Expense" value={fmtNumber(totalExpense)} />
          <Stat title="Net" value={net == null ? '-' : fmtNumber(net)} subtitle={net == null ? '' : (net >=0 ? 'Net positive' : 'Net negative')} />
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <div>
          <h4 style={{margin:'8px 0'}}>Insight Metrics</h4>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <tbody>
              <tr><td style={{padding:8,fontWeight:600}}>Percent Change</td><td style={{padding:8}}>{fmtPercent(insights.percentChange)}</td></tr>
              <tr><td style={{padding:8,fontWeight:600}}>Trend Message</td><td style={{padding:8}}>{insights.trendMessage || '-'}</td></tr>
              <tr><td style={{padding:8,fontWeight:600}}>Top Category</td><td style={{padding:8}}>{renderVal(insights.topCategory || insights.top_category)}</td></tr>
              <tr><td style={{padding:8,fontWeight:600}}>Savings Rate</td><td style={{padding:8}}>{insights.savingsRate != null ? `${Number(insights.savingsRate).toFixed(2)}%` : '-'}</td></tr>
              <tr><td style={{padding:8,fontWeight:600}}>Avg Daily Spending</td><td style={{padding:8}}>{fmtNumber(insights.averageDailySpending)}</td></tr>
              <tr><td style={{padding:8,fontWeight:600}}>Highest Spending Day</td><td style={{padding:8}}>{insights.highestSpendingDay ? (typeof insights.highestSpendingDay === 'object' ? JSON.stringify(insights.highestSpendingDay) : insights.highestSpendingDay) : '-'}</td></tr>
              <tr><td style={{padding:8,fontWeight:600}}>Income/Expense Ratio</td><td style={{padding:8}}>{insights.incomeExpenseRatio != null ? fmtNumber(insights.incomeExpenseRatio) : '-'}</td></tr>
              <tr><td style={{padding:8,fontWeight:600}}>Overspending Alert</td><td style={{padding:8}}>{insights.overspendingAlert != null ? String(insights.overspendingAlert) : '-'}</td></tr>
              <tr><td style={{padding:8,fontWeight:600}}>Most Frequent Category</td><td style={{padding:8}}>{renderVal(insights.mostFrequentCategory)}</td></tr>
            </tbody>
          </table>
        </div>

        <div>
          <h4 style={{margin:'8px 0'}}>Monthly Prediction</h4>
          {insights.monthlyPrediction ? (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {typeof insights.monthlyPrediction === 'object' ? (
                Object.entries(insights.monthlyPrediction).map(([k,v])=> (
                  <div key={k} style={{padding:8,background:'#fff',borderRadius:8,boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                    <div style={{fontWeight:700}}>{k}</div>
                    <div style={{fontSize:13,opacity:0.85}}>{fmtNumber(v)}</div>
                  </div>
                ))
              ) : (
                <div>{String(insights.monthlyPrediction)}</div>
              )}
            </div>
          ) : (
            <div>No prediction data</div>
          )}

          <h4 style={{margin:'12px 0 8px'}}>Category Breakdown</h4>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {topCategories.length===0 ? <div>No category data</div> : topCategories.map(c=> (
              <div key={c.cat} style={{padding:8,background:'#fff',borderRadius:8,boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                <div style={{fontWeight:600}}>{c.cat}</div>
                <div style={{fontSize:12,opacity:0.75}}>{fmtNumber(c.value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
