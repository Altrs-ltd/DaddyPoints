return (
  <div className="app-container">

    <div className="card" style={{ marginBottom: 12 }}>
      <h1>Daddy Points</h1>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <div className="mascot"><img src={AVATARS.Leo} alt="Leo" /></div>
        <div className="mascot"><img src={AVATARS.Tyler} alt="Tyler" /></div>
        <div className="mascot"><img src={AVATARS.Ryker} alt="Ryker" /></div>
      </div>
    </div>

    <div className="card" style={{ marginBottom: 12 }}>
      <label>
        Upload weekly Excel
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          style={{ display: 'block', marginTop: 8 }}
        />
      </label>
      <div style={{ marginTop: 8 }}>
        <button className="small-ctrl" onClick={() => {}}>
          Show Full Week
        </button>
      </div>
    </div>

    <div className="card" style={{ marginBottom: 12 }}>
      <h3>Today's Tasks</h3>
      {todayTasks.length === 0 ? (
        <div>No tasks for today. Upload the sheet.</div>
      ) : (
        todayTasks.map((t) => (
          <div key={t.id} className="task-row">
            <div>
              <strong>{t.task}</strong>
              <div style={{ fontSize: 12 }}>{t.assigned}</div>
            </div>
            <div>
              <div style={{ fontSize: 12 }}>+1</div>
              <button
                className={t.done ? 'btn-done btn' : 'btn-complete btn'}
                onClick={() =>
                  toggleDone(DAY_ORDER[new Date().getDay()], t.id)
                }
              >
                {t.done ? 'Done ✅' : 'Complete'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>

    <div className="card">
      <h3>Points</h3>
      {PLAYERS.map((p) => (
        <div
          key={p}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 6,
          }}
        >
          <div>{p}</div>
          <div>{points[p] || 0}</div>
        </div>
      ))}
    </div>
  </div>
);
