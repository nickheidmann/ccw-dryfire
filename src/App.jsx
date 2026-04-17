import { useState, useEffect, useCallback, useRef } from 'react'

function beep(ctx, freq, dur, vol, delay) {
  freq = freq || 880; dur = dur || 0.15; vol = vol || 0.6; delay = delay || 0;
  var osc = ctx.createOscillator()
  var gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, ctx.currentTime + delay)
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + dur)
  osc.start(ctx.currentTime + delay)
  osc.stop(ctx.currentTime + delay + dur + 0.05)
}
function startBeep(ctx) { beep(ctx, 880, 0.12, 0.5, 0) }
function stopBeep(ctx) {
  beep(ctx, 660, 0.12, 0.5, 0)
  beep(ctx, 880, 0.18, 0.7, 0.15)
}

const DRILLS = [
  {
    id: "draw", name: "Draw & Dry Fire", icon: "🔫", par: 1.5, reps: 5,
    short: "Full draw to first shot", principles: "TARGET FOCUS",
    tips: [
      "Ben Stoeger: Your grip is set in the holster. Lock your firing hand high on the backstrap before the gun moves.",
      "Joel Park: Drive your eyes to the target first. Your hands follow your eyes, not the other way around.",
      "As the muzzle rises into your line of sight the front sight will be blurry. That is correct. Press the trigger while looking through the sights at the target.",
      "Strive for a consistent four-count draw: grip, clear, rotate, extend. Each count should be equally fast.",
      "Par goal: full draw and press in under 1.5s from concealment.",
    ],
  },
  {
    id: "sight", name: "Sight Picture & Index", icon: "🎯", par: 2.0, reps: 10,
    short: "Target-focus index drill", principles: "TARGET FOCUS",
    tips: [
      "Joel Park: Hard-focus on the target. The front sight will drift into your peripheral soft-focus. Trust it.",
      "Ben Stoeger: Acceptable sight picture means front sight roughly centered at approximately the right height. Do not chase perfection. Press the trigger.",
      "Practice calling your shot: before the gun moves, mentally commit to where the bullet will land based on your sight picture.",
      "Dry-fire is perfect for building the neural pathway of see target, index sights, press. Repeat 10 times.",
      "If you catch yourself focusing on the front sight exclusively, intentionally look harder at a specific spot on the target.",
    ],
  },
  {
    id: "trigger", name: "Trigger Control", icon: "☝️", par: 3.0, reps: 15,
    short: "Press without disturbing sights", principles: "TRIGGER RESET",
    tips: [
      "Ben Stoeger: Trigger control is about SPEED, not being gentle. Press fast enough that the gun does not have time to move.",
      "Joel Park: The trigger finger should move straight back with no side-to-side fishing. If the gun dips you are anticipating.",
      "After each press, ride the trigger forward only until you feel the reset click. Do not slap it forward.",
      "Diagnose flinch in dry-fire: balance a coin on the front sight. If it falls during the press, you are anticipating recoil.",
      "Goal: 15 clean presses where the sights never move off a 1 inch dot at 10 feet.",
    ],
  },
  {
    id: "reload", name: "Emergency Reload", icon: "🔄", par: 3.0, reps: 5,
    short: "Drop mag, insert fresh, rack", principles: "ECONOMY OF MOTION",
    tips: [
      "Ben Stoeger: The reload starts with the eyes. Look to your spare mag as soon as you decide to reload, not after the empty drops.",
      "Joel Park: Your support hand should be traveling to the mag pouch as the firing hand hits the mag release. Overlap the motions.",
      "Practice the gravity assist: tilt the pistol slightly toward the support hand. Gravity helps seat the magazine.",
      "Keep your eyes on the threat during the reload, glancing only briefly to acquire the magazine.",
      "Par goal: emergency reload with slide locked back completed and on target in under 3 seconds.",
    ],
  },
  {
    id: "malfunction", name: "Malfunction Clear", icon: "⚠️", par: 4.0, reps: 5,
    short: "Tap-rack-reassess", principles: "GROSS MOTOR",
    tips: [
      "Ben Stoeger: Tap-Rack-Bang is a gross-motor emergency fix. Hit the baseplate hard enough to seat the mag, rack decisively.",
      "Joel Park: When the gun goes click, your default response should be automatic. Tap, Rack, Reassess. Build the reflex.",
      "Type 1 failure to fire: Tap-Rack. Type 2 stovepipe: swipe with support hand or rack. Type 3 double-feed: strip mag, rack twice, reload.",
      "Dry-fire Type 1 daily: lock slide back, insert empty mag, release, then practice Tap-Rack from a high compressed ready position.",
      "Always end the drill with eyes on the target assessing the threat. Do not stare at the gun.",
    ],
  },
  {
    id: "retention", name: "Retention Position", icon: "💪", par: 2.0, reps: 8,
    short: "Close-quarters index shooting", principles: "BODY INDEX",
    tips: [
      "Joel Park: In a retention position, the gun is indexed to your body. Elbow tucked, muzzle forward of your body, wrist locked.",
      "Ben Stoeger: You do not need the sights at close range. Train your index so the gun points where your body faces.",
      "Practice a smooth extension from retention to a full two-hand grip at eye level. This is a common real-world sequence.",
      "Keep your support hand pulled tight against your chest to avoid the muzzle crossing your hand.",
      "Vary distance in your mental picture: 1 foot for contact, 3 feet for close quarters, 5 feet for near retention.",
    ],
  },
  {
    id: "scan", name: "Scan & Assess", icon: "👁️", par: 5.0, reps: 6,
    short: "Post-shot scan, reholster safely", principles: "SITUATIONAL AWARENESS",
    tips: [
      "Joel Park: After every drill, build the habit. Scan left, scan right, look over your shoulder. Make it real. Move your head.",
      "Ben Stoeger: The threat may have friends. Your scan is not a formality. You are genuinely looking for additional threats.",
      "After scanning, safely decock or apply safety before reholstering. Never rush the holster.",
      "Practice a one-second mental reset after the scan: breathe out, identify that the threat is down, then reholster with eyes up.",
      "Dry-fire full sequence: draw, press, follow-through, scan left and right, reholster. This trains the complete defensive sequence.",
    ],
  },
]

