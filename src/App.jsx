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
    short: "Full draw to first shot — 3 yards",
    principles: "TARGET FOCUS",
    steps: [
      "Stand at 3 yards, gun holstered and concealed. Feet shoulder-width, knees slightly bent.",
      "On the start beep: drive your eyes hard to the target — pick a specific spot you want to hit.",
      "With your eyes already on the target, establish your firing grip on the gun while it is still in the holster.",
      "Draw: clear the holster, rotate the muzzle toward the target, and drive the gun out to full extension.",
      "As the gun reaches full extension, place your finger on the trigger. The front sight will appear blurry — that is correct. Keep your eyes on the target.",
      "Press the trigger straight back with a smooth, decisive press until the striker falls (dry fire click).",
      "Follow through: hold the trigger back, confirm your sight picture, then release trigger to reset.",
      "On the stop beep: safely lower the gun. Reholster only when the timer shows the rest period."
    ],
    tips: [
      "Ben Stoeger: Your grip is set in the holster. Lock your firing hand high on the backstrap before the gun moves.",
      "Joel Park: Drive your eyes to the target first. Your hands follow your eyes, not the other way around.",
      "As the muzzle rises into your line of sight the front sight will be blurry. That is correct. Press the trigger while focused on the target.",
      "Strive for a consistent four-count draw: grip, clear, rotate, extend. Each count should be equally fast.",
      "Par goal: full draw and press in under 1.5s from concealment.",
    ],
  },
  {
    id: "sight", name: "Sight Picture & Index", icon: "🎯", par: 2.0, reps: 10,
    short: "Target-focus index drill — 5 yards",
    principles: "TARGET FOCUS",
    steps: [
      "Stand at 5 yards, gun at a low-ready position (muzzle angled down 45 degrees, finger off trigger).",
      "On the start beep: snap your eyes to a precise aiming point on the target.",
      "Drive the gun up from low-ready to full extension, indexed on the spot your eyes are focused on.",
      "Do NOT shift your focus to the front sight. Maintain hard focus on the target.",
      "When the gun reaches full extension, press the trigger straight back. The front sight will be in your peripheral vision — that is enough at 5 yards.",
      "Press the trigger with a smooth, decisive movement until the striker falls (dry fire click).",
      "Follow through: maintain your grip and eye contact with the target for one full second after the press.",
      "Return to low-ready on the stop beep. Evaluate: did the gun stay on target or did it dip? Dipping means anticipation."
    ],
    tips: [
      "Joel Park: Hard-focus on a specific point on the target — a button, a mark, a small spot. The smaller the focal point, the better your hit.",
      "Practice calling your shot: before the gun moves, mentally commit to where the bullet will land based on your sight picture.",
      "Dry-fire is perfect for building the neural pathway of see target, index sights, press. Repeat 10 times.",
      "If you catch yourself focusing on the front sight exclusively, intentionally look harder at a specific spot on the target.",
    ],
  },
  {
    id: "trigger", name: "Trigger Control", icon: "⚙️", par: 3.0, reps: 15,
    short: "One decisive press per rep — 3 yards",
    principles: "TRIGGER RESET",
    steps: [
      "Stand at 3 yards, gun at compressed ready (gun at sternum height, elbows bent, muzzle forward).",
      "On the start beep: press out to full extension, establish target focus, place finger on trigger.",
      "Each rep = ONE press: press the trigger straight back decisively until the striker falls (click). The goal is SPEED — press fast enough that the gun does not have time to move.",
      "After the click: ride the trigger forward ONLY until you feel the reset click. Stop there. Do not slap it all the way forward.",
      "If the gun muzzle dips during the press, you are anticipating the shot. Slow down slightly until the gun stays level, then build speed.",
      "Diagnose your trigger press: a dip means anticipation, a pull to the left means trigger finger pulling across (for right-handers), a push high means grip breaking.",
      "On the stop beep: hold the trigger back, confirm sight picture, then safely lower the gun.",
      "Par goal: 1 clean press per rep with no gun movement in 3 seconds or less."
    ],
    tips: [
      "Ben Stoeger: Trigger control is about SPEED, not being gentle. Press fast enough that the gun does not have time to move.",
      "Joel Park: The trigger finger should move straight back with no side-to-side fishing. If the gun dips you are anticipating.",
      "After each press, ride the trigger forward only until you feel the reset click. Do not slap it forward.",
      "Diagnose flinching: if the gun dips on every press, slow down 20% and build speed gradually. Flinching is a learned reflex that dry-fire can undo.",
      "Par goal: 1 clean press per rep with no gun movement. 15 reps = 15 clean presses.",
    ],
  },
  {
    id: "reload", name: "Emergency Reload", icon: "🔄", par: 3.0, reps: 5,
    short: "Drop mag, insert fresh, rack — 3 yards",
    principles: "ECONOMY OF MOTION",
    steps: [
      "Stand at 3 yards, gun at low-ready with an empty or dummy magazine inserted. Have a spare magazine in your support-hand magazine pouch.",
      "On the start beep: keep your eyes on the target. Press the magazine release with your firing thumb as your support hand simultaneously moves toward the mag pouch.",
      "Let the empty magazine drop free (do not catch it). Your support hand should be gripping the fresh mag by now.",
      "While your support hand brings the fresh mag up, rotate the gun slightly toward your support hand — use gravity to help guide the magazine in.",
      "Insert the magazine firmly until it seats with a click. Tilt the gun back toward the target.",
      "If the slide is locked back: use your support hand thumb to hit the slide release, or slingshot the slide. Do not look away from the target.",
      "Drive the gun back to full extension with target focus. Press the trigger if threat is still up.",
      "On the stop beep: safely lower the gun and reholster during the rest period."
    ],
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
    short: "Tap-rack-reassess — 3 yards",
    principles: "GROSS MOTOR",
    steps: [
      "Stand at 3 yards, gun at full extension with an empty or dummy magazine (simulating a Type 1 failure to fire).",
      "On the start beep: the gun clicks instead of firing. Immediately execute Tap-Rack-Reassess.",
      "TAP: use the heel of your support hand to firmly tap the magazine base upward, seating the magazine.",
      "RACK: rotate the gun 90 degrees ejection-port up, reach over with your support hand, and rack the slide firmly rearward and release. This ejects the bad round and chambers a fresh one.",
      "REASSESS: drive the gun back to full extension, re-establish target focus, and press the trigger if the threat is still present.",
      "For Type 2 (stovepipe): swipe the ejection port with the edge of your support hand to clear the case, then rack.",
      "For Type 3 (double-feed): rip the magazine out, rack twice to clear, reinsert fresh magazine, rack, reassess.",
      "On the stop beep: safely lower the gun. Reholster during the rest period."
    ],
    tips: [
      "Ben Stoeger: Tap-Rack-Reassess must be a conditioned reflex. If you hesitate, you are thinking. It must be automatic.",
      "Joel Park: When the gun goes click, your default response should be automatic. Tap, Rack, Reassess. Build the reflex.",
      "Type 1 failure to fire: Tap-Rack. Type 2 stovepipe: swipe with support hand or rack. Type 3 double-feed: strip mag, rack twice, reload.",
      "Dry-fire Type 1 daily: lock slide back, insert empty mag, release, then practice Tap-Rack from a high compressed ready position.",
      "Always end the drill with eyes on the target assessing the threat. Do not stare at the gun.",
    ],
  },
  {
    id: "retention", name: "Retention Position", icon: "💪", par: 2.0, reps: 8,
    short: "Close-quarters retention firing — 1 yard",
    principles: "BODY INDEX",
    steps: [
      "Stand at 1 yard from the target. This drill simulates an extreme close-range threat.",
      "On the start beep: draw to retention position — do NOT extend the gun forward. Keep the gun at your hip/ribcage with elbow bent and tucked tight to your side.",
      "Retention position: firing hand elbow bent approximately 90 degrees and pinned to your ribs. Muzzle angled slightly forward of your body line. Wrist locked, gun parallel to the ground.",
      "Use your body index: rotate your hips and torso to point the gun at the target. Do NOT use the sights — rely on body alignment.",
      "Press the trigger straight back with a decisive press until the striker falls (click). The gun should not move.",
      "Maintain the retention position during follow-through. Keep your support hand close to your chest and away from the muzzle.",
      "On the stop beep: safely lower the gun and reholster during the rest period.",
      "Par goal: draw to retention and press in under 2 seconds."
    ],
    tips: [
      "Joel Park: In a retention position, the gun is indexed to your body. Elbow tucked, muzzle forward of your body, wrist locked.",
      "Ben Stoeger: You do not need the sights at close range. Train your index so the gun points where your body faces.",
      "Practice rotating your entire upper body to aim in retention — do not just move the gun arm.",
      "Keep your support hand pressed to your chest during this drill. At 1 yard, your support hand near the muzzle is a danger.",
      "Par goal: draw to retention and press in under 2 seconds from concealment.",
    ],
  },
  {
    id: "scan", name: "Scan & Assess", icon: "👀", par: 5.0, reps: 6,
    short: "Full sequence: draw, fire, scan, reholster — 5 yards",
    principles: "SITUATIONAL AWARENESS",
    steps: [
      "Stand at 5 yards, gun holstered. This drill trains the complete defensive shooting sequence from start to finish.",
      "On the start beep: establish target focus, then draw to full extension using your four-count draw (grip, clear, rotate, extend).",
      "Press the trigger decisively until the striker falls (dry fire click). This simulates your first shot on the threat.",
      "Follow through: hold the trigger back, maintain target focus, confirm your front sight is level and on target.",
      "Scan LEFT: turn your head left and actively look for additional threats. Physically move your head — do not just glance.",
      "Scan RIGHT: turn your head right and actively look for additional threats. Look past 180 degrees if possible.",
      "Assess: make a conscious decision that the threat is stopped and no other threats are present. Say out loud: clear.",
      "Safely decock or apply safety (if applicable). Lower the gun to low-ready.",
      "Reholster slowly and deliberately, eyes up and scanning. Never rush the holster.",
      "On the stop beep: if still in sequence, complete your scan and reholster safely."
    ],
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
  { week:1, day:2, label:"W1D2", focus:"Sight & Index", duration:10, drillIds:["sight","trigger","scan"] },
  { week:1, day:3, label:"W1D3", focus:"Trigger Mastery", duration:10, drillIds:["trigger","draw","scan"] },
  { week:1, day:4, label:"W1D4", focus:"Emergency Skills", duration:10, drillIds:["reload","malfunction","scan"] },
  { week:1, day:5, label:"W1D5", focus:"Full Sequence", duration:10, drillIds:["draw","sight","trigger","scan"] },
  { week:2, day:1, label:"W2D1", focus:"Speed Draw", duration:10, drillIds:["draw","retention","scan"] },
  { week:2, day:2, label:"W2D2", focus:"Precision Index", duration:10, drillIds:["sight","trigger","scan"] },
  { week:2, day:3, label:"W2D3", focus:"Reload Speed", duration:10, drillIds:["reload","draw","scan"] },
  { week:2, day:4, label:"W2D4", focus:"Malfunctions", duration:10, drillIds:["malfunction","trigger","scan"] },
  { week:2, day:5, label:"W2D5", focus:"Full Sequence", duration:10, drillIds:["draw","sight","reload","scan"] },
  { week:3, day:1, label:"W3D1", focus:"Retention & Draw", duration:10, drillIds:["retention","draw","scan"] },
  { week:3, day:2, label:"W3D2", focus:"Trigger Under Stress", duration:10, drillIds:["trigger","sight","scan"] },
  { week:3, day:3, label:"W3D3", focus:"Reload & Retention", duration:10, drillIds:["reload","retention","scan"] },
  { week:3, day:4, label:"W3D4", focus:"Malfunction Drill", duration:10, drillIds:["malfunction","draw","scan"] },
  { week:3, day:5, label:"W3D5", focus:"Full Defensive Sequence", duration:10, drillIds:["draw","sight","trigger","reload","scan"] },
  { week:4, day:1, label:"W4D1", focus:"Par Challenge: Draw", duration:10, drillIds:["draw","retention","scan"] },
  { week:4, day:2, label:"W4D2", focus:"Par Challenge: Trigger", duration:10, drillIds:["trigger","sight","scan"] },
  { week:4, day:3, label:"W4D3", focus:"Par Challenge: Reload", duration:10, drillIds:["reload","malfunction","scan"] },
  { week:4, day:4, label:"W4D4", focus:"Complete Skills Check", duration:10, drillIds:["draw","sight","trigger","reload","malfunction","scan"] },
  { week:4, day:5, label:"W4D5", focus:"Final Assessment", duration:10, drillIds:["draw","sight","trigger","reload","retention","malfunction","scan"] },
]

