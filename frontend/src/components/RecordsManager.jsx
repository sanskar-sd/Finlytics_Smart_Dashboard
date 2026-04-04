import React, { useEffect, useState } from 'react';
import { fetchRecords, createRecord, updateRecord, deleteRecord } from '../services/records';
import Spinner from './Spinner';

export default function RecordsManager({ readonly=false }){
  const [filters, setFilters] = useState({startDate:'',endDate:''});
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({amount:'',type:'income',category:'',date:'',notes:''});
  const [mode, setMode] = useState('get'); // get | create | update | delete
  const [showFilters, setShowFilters] = useState(false);
  const [typeChecks, setTypeChecks] = useState({income:true, expense:true});
  const [categoryChecks, setCategoryChecks] = useState({});

  const load = async ()=>{
    setLoading(true);
    try{
      const data = await fetchRecords(filters);
      setRecords(data || []);
      // populate category checks if not set
      const cats = Array.from(new Set((data||[]).map(r=>r.category).filter(Boolean)));
      const map = {};
      cats.forEach(c=>{ if(!(c in categoryChecks)) map[c]=true; });
      if(Object.keys(map).length>0) setCategoryChecks(prev=>({...prev,...map}));
    }catch(e){}
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  const applyFilters = async ()=>{
    setLoading(true);
    try{
      // prepare params for backend fetch
      const params = {};
      if(filters.startDate) params.startDate = filters.startDate;
      if(filters.endDate) params.endDate = filters.endDate;
      // if exactly one type is selected, send it to backend for server-side filtering
      const selectedTypes = Object.keys(typeChecks).filter(k=>typeChecks[k]);
      if(selectedTypes.length === 1) params.type = selectedTypes[0];

      const data = await fetchRecords(params);
      // client-side filter by remaining type/category selections
      const filtered = (data||[]).filter(r=> (typeChecks[r.type]) && (categoryChecks[r.category] ?? true));
      setRecords(filtered);
    }catch(e){}
    setLoading(false);
  }

  const submit = async (e)=>{
    e && e.preventDefault();
    try{
      if(readonly){
        return alert('You do not have permission to modify records.');
      }

      if(editing){
        await updateRecord(editing._id, form);
        setEditing(null);
        setMode('get');
      } else {
        await createRecord(form);
      }
      setForm({amount:'',type:'income',category:'',date:'',notes:''});
      load();
    }catch(err){
      alert(err?.response?.data?.message || err.message);
    }
  }

  const onEdit = (r)=>{
    if(readonly) return alert('You do not have permission to edit records.');
    setEditing(r);
    setForm({amount:r.amount,type:r.type,category:r.category,date:new Date(r.date).toISOString().slice(0,10),notes:r.notes||''});
    setMode('update');
  }

  const onDelete = async (id)=>{
    if(readonly) return alert('You do not have permission to delete records.');
    if(!confirm('Delete this record?')) return;
    await deleteRecord(id);
    load();
  }

  return (
    <div className="card">
      <h3>Manage Records</h3>

      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <button className={`btn ${mode==='get'?'active':''}`} onClick={()=>setMode('get')}>Get Records</button>
        {!readonly && <button className={`btn ${mode==='create'?'active':''}`} onClick={()=>setMode('create')}>Create Record</button>}
        {!readonly && <button className={`btn ${mode==='update'?'active':''}`} onClick={()=>setMode('update')}>Update Record</button>}
        {!readonly && <button className={`btn ${mode==='delete'?'active':''}`} onClick={()=>setMode('delete')}>Delete Record</button>}
      </div>

      {/* Single filter selector (hidden while just fetching) */}
      {mode !== 'get' ? (
        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:12,alignItems:'center'}}>
        <div>
          <div style={{fontSize:12,opacity:0.8}}>Filter by</div>
          <select value={filters.mode || 'all'} onChange={e=>{ const m=e.target.value; setFilters(prev=>({startDate:prev.startDate,endDate:prev.endDate,mode:m})); }}>
            <option value="all">All records</option>
            <option value="type">Type (income / expense)</option>
            <option value="category">Category</option>
            <option value="date">Date range</option>
          </select>
        </div>

        {/* conditional controls based on chosen filter */}
        { (filters.mode === 'type') && (
          <div>
            <div style={{fontSize:12,opacity:0.8}}>Type</div>
            <label style={{marginRight:8}}><input type="checkbox" checked={typeChecks.income} onChange={e=>setTypeChecks(prev=>({...prev,income:e.target.checked}))} /> Income</label>
            <label><input type="checkbox" checked={typeChecks.expense} onChange={e=>setTypeChecks(prev=>({...prev,expense:e.target.checked}))} /> Expense</label>
          </div>
        )}

        { (filters.mode === 'category') && (
          <div>
            <div style={{fontSize:12,opacity:0.8}}>Categories</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',maxWidth:420}}>
              {Object.keys(categoryChecks).length===0 ? <div style={{opacity:0.7}}>No categories yet</div> : Object.keys(categoryChecks).map(c=> (
                <label key={c} style={{fontSize:13}}>
                  <input type="checkbox" checked={categoryChecks[c]} onChange={e=>setCategoryChecks(prev=>({...prev,[c]:e.target.checked}))} /> {c}
                </label>
              ))}
            </div>
          </div>
        )}

        { (filters.mode === 'date') && (
          <div>
            <div style={{fontSize:12,opacity:0.8}}>Date range</div>
            <input type="date" value={filters.startDate} onChange={e=>setFilters(prev=>({...prev,startDate:e.target.value}))} />
            <input type="date" value={filters.endDate} onChange={e=>setFilters(prev=>({...prev,endDate:e.target.value}))} />
          </div>
        )}

          <div style={{alignSelf:'flex-end'}}>
            <button className="btn" onClick={applyFilters}>Done</button>
            <button onClick={()=>{ setTypeChecks({income:true,expense:true}); setCategoryChecks(prev=>{ const out={}; Object.keys(prev).forEach(k=>out[k]=true); return out }); setFilters({startDate:'',endDate:'',mode:'all'}); setTimeout(load,0); }} style={{marginLeft:8}}>Reset</button>
          </div>
        </div>
      ) : (
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12,gap:8}}>
          <button className="btn" onClick={load}>Refresh</button>
          <button className="btn" onClick={()=>setShowFilters(s=>!s)}>{showFilters? 'Hide Filters':'Filters'}</button>
        </div>
      )}

      {/* Filter panel when in Get mode and toggled */}
      {mode==='get' && showFilters && (
        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:12,alignItems:'center'}}>
          <div>
            <div style={{fontSize:12,opacity:0.8}}>Filter by</div>
            <select value={filters.mode || 'all'} onChange={e=>{ const m=e.target.value; setFilters(prev=>({startDate:prev.startDate,endDate:prev.endDate,mode:m})); }}>
              <option value="all">All records</option>
              <option value="type">Type (income / expense)</option>
              <option value="category">Category</option>
              <option value="date">Date range</option>
            </select>
          </div>

          { (filters.mode === 'type') && (
            <div>
              <div style={{fontSize:12,opacity:0.8}}>Type</div>
              <label style={{marginRight:8}}><input type="checkbox" checked={typeChecks.income} onChange={e=>setTypeChecks(prev=>({...prev,income:e.target.checked}))} /> Income</label>
              <label><input type="checkbox" checked={typeChecks.expense} onChange={e=>setTypeChecks(prev=>({...prev,expense:e.target.checked}))} /> Expense</label>
            </div>
          )}

          { (filters.mode === 'category') && (
            <div>
              <div style={{fontSize:12,opacity:0.8}}>Categories</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',maxWidth:420}}>
                {Object.keys(categoryChecks).length===0 ? <div style={{opacity:0.7}}>No categories yet</div> : Object.keys(categoryChecks).map(c=> (
                  <label key={c} style={{fontSize:13}}>
                    <input type="checkbox" checked={categoryChecks[c]} onChange={e=>setCategoryChecks(prev=>({...prev,[c]:e.target.checked}))} /> {c}
                  </label>
                ))}
              </div>
            </div>
          )}

          { (filters.mode === 'date') && (
            <div>
              <div style={{fontSize:12,opacity:0.8}}>Date range</div>
              <input type="date" value={filters.startDate} onChange={e=>setFilters(prev=>({...prev,startDate:e.target.value}))} />
              <input type="date" value={filters.endDate} onChange={e=>setFilters(prev=>({...prev,endDate:e.target.value}))} />
            </div>
          )}

          <div style={{alignSelf:'flex-end'}}>
            <button className="btn" onClick={applyFilters}>Search</button>
            <button onClick={()=>{ setTypeChecks({income:true,expense:true}); setCategoryChecks(prev=>{ const out={}; Object.keys(prev).forEach(k=>out[k]=true); return out }); setFilters({startDate:'',endDate:'',mode:'all'}); setShowFilters(false); setTimeout(load,0); }} style={{marginLeft:8}}>Reset</button>
          </div>
        </div>
      )}

      {/* Create / Update form (shown for create or update) */}
      {(!readonly && (mode==='create' || mode==='update')) && (
        <form onSubmit={submit} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
          <input placeholder="Amount" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} required />
          <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required />
          <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required />
          <input placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
          <div>
            <button className="btn" type="submit">{mode==='update' ? 'Update' : 'Create'}</button>
            {mode==='update' && <button type="button" onClick={()=>{ setEditing(null); setForm({amount:'',type:'income',category:'',date:'',notes:''}); setMode('get');}}>Cancel</button>}
          </div>
        </form>
      )}

      {/* List / actions */}
      {loading ? <Spinner /> : (
        <div style={{maxHeight:260,overflow:'auto'}}>
          {records.length===0? <div>No records</div> : (
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th>Notes</th><th>Actions</th></tr></thead>
              <tbody>
                {records.map(r=> (
                  <tr key={r._id} style={{borderTop:'1px solid #eee'}}>
                    <td style={{padding:8}}>{new Date(r.date).toLocaleDateString()}</td>
                    <td style={{padding:8}}>{r.type}</td>
                    <td style={{padding:8}}>{r.category}</td>
                    <td style={{padding:8}}>{r.amount}</td>
                    <td style={{padding:8}}>{r.notes}</td>
                    <td style={{padding:8}}>
                      {!readonly ? (
                        mode === 'update' ? (
                          <button onClick={()=>onEdit(r)}>Edit</button>
                        ) : mode === 'delete' ? (
                          <button onClick={()=>onDelete(r._id)}>Delete</button>
                        ) : (
                          <span style={{opacity:0.85}}>Select Update or Delete mode</span>
                        )
                      ) : (
                        <span style={{opacity:0.8}}>Read-only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