const PROGRAM = [
  { week:1, day:1, label:"W1D1", focus:"Draw Fundamentals", duration:10, drillIds:["draw","trigger","scan"] },
  { week:1, day:2, label:"W1D2", focus:"Sight & Trigger", duration:10, drillIds:["sight","trigger","scan"] },
  { week:1, day:3, label:"W1D3", focus:"Draw & Index", duration:10, drillIds:["draw","sight","scan"] },
  { week:1, day:4, label:"W1D4", focus:"Reload Intro", duration:10, drillIds:["reload","trigger","scan"] },
  { week:1, day:5, label:"W1D5", focus:"Full Sequence", duration:10, drillIds:["draw","trigger","reload","scan"] },
  { week:2, day:1, label:"W2D1", focus:"Speed Draw", duration:10, drillIds:["draw","draw","trigger","scan"] },
  { week:2, day:2, label:"W2D2", focus:"Trigger Mastery", duration:10, drillIds:["trigger","trigger","sight","scan"] },
  { week:2, day:3, label:"W2D3", focus:"Reload Speed", duration:10, drillIds:["reload","reload","draw","scan"] },
  { week:2, day:4, label:"W2D4", focus:"Malfunctions", duration:10, drillIds:["malfunction","malfunction","trigger","scan"] },
  { week:2, day:5, label:"W2D5", focus:"Full Sequence", duration:10, drillIds:["draw","trigger","reload","malfunction","scan"] },
  { week:3, day:1, label:"W3D1", focus:"Retention & Draw", duration:10, drillIds:["retention","draw","scan"] },
  { week:3, day:2, label:"W3D2", focus:"Trigger Under Stress", duration:10, drillIds:["trigger","retention","sight","scan"] },
  { week:3, day:3, label:"W3D3", focus:"Reload & Retention", duration:10, drillIds:["reload","retention","malfunction","scan"] },
  { week:3, day:4, label:"W3D4", focus:"Malfunction Drill", duration:10, drillIds:["malfunction","malfunction","reload","scan"] },
  { week:3, day:5, label:"W3D5", focus:"Full Defensive Sequence", duration:10, drillIds:["draw","retention","trigger","reload","malfunction","scan"] },
  { week:4, day:1, label:"W4D1", focus:"Par Challenge: Draw", duration:10, drillIds:["draw","draw","draw","scan"] },
  { week:4, day:2, label:"W4D2", focus:"Par Challenge: Trigger", duration:10, drillIds:["trigger","trigger","trigger","scan"] },
  { week:4, day:3, label:"W4D3", focus:"Par Challenge: Reload", duration:10, drillIds:["reload","reload","reload","scan"] },
  { week:4, day:4, label:"W4D4", focus:"Complete Skills Check", duration:10, drillIds:["draw","sight","trigger","reload","malfunction","retention","scan"] },
  { week:4, day:5, label:"W4D5", focus:"Graduation Day", duration:10, drillIds:["draw","sight","trigger","reload","malfunction","retention","scan"] },
]

