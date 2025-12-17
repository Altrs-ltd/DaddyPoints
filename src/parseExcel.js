import * as XLSX from "xlsx";

const DAY_COLUMNS = {
  SUN: 3, MON: 5, TUE: 7, WED: 9, THU: 11, FRI: 13, SAT: 15
};

export function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const week = {};
      Object.keys(DAY_COLUMNS).forEach(day => {
        week[day] = [];
        for (let r = 3; r <= 20; r++) {
          const task = rows[r]?.[1];
          const who = rows[r]?.[DAY_COLUMNS[day]];
          if (!task || !who) continue;
          week[day].push({ id: `${day}-${r}`, task, who, done: false });
        }
      });

      console.log("Parsed week:", week);
      resolve(week);
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
}
