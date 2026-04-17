import { useState, useEffect, useCallback } from 'react'

const DRILLS = [
  { id: 'draw', name: 'Draw & Dry Fire', desc: 'Full draw from holster to first shot', reps: 10 },
  { id: 'sight', name: 'Sight Alignment', desc: 'Focus on front sight, trigger press', reps: 15 },
  { id: 'trigger', name: 'Trigger Control', desc: 'Slow press without disturbing sights', reps: 20 },
  { id: 'reload', name: 'Emergency Reload', desc: 'Drop mag, insert fresh mag, rack', reps: 5 },
  { id: 'malfunction', name: 'Malfunction Clear', desc: 'Tap, rack, assess', reps: 5 },
  { id: 'retention', name: 'Retention Position', desc: 'Close-quarters retention shooting', reps: 10 },
  { id: 'scan', name: 'Scan & Assess', desc: 'Post-shot scan, reholster safely', reps: 10 },
]

const STORAGE_KEY = 'ccw-dryfire-v1'

function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function getStreak(data) {
  let streak = 0
  const d = new Date()
  while (true) {
    const key = d.toISOString().slice(0, 10)
    if (!data[key] || !data[key].completed) break
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export default function App() {
  const [data, setData] = useState(loadData)
  const [tab, setTab] = useState('today')
  const [activeDrill, setActiveDrill] = useState(null)
  const [repsLeft, setRepsLeft] = useState(0)
  const [notes, setNotes] = useState('')

  const today = todayKey()
  const todayData = data[today] || { drills: {}, completed: false, notes: '' }

  useEffect(() => {
    saveData(data)
  }, [data])

  const startDrill = useCallback((drill) => {
    setActiveDrill(drill)
    setRepsLeft(drill.reps)
  }, [])

  const logRep = useCallback(() => {
    if (repsLeft <= 1) {
      // Mark drill complete
      setData(prev => {
        const updated = { ...prev }
        const day = updated[today] || { drills: {}, completed: false, notes: '' }
        day.drills = { ...day.drills, [activeDrill.id]: true }
        const allDone = DRILLS.every(d => day.drills[d.id])
        day.completed = allDone
        updated[today] = day
        return updated
      })
      setActiveDrill(null)
      setRepsLeft(0)
    } else {
      setRepsLeft(r => r - 1)
    }
  }, [repsLeft, activeDrill, today])

  const saveNotes = useCallback(() => {
    setData(prev => {
      const updated = { ...prev }
      const day = updated[today] || { drills: {}, completed: false, notes: '' }
      day.notes = notes
      updated[today] = day
      return updated
    })
  }, [notes, today])

  const streak = getStreak(data)
  const completedToday = DRILLS.filter(d => todayData.drills?.[d.id]).length

  if (activeDrill) {
    return (
      <div style={styles.screen}>
        <div style={styles.drillActive}>
          <div style={styles.drillName}>{activeDrill.name}</div>
          <div style={styles.drillDesc}>{activeDrill.desc}</div>
          <div style={styles.repCount}>{repsLeft}</div>
          <div style={styles.repLabel}>reps remaining</div>
          <button style={styles.repBtn} onClick={logRep}>
            {repsLeft === 1 ? 'COMPLETE' : 'REP DONE'}
          </button>
          <button style={styles.cancelBtn} onClick={() => setActiveDrill(null)}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.screen}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>CCW DRY-FIRE</div>
        <div style={styles.streakBadge}>{streak} day streak</div>
      </div>

      <div style={styles.tabs}>
        {['today', 'history', 'notes'].map(t => (
          <button
            key={t}
            style={{...styles.tab, ...(tab === t ? styles.tabActive : {})}}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {tab === 'today' && (
          <div>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${(completedToday / DRILLS.length) * 100}%`}} />
            </div>
            <div style={styles.progressText}>{completedToday}/{DRILLS.length} drills complete</div>

            {DRILLS.map(drill => {
              const done = !!todayData.drills?.[drill.id]
              return (
                <div key={drill.id} style={{...styles.drillCard, ...(done ? styles.drillDone : {})}}>
                  <div style={styles.drillInfo}>
                    <div style={styles.drillCardName}>{drill.name}</div>
                    <div style={styles.drillCardDesc}>{drill.desc} • {drill.reps} reps</div>
                  </div>
                  {done ? (
                    <div style={styles.checkmark}>✓</div>
                  ) : (
                    <button style={styles.startBtn} onClick={() => startDrill(drill)}>
                      START
                    </button>
                  )}
                </div>
              )
            })}

            {todayData.completed && (
              <div style={styles.completedBanner}>
                🎯 Session Complete! Stay safe out there.
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div>
            <div style={styles.sectionTitle}>Last 14 Days</div>
            {Array.from({length: 14}, (_, i) => {
              const d = new Date()
              d.setDate(d.getDate() - i)
              const key = d.toISOString().slice(0, 10)
              const day = data[key]
              const done = day?.completed
              const partial = day ? Object.keys(day.drills || {}).length : 0
              return (
                <div key={key} style={styles.historyRow}>
                  <div style={styles.historyDate}>
                    {i === 0 ? 'Today' : d.toLocaleDateString('en', {weekday:'short', month:'short', day:'numeric'})}
                  </div>
                  <div style={{...styles.historyStatus, color: done ? 'var(--green)' : partial > 0 ? 'var(--amber)' : 'var(--text-dim)'}}>
                    {done ? 'Complete' : partial > 0 ? `${partial}/${DRILLS.length}` : 'Rest'}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'notes' && (
          <div>
            <div style={styles.sectionTitle}>Session Notes</div>
            <textarea
              style={styles.notesInput}
              value={notes || todayData.notes || ''}
              onChange={e => setNotes(e.target.value)}
              placeholder="What did you work on? Any issues to address?"
              rows={6}
            />
            <button style={styles.saveBtn} onClick={saveNotes}>Save Notes</button>
            <div style={styles.sectionTitle}>Firearms Safety Rules</div>
            {[
              'TREAT every firearm as if it is loaded',
              'NEVER point at anything you are not willing to destroy',
              'KEEP finger off trigger until sights are on target',
              'KNOW your target and what is beyond it'
            ].map((rule, i) => (
              <div key={i} style={styles.safetyRule}>{rule}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  screen: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: 'var(--bg)',
    color: 'var(--text)',
    maxWidth: 480,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px 8px',
    paddingTop: 'max(16px, env(safe-area-inset-top))',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 2,
    color: 'var(--amber)',
  },
  streakBadge: {
    background: 'var(--amber-dim)',
    color: 'var(--amber)',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
  },
  tabs: {
    display: 'flex',
    padding: '0 20px',
    gap: 8,
    borderBottom: '1px solid #333',
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: 'var(--text-dim)',
    padding: '8px 0',
    fontSize: 14,
    cursor: 'pointer',
    borderRadius: 8,
  },
  tabActive: {
    color: 'var(--amber)',
    background: 'rgba(245,158,11,0.1)',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 20px',
    paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
  },
  progressBar: {
    height: 6,
    background: 'var(--surface2)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'var(--amber)',
    borderRadius: 3,
    transition: 'width 0.3s',
  },
  progressText: {
    fontSize: 13,
    color: 'var(--text-dim)',
    marginBottom: 16,
    textAlign: 'right',
  },
  drillCard: {
    display: 'flex',
    alignItems: 'center',
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: '14px 16px',
    marginBottom: 10,
    gap: 12,
  },
  drillDone: {
    opacity: 0.6,
  },
  drillInfo: { flex: 1 },
  drillCardName: { fontSize: 16, fontWeight: 600, marginBottom: 2 },
  drillCardDesc: { fontSize: 12, color: 'var(--text-dim)' },
  startBtn: {
    background: 'var(--amber)',
    color: '#000',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontWeight: 700,
    fontSize: 12,
    cursor: 'pointer',
    letterSpacing: 1,
  },
  checkmark: {
    color: 'var(--green)',
    fontSize: 22,
    fontWeight: 700,
  },
  completedBanner: {
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid var(--green)',
    color: 'var(--green)',
    borderRadius: 'var(--radius)',
    padding: '14px 16px',
    textAlign: 'center',
    fontSize: 15,
    marginTop: 8,
  },
  drillActive: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  drillName: { fontSize: 22, fontWeight: 700, color: 'var(--amber)', textAlign: 'center' },
  drillDesc: { fontSize: 14, color: 'var(--text-dim)', textAlign: 'center', marginBottom: 16 },
  repCount: { fontSize: 96, fontWeight: 700, lineHeight: 1, color: 'var(--text)' },
  repLabel: { fontSize: 14, color: 'var(--text-dim)', marginBottom: 32 },
  repBtn: {
    width: '100%',
    maxWidth: 300,
    background: 'var(--amber)',
    color: '#000',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '20px 0',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: 2,
    marginBottom: 12,
  },
  cancelBtn: {
    background: 'none',
    border: '1px solid #444',
    color: 'var(--text-dim)',
    borderRadius: 'var(--radius)',
    padding: '10px 24px',
    fontSize: 14,
    cursor: 'pointer',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  historyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    background: 'var(--surface)',
    borderRadius: 8,
    marginBottom: 6,
  },
  historyDate: { fontSize: 14 },
  historyStatus: { fontSize: 13, fontWeight: 600 },
  notesInput: {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid #444',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    padding: 14,
    fontSize: 14,
    resize: 'vertical',
    marginBottom: 12,
    fontFamily: 'inherit',
  },
  saveBtn: {
    background: 'var(--amber)',
    color: '#000',
    border: 'none',
    borderRadius: 8,
    padding: '10px 24px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 24,
  },
  safetyRule: {
    background: 'var(--surface)',
    borderLeft: '3px solid var(--amber)',
    padding: '10px 14px',
    marginBottom: 8,
    borderRadius: '0 8px 8px 0',
    fontSize: 13,
    lineHeight: 1.4,
  },
}