const REST_MS = 5000
const STORAGE_KEY = "hollie-ccw-v2"
function loadData() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") } catch(e) { return {} } }
function saveData(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) } catch(e) {} }

export default function App() {
  var stateHooks = [
    useState(loadData),
    useState("home"),
    useState(null),
    useState(0),
    useState(null),
    useState(null),
    useState(false),
    useState(0),
    useState(0),
    useState(false),
    useState(0),
  ]
  var data = stateHooks[0][0], setData = stateHooks[0][1]
  var view = stateHooks[1][0], setView = stateHooks[1][1]
  var selectedSession = stateHooks[2][0], setSelectedSession = stateHooks[2][1]
  var sessionDrillIdx = stateHooks[3][0], setSessionDrillIdx = stateHooks[3][1]
  var selectedDrill = stateHooks[4][0], setSelectedDrill = stateHooks[4][1]
  var expandedTip = stateHooks[5][0], setExpandedTip = stateHooks[5][1]
  var parRunning = stateHooks[6][0], setParRunning = stateHooks[6][1]
  var parElapsed = stateHooks[7][0], setParElapsed = stateHooks[7][1]
  var parRepCount = stateHooks[8][0], setParRepCount = stateHooks[8][1]
  var parResting = stateHooks[9][0], setParResting = stateHooks[9][1]
  var restCountdown = stateHooks[10][0], setRestCountdown = stateHooks[10][1]
  var audioCtxRef = useRef(null)
  var parIntervalRef = useRef(null)
  var restIntervalRef = useRef(null)
  var parRepRef = useRef(0)
  var parElapsedRef = useRef(0)

  function getAudioCtx() {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume()
    return audioCtxRef.current
  }

  function doRest(onDone) {
    var ctx = getAudioCtx()
    stopBeep(ctx)
    setParResting(true)
    var remaining = REST_MS / 1000
    setRestCountdown(remaining)
    restIntervalRef.current = setInterval(function() {
      remaining -= 1
      setRestCountdown(remaining)
      if (remaining <= 0) {
        clearInterval(restIntervalRef.current)
        setParResting(false)
        onDone()
      }
    }, 1000)
  }

  var startPar = useCallback(function(drill) {
    var ctx = getAudioCtx()
    var par = drill.par
    var reps = drill.reps
    parRepRef.current = 0
    parElapsedRef.current = 0
    setParRepCount(0)
    setParElapsed(0)
    setParRunning(true)
    setParResting(false)
    startBeep(ctx)

    function runRep() {
      parElapsedRef.current = 0
      setParElapsed(0)
      parIntervalRef.current = setInterval(function() {
        parElapsedRef.current += 0.1
        setParElapsed(+(parElapsedRef.current.toFixed(1)))
        if (parElapsedRef.current >= par) {
          clearInterval(parIntervalRef.current)
          parRepRef.current += 1
          setParRepCount(parRepRef.current)
          if (parRepRef.current >= reps) {
            var ctx2 = getAudioCtx()
            stopBeep(ctx2)
            setParRunning(false)
          } else {
            doRest(function() {
              var ctx3 = getAudioCtx()
              startBeep(ctx3)
              runRep()
            })
          }
        }
      }, 100)
    }

    parIntervalRef.current = setInterval(function() {
      parElapsedRef.current += 0.1
      setParElapsed(+(parElapsedRef.current.toFixed(1)))
      if (parElapsedRef.current >= par) {
        clearInterval(parIntervalRef.current)
        parRepRef.current += 1
        setParRepCount(parRepRef.current)
        if (parRepRef.current >= reps) {
          var ctx2 = getAudioCtx()
          stopBeep(ctx2)
          setParRunning(false)
        } else {
          doRest(function() {
            var ctx3 = getAudioCtx()
            startBeep(ctx3)
            runRep()
          })
        }
      }
    }, 100)
  }, [])

  var stopPar = useCallback(function() {
    clearInterval(parIntervalRef.current)
    clearInterval(restIntervalRef.current)
    setParRunning(false)
    setParResting(false)
    setParElapsed(0)
    setParRepCount(0)
    setRestCountdown(0)
    parRepRef.current = 0
    parElapsedRef.current = 0
  }, [])

  useEffect(function() {
    return function() {
      clearInterval(parIntervalRef.current)
      clearInterval(restIntervalRef.current)
    }
  }, [])

  function persist(next) { setData(next); saveData(next) }
  function sessionKey(s) { return s.label }
  function isDone(s) { return !!data[sessionKey(s)] }
  var totalDone = PROGRAM.filter(isDone).length
  var pct = Math.round((totalDone / PROGRAM.length) * 100)
  var nextSession = PROGRAM.find(function(s) { return !isDone(s) }) || PROGRAM[PROGRAM.length - 1]
  function markSessionDone(s) { persist(Object.assign({}, data, { [sessionKey(s)]: { ts: Date.now() } })) }

  if (view === "home") return (
    <div className="app">
      <header>
        <h1>🤠 Hotbabe Hollie&apos;s<br/>CCW Training App</h1>
        <p className="sub">Target-Focus &middot; 4 Weeks &middot; 10 Min/Day</p>
      </header>
      <div className="progress-card">
        <div className="prog-row">
          <span>{totalDone} / {PROGRAM.length} sessions</span>
          <span className="pct">{pct}%</span>
        </div>
        <div className="bar-bg"><div className="bar-fill" style={{width: pct + "%"}} /></div>
        <p className="prog-note">
          {totalDone === 0 && "Ready to start? Let’s go!"}
          {totalDone > 0 && totalDone < PROGRAM.length && ("Next: " + nextSession.label + " — " + nextSession.focus)}
          {totalDone === PROGRAM.length && "🏆 4-Week Program Complete!"}
        </p>
      </div>
      <div className="btn-group">
        <button className="btn-primary" onClick={function() { setView("program") }}>📅 4-Week Program</button>
        <button className="btn-secondary" onClick={function() { setView("drill") }}>🔫 Drill Library</button>
      </div>
      {totalDone < PROGRAM.length && (
        <button className="btn-start-big" onClick={function() { setSelectedSession(nextSession); setSessionDrillIdx(0); setView("session") }}>
          Start {nextSession.label}
        </button>
      )}
    </div>
  )

  if (view === "program") {
    var weeks = [1,2,3,4]
    return (
      <div className="app">
        <header>
          <button className="back-btn" onClick={function() { setView("home") }}>&larr; Back</button>
          <h2>📅 4-Week Program</h2>
        </header>
        {weeks.map(function(w) { return (
          <div key={w} className="week-block">
            <div className="week-label">WEEK {w}</div>
            {PROGRAM.filter(function(s) { return s.week === w }).map(function(s) {
              var done = isDone(s)
              return (
                <div key={s.label} className={"session-row" + (done ? " done" : "")}
                  onClick={function() { setSelectedSession(s); setSessionDrillIdx(0); setView("session") }}>
                  <div className="srow-left">
                    <span className="srow-check">{done ? "✅" : "⬜"}</span>
                    <div>
                      <div className="srow-title">{s.label}: {s.focus}</div>
                      <div className="srow-sub">{s.drillIds.map(function(id) { var d = DRILLS.find(function(d) { return d.id===id }); return d ? d.icon : "" }).join(" ")} &middot; {s.duration} min</div>
                    </div>
                  </div>
                  <span className="srow-arrow">&rsaquo;</span>
                </div>
              )
            })}
          </div>
        ) })}
        <div style={{height:"80px"}} />
      </div>
    )
  }

  if (view === "session" && selectedSession) {
    var s = selectedSession
    var drillIds = s.drillIds
    var currentId = drillIds[sessionDrillIdx]
    var currentDrill = DRILLS.find(function(d) { return d.id === currentId })
    var isLast = sessionDrillIdx === drillIds.length - 1
    return (
      <div className="app">
        <header>
          <button className="back-btn" onClick={function() { stopPar(); setView("program") }}>&larr; Back</button>
          <h2>{s.label}: {s.focus}</h2>
          <p className="sub">Drill {sessionDrillIdx+1} of {drillIds.length}</p>
        </header>
        {currentDrill && (
          <div className="drill-card">
            <div className="drill-header">
              <span className="drill-icon">{currentDrill.icon}</span>
              <div>
                <div className="drill-name">{currentDrill.name}</div>
                <div className="drill-short">{currentDrill.short}</div>
                <div className="drill-badge">{currentDrill.principles}</div>
              </div>
            </div>
            <ParTimer drill={currentDrill} running={parRunning} elapsed={parElapsed}
              repCount={parRepCount} resting={parResting} restCountdown={restCountdown}
              onStart={function() { startPar(currentDrill) }} onStop={stopPar} />
            <button className="btn-tips" onClick={function() { setSelectedDrill(currentDrill); setView("tips") }}>
              📖 Tips &amp; Technique
            </button>
          </div>
        )}
        <div className="session-nav">
          {sessionDrillIdx > 0 && (
            <button className="btn-secondary" onClick={function() { stopPar(); setSessionDrillIdx(function(i) { return i-1 }) }}>&larr; Prev</button>
          )}
          {!isLast ? (
            <button className="btn-primary" onClick={function() { stopPar(); setSessionDrillIdx(function(i) { return i+1 }) }}>Next &rarr;</button>
          ) : (
            <button className="btn-finish" onClick={function() { stopPar(); markSessionDone(s); setView("program") }}>
              ✅ Complete Session
            </button>
          )}
        </div>
      </div>
    )
  }

  if (view === "drill") return (
    <div className="app">
      <header>
        <button className="back-btn" onClick={function() { setView("home") }}>&larr; Back</button>
        <h2>🔫 Drill Library</h2>
      </header>
      {DRILLS.map(function(d) { return (
        <div key={d.id} className="drill-row" onClick={function() { setSelectedDrill(d); setView("tips") }}>
          <span className="drill-icon-sm">{d.icon}</span>
          <div>
            <div className="drill-row-name">{d.name}</div>
            <div className="drill-row-sub">{d.short} &middot; Par: {d.par}s &middot; x{d.reps}</div>
          </div>
          <span className="srow-arrow">&rsaquo;</span>
        </div>
      ) })}
      <div style={{height:"40px"}} />
    </div>
  )

  if (view === "tips" && selectedDrill) {
    var d = selectedDrill
    return (
      <div className="app">
        <header>
          <button className="back-btn" onClick={function() { setView(selectedSession ? "session" : "drill") }}>&larr; Back</button>
          <h2>{d.icon} {d.name}</h2>
          <p className="sub">{d.principles}</p>
        </header>
        <div className="tips-card">
          <div className="tip-meta">Par: <b>{d.par}s</b> &middot; Reps: <b>{d.reps}</b> &middot; Rest: <b>5s between</b></div>
          {d.tips.map(function(tip, i) { return (
            <div key={i} className={"tip-item" + (expandedTip===i ? " expanded" : "")}
              onClick={function() { setExpandedTip(expandedTip===i ? null : i) }}>
              <div className="tip-num">{i+1}</div>
              <div className="tip-text">{tip}</div>
            </div>
          ) })}
        </div>
        <ParTimer drill={d} running={parRunning} elapsed={parElapsed}
          repCount={parRepCount} resting={parResting} restCountdown={restCountdown}
          onStart={function() { startPar(d) }} onStop={stopPar} />
        <div style={{height:"60px"}} />
      </div>
    )
  }

  return null
}

