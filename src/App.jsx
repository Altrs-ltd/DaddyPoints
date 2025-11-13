
import React, {useEffect, useState} from 'react';
import { parseExcelFinal } from './utils/parseExcel';
const PLAYERS=['Leo','Tyler','Ryker'];
const AVATARS = { Leo: '/assets/leo-bear.svg', Tyler: '/assets/tyler-otter.svg', Ryker: '/assets/ryker-cat.svg' };
const LS_POINTS='dp_v441_points', LS_WEEK='dp_v441_week', LS_COMPLETED='dp_v441_completed';
const DAY_ORDER=['SUN','MON','TUE','WED','THU','FRI','SAT'];
export default function App(){
  const [points,setPoints]=useState(()=>{ const r=localStorage.getItem(LS_POINTS); if(r) try{return JSON.parse(r);}catch{} const b={}; PLAYERS.forEach(p=>b[p]=0); return b; });
  const [week,setWeek]=useState(()=>{ const r=localStorage.getItem(LS_WEEK); if(r) try{return JSON.parse(r);}catch{} return null; });
  const [completedMap,setCompletedMap]=useState(()=>{ const r=localStorage.getItem(LS_COMPLETED); if(r) try{return JSON.parse(r);}catch{} return {}; });
  const [todayTasks,setTodayTasks]=useState([]);
  useEffect(()=>{ localStorage.setItem(LS_POINTS, JSON.stringify(points)); },[points]);
  useEffect(()=>{ localStorage.setItem(LS_WEEK, JSON.stringify(week)); computeToday(); },[week]);
  useEffect(()=>{ localStorage.setItem(LS_COMPLETED, JSON.stringify(completedMap)); },[completedMap]);
  useEffect(()=>{ computeToday(); },[]);

  function computeToday(){ if(!week){ setTodayTasks([]); return; } const today=DAY_ORDER[new Date().getDay()]; const list=week[today]||[]; setTodayTasks(list.map(item=>{ const key=`${today}_${item.rowIndex}`; return {...item, done: !!completedMap[key]}; })); }

  async function handleFile(e){ const file=e.target.files[0]; if(!file) return; try{ const parsed = await parseExcelFinal(file); const norm={}; Object.entries(parsed).forEach(([day,list])=>{ norm[day]=list.map((it,idx)=>({...it, id:`${day}-${it.rowIndex}-${it.assigned}-${idx}`})); }); setWeek(norm); }catch(err){ console.error(err); } }

  function toggleDone(day,id){ if(!week) return; const item = (week[day]||[]).find(t=>t.id===id); if(!item) return; const key = `${day}_${item.rowIndex}`; const player = item.assigned; setCompletedMap(prev=>{ const next = {...prev}; if(next[key]){ delete next[key]; setPoints(p=>({...p,[player]:Math.max(0,(p[player]||0)-1)})); } else { next[key]={when:Date.now(),assignee:player}; setPoints(p=>({...p,[player]:(p[player]||0)+1})); } return next; }); computeToday(); }

  return (<div className="container">
    <div className="card" style={{marginBottom:12}}><h1>Daddy Points</h1><div style={{display:'flex',gap:12,marginTop:8}}><div className="mascot"><img src={AVATARS.Leo} alt="Leo"/></div><div className="mascot"><img src={AVATARS.Tyler} alt="Tyler"/></div><div className="mascot"><img src={AVATARS.Ryker} alt="Ryker"/></div></div></div>
    <div className="card" style={{marginBottom:12}}>
      <label>Upload weekly Excel<input type="file" accept=".xlsx,.xls" onChange={handleFile} style={{display:'block',marginTop:8}}/></label>
      <div style={{marginTop:8}}><button className="small-ctrl" onClick={()=>{}}>Show Full Week</button></div>
    </div>
    <div className="card" style={{marginBottom:12}}>
      <h3>Today's Tasks</h3>
      {todayTasks.length===0 ? <div>No tasks for today. Upload the sheet.</div> : todayTasks.map(t=>(<div key={t.id} className="task-row"><div><strong>{t.task}</strong><div style={{fontSize:12}}>{t.assigned}</div></div><div><div style={{fontSize:12}}>+1</div><button className={t.done? 'btn-done btn':'btn-complete btn'} onClick={()=>toggleDone(DAY_ORDER[new Date().getDay()], t.id)}>{t.done? 'Done ✅':'Complete'}</button></div></div>))}
    </div>
    <div className="card"><h3>Points</h3>{PLAYERS.map(p=>(<div key={p} style={{display:'flex',justifyContent:'space-between',padding:6}}><div>{p}</div><div>{points[p]||0}</div></div>))}</div>
  </div>);
