import { useState, useRef } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07080f;--s1:#0e0f1a;--s2:#151623;
  --b1:rgba(255,255,255,0.07);--b2:rgba(255,255,255,0.13);
  --accent:#7c6dfa;--a2:#f06292;--green:#26d98b;--amber:#fbbf24;--red:#f43f5e;
  --txt:#eeeef8;--muted:#7777aa;
  --font:'Plus Jakarta Sans',sans-serif;--mono:'Fira Code',monospace;
}
body{background:var(--bg);color:var(--txt);font-family:var(--font);min-height:100vh}
.app{min-height:100vh;background-image:radial-gradient(ellipse 60% 40% at 15% 5%,rgba(124,109,250,0.13) 0%,transparent 60%),radial-gradient(ellipse 50% 35% at 85% 90%,rgba(240,98,146,0.09) 0%,transparent 60%)}
.hdr{display:flex;align-items:center;gap:10px;padding:1rem 2rem;border-bottom:1px solid var(--b1);background:rgba(7,8,15,0.8);position:sticky;top:0;z-index:10}
.hdr-logo{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,var(--accent),var(--a2));display:flex;align-items:center;justify-content:center;font-size:17px}
.hdr-name{font-size:16px;font-weight:700;letter-spacing:-.5px}
.hdr-name em{color:var(--accent);font-style:normal}
.badge{margin-left:auto;font-size:10px;font-family:var(--mono);color:var(--accent);background:rgba(124,109,250,0.12);border:1px solid rgba(124,109,250,0.28);padding:3px 10px;border-radius:20px}
.main{max-width:860px;margin:0 auto;padding:2.5rem 1.5rem}
.hero{text-align:center;margin-bottom:2.5rem}
.hero h1{font-size:clamp(1.8rem,4.5vw,3rem);font-weight:800;letter-spacing:-1.5px;line-height:1.1;margin-bottom:.8rem}
.grad{background:linear-gradient(135deg,var(--accent),var(--a2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{color:var(--muted);font-size:.95rem;line-height:1.65;max-width:500px;margin:0 auto}
.free-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(38,217,139,0.1);border:1px solid rgba(38,217,139,0.25);color:var(--green);font-size:12px;font-weight:600;padding:5px 14px;border-radius:20px;margin-bottom:1.2rem}
.card-wrap{background:var(--s1);border:1px solid var(--b2);border-radius:18px;padding:1.5rem;margin-bottom:1rem}
.lbl{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:.6rem}
textarea{width:100%;background:var(--s2);border:1px solid var(--b1);border-radius:10px;color:var(--txt);font-family:var(--font);font-size:13px;line-height:1.6;padding:.8rem 1rem;resize:vertical;outline:none;transition:border .2s}
textarea:focus{border-color:var(--accent)}
textarea::placeholder{color:var(--muted)}
.drop{border:2px dashed var(--b2);border-radius:14px;padding:1.5rem;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:.8rem}
.drop:hover{border-color:var(--accent);background:rgba(124,109,250,0.05)}
.drop p{color:var(--muted);font-size:.88rem;margin-top:.4rem}
.fprev{background:var(--s2);border:1px solid var(--b2);border-radius:10px;padding:.75rem 1rem;display:flex;align-items:center;gap:10px;margin-bottom:.8rem}
.fprev-info{flex:1;min-width:0}
.fprev-name{font-size:13px;font-weight:600}
.fprev-ok{font-size:11px;color:var(--green);margin-top:2px}
.fprev-rm{background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:3px 7px;border-radius:6px}
.fprev-rm:hover{color:var(--red)}
.or{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:12px;margin:.6rem 0}
.or::before,.or::after{content:'';flex:1;height:1px;background:var(--b2)}
.btn-main{width:100%;padding:.95rem;background:linear-gradient(135deg,var(--accent),#9f8ffc);border:none;border-radius:13px;color:#fff;font-family:var(--font);font-size:1rem;font-weight:700;cursor:pointer;transition:opacity .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.btn-main:hover{opacity:.88}
.btn-main:disabled{opacity:.4;cursor:not-allowed}
.spin{width:42px;height:42px;border:3px solid var(--b2);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 1rem}
@keyframes spin{to{transform:rotate(360deg)}}
.loading{text-align:center;padding:3rem;background:var(--s1);border-radius:18px;margin-top:1.5rem}
.results{margin-top:2rem;animation:up .4s ease}
@keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.shero{background:var(--s1);border:1px solid var(--b1);border-radius:18px;padding:1.5rem;display:flex;align-items:center;gap:1.5rem;margin-bottom:1rem;flex-wrap:wrap}
.sring{width:100px;height:100px;border-radius:50%;border:4px solid;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0}
.snum{font-size:2rem;font-weight:800;line-height:1}
.sdenom{font-size:11px;color:var(--muted)}
.slbl{font-size:12px;font-weight:600;margin-top:3px}
.sright{flex:1}
.sright h2{font-size:1.1rem;font-weight:800;margin-bottom:.4rem;letter-spacing:-.3px}
.sright p{color:var(--muted);font-size:13px;line-height:1.65}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.chip{font-size:11px;padding:3px 9px;border-radius:20px;background:rgba(124,109,250,0.12);color:#b0aaff;border:1px solid rgba(124,109,250,0.22);font-family:var(--mono)}
.card{background:var(--s1);border:1px solid var(--b1);border-radius:16px;padding:1.1rem;margin-bottom:1rem}
.ctitle{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:.9rem;display:flex;align-items:center;gap:6px}
.cdot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;margin-bottom:1rem}
.brow{display:flex;align-items:center;gap:8px;margin-bottom:11px}
.brow:last-child{margin-bottom:0}
.bname{font-size:12px;width:130px;flex-shrink:0}
.btrack{flex:1;height:6px;background:var(--s2);border-radius:3px;overflow:hidden}
.bfill{height:100%;border-radius:3px}
.bpct{font-size:11px;font-weight:700;width:30px;text-align:right;font-family:var(--mono)}
.kw-list{display:flex;flex-wrap:wrap;gap:5px}
.kw{font-size:11px;padding:3px 9px;border-radius:20px;font-family:var(--mono)}
.kw-f{background:rgba(38,217,139,.1);color:var(--green);border:1px solid rgba(38,217,139,.22)}
.kw-m{background:rgba(244,63,94,.08);color:var(--red);border:1px solid rgba(244,63,94,.2)}
.ilist{list-style:none}
.ilist li{padding:8px 0;border-bottom:1px solid var(--b1);font-size:13px;line-height:1.55;display:flex;gap:8px;align-items:flex-start}
.ilist li:last-child{border-bottom:none}
.btn-reset{width:100%;padding:.75rem;background:transparent;border:1px solid var(--b2);border-radius:11px;color:var(--muted);font-family:var(--font);font-size:.88rem;cursor:pointer;margin-top:.75rem;transition:all .2s}
.btn-reset:hover{border-color:var(--accent);color:var(--accent)}
.err{background:rgba(244,63,94,.07);border:1px solid rgba(244,63,94,.22);border-radius:12px;padding:1rem;margin-top:1rem;color:var(--red);font-size:13px;line-height:1.7}
`;

const BARCOLORS = ["#7c6dfa","#26d98b","#fbbf24","#f06292","#38bdf8"];
const scoreColor = s => s>=80?"#26d98b":s>=60?"#fbbf24":"#f43f5e";

export default function App() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef();

  function handleFile(f) {
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setResumeText(e.target.result);
    reader.readAsText(f);
  }

  async function analyze() {
    const text = resumeText.trim();
    if (!text || text.length < 50) { setError("Please paste your resume text or upload a .txt file."); return; }
    setLoading(true); setError(""); setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text, jobDescription: jd })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError("Analysis failed. Make sure backend is running on port 5000. Error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  const c = result ? scoreColor(result.ats_score) : "#7c6dfa";
  const chanceColor = result?.shortlist_chance==="High"?"#26d98b":result?.shortlist_chance==="Medium"?"#fbbf24":"#f43f5e";

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <header className="hdr">
          <div className="hdr-logo">🎯</div>
          <div className="hdr-name">Resume<em>AI</em> Analyzer</div>
          <div className="badge">Powered by Gemini · Free</div>
        </header>

        <main className="main">
          {!result && !loading && (
            <>
              <div className="hero">
                <div className="free-tag">✅ 100% Free — Google Gemini AI</div>
                <h1>Is Your Resume<br /><span className="grad">Strong Enough?</span></h1>
                <p>Get ATS score, keyword gaps & fixes in seconds — completely free.</p>
              </div>

              <div className="card-wrap">
                <label className="lbl">📄 Upload Resume (.txt file) — optional</label>
                {!file ? (
                  <div className="drop" onClick={() => inputRef.current.click()}>
                    <input ref={inputRef} type="file" accept=".txt" style={{display:"none"}} onChange={e => handleFile(e.target.files[0])} />
                    <div style={{fontSize:"1.8rem"}}>📁</div>
                    <p>Click to upload .txt resume file</p>
                  </div>
                ) : (
                  <div className="fprev">
                    <span style={{fontSize:"1.5rem"}}>📋</span>
                    <div className="fprev-info">
                      <div className="fprev-name">{file.name}</div>
                      <div className="fprev-ok">✓ Loaded successfully</div>
                    </div>
                    <button className="fprev-rm" onClick={() => { setFile(null); setResumeText(""); }}>✕</button>
                  </div>
                )}

                <div className="or">OR paste directly</div>

                <label className="lbl">✍️ Paste Your Resume Text *</label>
                <textarea
                  rows={10}
                  placeholder="Paste your full resume text here... (Open resume → Ctrl+A → Ctrl+C → Ctrl+V here)"
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                />
              </div>

              <div className="card-wrap">
                <label className="lbl">💼 Job Description (Optional — for role-specific match)</label>
                <textarea
                  rows={5}
                  placeholder="Paste job description from Naukri / LinkedIn here for keyword match analysis..."
                  value={jd}
                  onChange={e => setJd(e.target.value)}
                />
              </div>

              <button className="btn-main" onClick={analyze} disabled={!resumeText.trim()}>
                🚀 Analyze My Resume
              </button>
              {error && <div className="err">⚠️ {error}</div>}
            </>
          )}

          {loading && (
            <div className="loading">
              <div className="spin" />
              <h3 style={{fontSize:"1.05rem",fontWeight:700,marginBottom:".4rem"}}>Gemini AI is analyzing...</h3>
              <p style={{color:"var(--muted)",fontSize:".88rem"}}>Scanning keywords · scoring impact · finding gaps</p>
            </div>
          )}

          {result && (
            <div className="results">
              <div className="shero">
                <div className="sring" style={{borderColor:c}}>
                  <span className="snum" style={{color:c}}>{result.ats_score}</span>
                  <span className="sdenom">/100</span>
                  <span className="slbl" style={{color:c}}>{result.ats_score>=80?"Strong":result.ats_score>=60?"Good":"Weak"}</span>
                </div>
                <div className="sright">
                  <h2>Score {result.ats_score}/100 · <span style={{color:chanceColor}}>{result.shortlist_chance} Shortlist Chance</span></h2>
                  <p>{result.verdict}</p>
                  <div className="chips">{(result.best_roles||[]).map((r,i)=><span key={i} className="chip">{r}</span>)}</div>
                </div>
              </div>

              <div className="card">
                <div className="ctitle"><span className="cdot" style={{background:BARCOLORS[0]}}/>Score Breakdown</div>
                {Object.entries(result.score_breakdown||{}).map(([k,v],i)=>(
                  <div key={k} className="brow">
                    <span className="bname">{k}</span>
                    <div className="btrack"><div className="bfill" style={{width:`${v}%`,background:BARCOLORS[i%5]}}/></div>
                    <span className="bpct" style={{color:BARCOLORS[i%5]}}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="grid2">
                <div className="card">
                  <div className="ctitle"><span className="cdot" style={{background:"#26d98b"}}/>Keywords Found ✓</div>
                  <div className="kw-list">{(result.keywords_found||[]).map((k,i)=><span key={i} className={`kw kw-f`}>{k}</span>)}</div>
                </div>
                <div className="card">
                  <div className="ctitle"><span className="cdot" style={{background:"#f43f5e"}}/>Keywords Missing ✗</div>
                  <div className="kw-list">{(result.keywords_missing||[]).map((k,i)=><span key={i} className={`kw kw-m`}>{k}</span>)}</div>
                </div>
              </div>

              <div className="grid2">
                <div className="card">
                  <div className="ctitle"><span className="cdot" style={{background:"#26d98b"}}/>Your Strengths</div>
                  <ul className="ilist">{(result.strengths||[]).map((s,i)=><li key={i}><span>✅</span>{s}</li>)}</ul>
                </div>
                <div className="card">
                  <div className="ctitle"><span className="cdot" style={{background:"#fbbf24"}}/>Fixes to Boost Score</div>
                  <ul className="ilist">{(result.fixes||[]).map((f,i)=><li key={i}><span>⚡</span>{f}</li>)}</ul>
                </div>
              </div>

              <button className="btn-reset" onClick={()=>{setResult(null);setResumeText("");setFile(null);setJd("");}}>
                ← Analyze Another Resume
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