const REST_MS = 5000
const STORAGE_KEY = "hollie-ccw-v2"
function loadData() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") } catch(e) { return {} } }
function saveData(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) } catch(e) {} }

export default function App() {
  var s0 = useState(loadData), data = s0[0], setData = s0[1]
  var s1 = useState("home"), view = s1[0], setView = s1[1]
  var s2 = useState(null), selectedSession = s2[0], setSelectedSession = s2[1]
  var s3 = useState(0), sessionDrillIdx = s3[0], setSessionDrillIdx = s3[1]
  var s4 = useState(null), selectedDrill = s4[0], setSelectedDrill = s4[1]
  var s5 = useState(null), expandedTip = s5[0], setExpandedTip = s5[1]
  var s6 = useState(false), parRunning = s6[0], setParRunning = s6[1]
  var s7 = useState(0), parElapsed = s7[0], setParElapsed = s7[1]
  var s8 = useState(0), parRepCount = s8[0], setParRepCount = s8[1]
  var s9 = useState(false), parResting = s9[0], setParResting = s9[1]
  var s10 = useState(0), restCountdown = s10[0], setRestCountdown = s10[1]
  var s11 = useState(false), parWaiting = s11[0], setParWaiting = s11[1]

  var audioCtxRef = useRef(null)
  var parIntervalRef = useRef(null)
  var restIntervalRef = useRef(null)
  var waitTimeoutRef = useRef(null)
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
    setParWaiting(true)

    var randomDelay = 1000 + Math.random() * 2000

    waitTimeoutRef.current = setTimeout(function() {
      setParWaiting(false)
      var ctx2 = getAudioCtx()
      startBeep(ctx2)

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
              var ctx3 = getAudioCtx()
              stopBeep(ctx3)
              setParRunning(false)
            } else {
              doRest(function() {
                var ctx4 = getAudioCtx()
                startBeep(ctx4)
                runRep()
              })
            }
          }
        }, 100)
      }

      runRep()
    }, randomDelay)
  }, [])

  var stopPar = useCallback(function() {
    clearInterval(parIntervalRef.current)
    clearInterval(restIntervalRef.current)
    clearTimeout(waitTimeoutRef.current)
    setParRunning(false)
    setParResting(false)
    setParWaiting(false)
    setParElapsed(0)
  }, [])

  useEffect(function() {
    return function() {
      clearInterval(parIntervalRef.current)
      clearInterval(restIntervalRef.current)
      clearTimeout(waitTimeoutRef.current)
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
        <h1>🤠  Hotbabe Hollie&apos;s<br/>CCW Training App</h1>
        <p className="sub">Target-Focus &middot; 4 Weeks &middot; 10 Min/Day</p>
      </header>
      <div className="progress-card">
        <div className="prog-label">{totalDone} / {PROGRAM.length} sessions complete</div>
        <div className="prog-bar-bg">
          <div className="prog-bar-fill" style={{width: pct + "%"}}></div>
        </div>
        <p className="prog-msg">
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
                      <div className="srow-label">{s.label}</div>
                      <div className="srow-focus">{s.focus}</div>
                    </div>
                  </div>
                  <span className="srow-arrow">&rsaquo;</span>
                </div>
              )
            })}
          </div>
        ) })}
        <div style={{height:"40px"}} />
      </div>
    )
  }

  if (view === "session" && selectedSession) {
    var drills = selectedSession.drillIds.map(function(id) { return DRILLS.find(function(d) { return d.id === id }) }).filter(Boolean)
    var currentDrill = drills[sessionDrillIdx]
    var isLast = sessionDrillIdx >= drills.length - 1
    return (
      <div className="app">
        <header>
          <button className="back-btn" onClick={function() { stopPar(); setView("program") }}>&larr; Back</button>
          <h2>{selectedSession.label}: {selectedSession.focus}</h2>
          <p className="sub">Drill {sessionDrillIdx + 1} of {drills.length}</p>
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
              waiting={parWaiting}
              onStart={function() { startPar(currentDrill) }} onStop={stopPar} />
            <button className="btn-tips" onClick={function() { setSelectedDrill(currentDrill); setView("tips") }}>
              💡 Tips &amp; Technique
            </button>
          </div>
        )}
        <div className="session-nav">
          {sessionDrillIdx > 0 && (
            <button className="btn-nav" onClick={function() { stopPar(); setSessionDrillIdx(sessionDrillIdx - 1) }}>&larr; Prev</button>
          )}
          {!isLast && (
            <button className="btn-nav btn-nav-next" onClick={function() { stopPar(); setSessionDrillIdx(sessionDrillIdx + 1) }}>Next &rarr;</button>
          )}
          {isLast && (
            <button className="btn-done" onClick={function() { stopPar(); markSessionDone(selectedSession); setView("home") }}>
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
          <div className="steps-section">
            <div className="steps-heading">📋 Step-by-Step Instructions</div>
            {d.steps.map(function(step, i) { return (
              <div key={i} className="step-item">
                <div className="step-num">{i+1}</div>
                <div className="step-text">{step}</div>
              </div>
            ) })}
          </div>
          <div className="tips-heading">💡 Tips &amp; Principles</div>
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
          waiting={parWaiting}
          onStart={function() { startPar(d) }} onStop={stopPar} />
        <div style={{height:"80px"}} />
      </div>
    )
  }

  return null
}

function ParTimer(props) {
  var drill = props.drill, running = props.running, elapsed = props.elapsed
  var repCount = props.repCount, resting = props.resting, restCountdown = props.restCountdown
  var waiting = props.waiting
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

      {waiting ? (
        <div className="par-rest-box">
          <div className="par-rest-label">&#8987; Random delay&hellip; get ready!</div>
          <div className="par-bar-bg">
            <div className="par-bar-fill par-bar-pulse" style={{width: "60%", background: "#6366f1"}} />
          </div>
          <div className="par-rest-countdown">&#8226;</div>
        </div>
      ) : resting ? (
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
        <div className="par-done">&#10003; {repCount} rep{repCount !== 1 ? "s" : ""} completed!</div>
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
