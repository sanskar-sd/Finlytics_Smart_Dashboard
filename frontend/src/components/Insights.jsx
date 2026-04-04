import React from 'react';

function Stat({title, value, subtitle, color}){
  return (
    <div className="stat">
      <div className="num" style={ color ? {color} : undefined }>{value}</div>
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

const fmtDate = d => {
  if (!d) return '-'
  try {
    const dt = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d
    if (Number.isNaN(dt.getTime && dt.getTime())) return String(d)
    return dt.toLocaleDateString()
  } catch (e) {
    return String(d)
  }
}

const renderVal = v => {
  if (v == null) return '-';
  if (typeof v === 'number') return fmtNumber(v);
  if (typeof v === 'string') return v;
  if (typeof v === 'object') {
    // common shapes
    if (v.category && (v.frequency !== undefined || v.count !== undefined)) {
      const freq = v.frequency ?? v.count
      return `${v.category} (${freq})`
    }
    if (v.name && v.value !== undefined) return `${v.name} (${fmtNumber(v.value)})`;
    if (v.name && v.amount !== undefined) return `${v.name} (${fmtNumber(v.amount)})`;
    if ((v.date || v.day) && (v.amount !== undefined || v.value !== undefined)) {
      const date = v.date ?? v.day
      const amt = v.amount ?? v.value
      return `${fmtDate(date)} — ${fmtNumber(amt)}`
    }
    // highestSpendingDay may be { date: '2026-04-01', total: 123 }
    if ((v.date || v.day) && (v.total !== undefined)) return `${fmtDate(v.date ?? v.day)} — ${fmtNumber(v.total)}`
    // fallback: try to stringify key pairs nicely
    try {
      return Object.entries(v).map(([k, val]) => `${k}: ${typeof val === 'number' ? fmtNumber(val) : String(val)}`).join(', ')
    } catch (e) {
      return JSON.stringify(v)
    }
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
    <div className="card insights">
      <div className="page-header">
        <h3>Insights</h3>
      </div>

          <div className="insights-summary" style={{marginBottom:12}}>
            <div className="stats">
              <Stat title="Total Income" value={fmtNumber(totalIncome)} color="#16a34a" />
              <Stat title="Total Expense" value={fmtNumber(totalExpense)} color="#dc2626" />
              <Stat title="Net" value={net == null ? '-' : fmtNumber(net)} subtitle={net == null ? '' : (net >=0 ? 'Net positive' : 'Net negative')} color="#d97706" />
            </div>
          </div>

      <div className="insights-body">
        <div className="insights-left">
          <h4 className="section-title">Insight Metrics</h4>

          {(() => {
            const fields = [
              { key: 'percentChange', label: 'Percent Change', display: fmtPercent(insights.percentChange) },
              { key: 'trendMessage', label: 'Trend', display: insights.trendMessage || '-' },
              { key: 'topCategory', label: 'Top Category', display: renderVal(insights.topCategory || insights.top_category) },
              { key: 'savingsRate', label: 'Savings Rate', display: insights.savingsRate != null ? `${Number(insights.savingsRate).toFixed(2)}%` : '-' },
              { key: 'averageDailySpending', label: 'Avg Daily Spending', display: fmtNumber(insights.averageDailySpending) },
              { key: 'highestSpendingDay', label: 'Highest Spending Day', display: renderVal(insights.highestSpendingDay) },
              { key: 'incomeExpenseRatio', label: 'Income/Expense Ratio', display: insights.incomeExpenseRatio != null ? fmtNumber(insights.incomeExpenseRatio) : '-' },
              { key: 'overspendingAlert', label: 'Overspending Alert', display: insights.overspendingAlert != null ? String(insights.overspendingAlert) : '-' },
              { key: 'mostFrequentCategory', label: 'Most Frequent Category', display: renderVal(insights.mostFrequentCategory) },
              { key: 'monthlyPrediction', label: 'Monthly Prediction', display: insights.monthlyPrediction ? (typeof insights.monthlyPrediction === 'object' ? Object.entries(insights.monthlyPrediction).map(([k,v])=>`${k}: ${fmtNumber(v)}`).join(', ') : String(insights.monthlyPrediction)) : '-' }
            ];

            return (
              <div className="insight-cards">
                {fields.map((f,i)=> (
                  <div key={f.key} className={`insight-card color-${(i%10)+1}`}>
                    <div className="card-index">Sr {i+1}</div>
                    <div className="card-key">{f.label}</div>
                    <div className="card-value">{f.display}</div>
                  </div>
                ))}
              </div>
            )
          })()}

        </div>

        <div className="insights-right">
          <div className="panel-card category-panel">
            <h4 className="section-title">Category Breakdown</h4>
            <div className="category-breakdown">
              {topCategories.length===0 ? <div>No category data</div> : topCategories.map((c,i)=> (
                <div key={c.cat} className={`category-chip color-cat-${(i%8)+1}`}>
                  <div className="cat-name">{c.cat}</div>
                  <div className="cat-val">{fmtNumber(c.value)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
