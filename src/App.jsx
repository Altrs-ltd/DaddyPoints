import React, { useEffect, useState } from "react";
import { parseExcel } from "./parseExcel.js";
import { loadState, saveState } from "./storage.js";

const PLAYERS = ["Leo", "Tyler", "Ryker"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function App() {
  const [state, setState] = useState(loadState());
  const [showWeek, setShowWeek] = useState(false);

  useEffect(() => saveState(state), [state]);

  const today = DAYS[new Date().getDay()];

  function toggleDone(day, id) {
  setState((prev) => {
    const tasks = { ...prev.tasks };

    let delta = 0;

    tasks[day] = tasks[day].map((t) => {
      if (t.id !== id) return t;

      // IMPORTANT: calculate points BEFORE toggling
      delta = t.done ? -1 : 1;

      return { ...t, done: !t.done };
    });

    const points = { ...prev.points };
    const changedTask = prev.tasks[day].find((t) => t.id === id);

    if (changedTask) {
      points[changedTask.who] += delta;
    }

    return { ...prev, tasks, points };
  });
}


  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const week = await parseExcel(file);
    setState(prev => ({ ...prev, tasks: week }));
  }

  return (
    <div>
      <h1>Daddy Points (Phase 1)</h1>
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
      <button onClick={() => setShowWeek(!showWeek)}>
        {showWeek ? "Show Today" : "Show Full Week"}
      </button>

      {(showWeek ? DAYS : [today]).map(day => (
        <div key={day}>
          <h3>{day}</h3>
          {(state.tasks[day] || []).map(t => (
            <div key={t.id}>
              {t.task} — {t.who}
              <button onClick={() => toggleDone(day, t.id)}>
                {t.done ? "Done" : "Complete"}
              </button>
            </div>
          ))}
        </div>
      ))}

      <h2>Points</h2>
      {PLAYERS.map(p => (
        <div key={p}>{p}: {state.points[p]}</div>
      ))}
    </div>
  );
}
