
import * as XLSX from 'xlsx';
export function parseExcelFinal(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = (e)=>{
      try{
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data,{type:'array'});
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet,{header:1,defval:''});
        console.log('📘 Raw sheet preview (first 12 rows):', rows.slice(0,12));
        const taskCol = 1;
        const colMap = { SUN:3, MON:5, TUE:7, WED:9, THU:11, FRI:13, SAT:15 };
        const startRow = 3; const endRow = 20;
        const week = { SUN:[], MON:[], TUE:[], WED:[], THU:[], FRI:[], SAT:[] };
        for(let r=startRow;r<=endRow;r++){
          const taskName = (rows[r] && rows[r][taskCol]) ? String(rows[r][taskCol]).trim() : '';
          if(!taskName) continue;
          Object.entries(colMap).forEach(([day,colIdx])=>{
            const assignee = (rows[r] && rows[r][colIdx]) ? String(rows[r][colIdx]).trim() : '';
            if(assignee && assignee.toString().trim()!=='') {
              const clean = assignee.toString().replace(/\s+/g,' ').replace(/WHO|DAY|DONE/gi,'').trim();
              if(clean) week[day].push({ rowIndex: r - startRow, task: taskName, assigned: clean });
            }
          });
        }
        console.log('✅ Parsed weekly tasks:', week);
        resolve(week);
      }catch(err){ console.error('❌ parseExcelFinal error:', err); reject(err); }
    };
    reader.onerror = err => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