function ParTimer(props) {
  var drill = props.drill, running = props.running, elapsed = props.elapsed
  var repCount = props.repCount, resting = props.resting, restCountdown = props.restCountdown
  var onStart = props.onStart, onStop = props.onStop
  var pct = Math.min(100, (elapsed / drill.par) * 100)
  var barColor = pct > 85 ? "#ef4444" : pct > 60 ? "#f59e0b" : "#22c55e"
  var restPct = resting ? Math.round(((5 - restCountdown) / 5) * 100) : 0
  return (
    <div className="par-timer">
      <div className="par-header">
        <span>&#9201; Par Timer &mdash; {drill.par}s x {drill.reps} reps</span>
        {(running || resting) && <span className="par-rep-count">Rep {repCount+1}/{drill.reps}</span>}
      </div>

      {resting ? (
        <div className="par-rest-box">
          <div className="par-rest-label">&#8987; Reset &amp; reholster&hellip;</div>
          <div className="par-bar-bg">
            <div className="par-bar-fill" style={{width: restPct + "%", background: "#6366f1"}} />
          </div>
          <div className="par-rest-countdown">{restCountdown}s</div>
        </div>
      ) : (
        <>
          <div className="par-bar-bg">
            <div className="par-bar-fill" style={{width: pct + "%", background: barColor}} />
          </div>
          <div className="par-time-row">
            <span className="par-elapsed">{elapsed.toFixed(1)}s</span>
            <span className="par-goal">{drill.par}s</span>
          </div>
        </>
      )}

      {repCount > 0 && !running && !resting && (
        <div className="par-done">✅ {repCount} rep{repCount > 1 ? "s" : ""} completed!</div>
      )}
      <div className="par-btns">
        {!running && !resting
          ? <button className="btn-par-start" onClick={onStart}>&#9654; Start Par Timer</button>
          : <button className="btn-par-stop" onClick={onStop}>&#9632; Stop</button>
        }
      </div>
    </div>
  )
}
