import React,{useEffect,useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import {createClient} from "@supabase/supabase-js";
import {BarChart3,BookOpen,CalendarDays,Camera,ChevronDown,CircleUserRound,FileText,LayoutDashboard,LogOut,Moon,Plus,Search,Settings,ShieldCheck,Sparkles,Target,TrendingUp,X} from "lucide-react";
import {AreaChart,Area,ResponsiveContainer,Tooltip,XAxis,YAxis} from "recharts";
import "./styles.css";

const url=import.meta.env.VITE_SUPABASE_URL,key=import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase=url&&key?createClient(url,key):null;
const demo=[
{id:1,trade_date:"2026-10-02",symbol:"XAUUSD",direction:"LONG",entry:3821.2,exit:3834.7,result_r:1.8,pnl:245.6,setup:"Breakout",session:"London"},
{id:2,trade_date:"2026-10-02",symbol:"BTCUSDT",direction:"SHORT",entry:121820,exit:121300,result_r:-1,pnl:-132.4,setup:"Retest",session:"New York"},
{id:3,trade_date:"2026-10-01",symbol:"EURUSD",direction:"LONG",entry:1.1742,exit:1.1761,result_r:1.4,pnl:187.2,setup:"Trend",session:"London"},
{id:4,trade_date:"2026-09-30",symbol:"NAS100",direction:"SHORT",entry:24810,exit:24720,result_r:-.7,pnl:-96.3,setup:"Liquidity",session:"New York"},
{id:5,trade_date:"2026-09-30",symbol:"GBPUSD",direction:"LONG",entry:1.3512,exit:1.3544,result_r:1.6,pnl:221.5,setup:"Breakout",session:"London"}];

function Auth({mode,setMode,email,setEmail,password,setPassword,name,setName,error,setError,loading,setLoading}){
 async function submit(e){e.preventDefault();setLoading(true);setError("");
  if(!supabase){setError("Connect Supabase in .env first.");setLoading(false);return}
  try{if(mode==="signup"){let r=await supabase.auth.signUp({email,password,options:{data:{full_name:name}}});if(r.error)throw r.error;setError("Account created — check your email to confirm.");}
  else{let r=await supabase.auth.signInWithPassword({email,password});if(r.error)throw r.error}}catch(e){setError(e.message)}setLoading(false)}
 return <div className="auth"><div className="glow"/><div className="authbox">
  <div className="logo"><span>Geo</span>Journaling</div><div className="sub">TRADING JOURNAL</div>
  <h1>{mode==="login"?"Welcome back":"Create your account"}</h1><p>Trade smarter. Trade disciplined.</p>
  <form onSubmit={submit}>{mode==="signup"&&<input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required/>}<input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} required/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} minLength="6" required/>{error&&<div className="error">{error}</div>}<button className="primary">{loading?"Please wait…":mode==="login"?"SIGN IN":"CREATE ACCOUNT"}</button></form>
  <div className="or">OR</div><button className="google" onClick={()=>setError("Enable Google provider in Supabase Auth to use this button.")}>G&nbsp; Continue with Google</button>
  <div className="switch">{mode==="login"?"Don't have an account?":"Already have an account?"} <button onClick={()=>{setMode(mode==="login"?"signup":"login");setError("")}}>{mode==="login"?"Create account":"Sign in"}</button></div>
 </div></div>
}

function Stat({title,value,sub,icon:Icon}){return <div className="stat"><div className="statrow"><span>{title}</span><i><Icon size={16}/></i></div><b>{value}</b><small>{sub}</small></div>}
function Modal({close,save}){
 return <div className="back"><div className="modal"><header><div><label>TRADE JOURNAL</label><h2>Add New Trade</h2></div><button className="x" onClick={close}><X/></button></header>
 <form className="tradeform" onSubmit={save}>
  <label>Date<input name="trade_date" type="date" defaultValue={new Date().toISOString().slice(0,10)}/></label><label>Instrument<input name="symbol" placeholder="BTCUSDT" required/></label>
  <label>Direction<select name="direction"><option>LONG</option><option>SHORT</option></select></label><label>Entry<input name="entry" type="number" step="any" required/></label>
  <label>Exit<input name="exit" type="number" step="any"/></label><label>Result (R)<input name="result_r" type="number" step="any" placeholder="1.5"/></label>
  <label>P&L ($)<input name="pnl" type="number" step="any" placeholder="250"/></label><label>Setup<select name="setup"><option>Breakout</option><option>Retest</option><option>Trend</option><option>Liquidity</option><option>Reversal</option><option>Range</option></select></label>
  <label>Session<select name="session"><option>London</option><option>New York</option><option>Asia</option></select></label><label className="wide">Notes<textarea name="notes" placeholder="Why did I take this trade? What did I learn?"/></label>
  <div className="actions"><button type="button" className="secondary" onClick={close}>Cancel</button><button className="primary">Save Trade</button></div>
 </form></div></div>
}
function App(){
 const [session,setSession]=useState(null),[mode,setMode]=useState("login"),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[name,setName]=useState(""),[error,setError]=useState(""),[loading,setLoading]=useState(false);
 const [page,setPage]=useState("Dashboard"),[trades,setTrades]=useState(demo),[modal,setModal]=useState(false),[menu,setMenu]=useState(false);
 useEffect(()=>{if(!supabase)return;supabase.auth.getSession().then(({data})=>setSession(data.session));const {data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>setSession(s));return()=>subscription.unsubscribe()},[]);
 async function save(e){e.preventDefault();let f=new FormData(e.currentTarget),t={id:crypto.randomUUID(),trade_date:f.get("trade_date"),symbol:String(f.get("symbol")).toUpperCase(),direction:f.get("direction"),entry:+(f.get("entry")||0),exit:+(f.get("exit")||0),result_r:+(f.get("result_r")||0),pnl:+(f.get("pnl")||0),setup:f.get("setup"),session:f.get("session")};setTrades(x=>[t,...x]);if(supabase&&session){let {id,...row}=t;let r=await supabase.from("trades").insert({...row,user_id:session.user.id});if(r.error)setError(r.error.message)}setModal(false)}
 if(!session)return <Auth mode={mode} setMode={setMode} email={email} setEmail={setEmail} password={password} setPassword={setPassword} name={name} setName={setName} error={error} setError={setError} loading={loading} setLoading={setLoading}/>;
 const pnl=trades.reduce((a,t)=>a+t.pnl,0),wins=trades.filter(t=>t.pnl>0).length,wr=wins/trades.length*100,profit=trades.filter(t=>t.pnl>0).reduce((a,t)=>a+t.pnl,0)/Math.max(1,Math.abs(trades.filter(t=>t.pnl<0).reduce((a,t)=>a+t.pnl,0))),avgR=trades.reduce((a,t)=>a+t.result_r,0)/trades.length;
 const curve=trades.slice().reverse().map((_,i)=>({n:i+1,pnl:trades.slice().reverse().slice(0,i+1).reduce((a,t)=>a+t.pnl,0)}));
 async function logout(){if(supabase)await supabase.auth.signOut();setMenu(false)}
 return <div className="app"><aside><div className="brand"><span>Geo</span>Journaling</div><div className="sub">TRADING JOURNAL</div><nav>{[["Dashboard",LayoutDashboard],["Trade Journal",BookOpen],["Analytics",BarChart3],["Calendar",CalendarDays],["Screenshots",Camera],["Psychology",Sparkles],["Risk Management",ShieldCheck],["Reports",FileText],["Settings",Settings]].map(([x,I])=><button className={page===x?"active":""} onClick={()=>setPage(x)} key={x}><I size={17}/>{x}</button>)}</nav><div className="quote">Discipline<strong>builds freedom.</strong><small>— GeoJournaling</small></div></aside>
 <main><header className="top"><div className="links">TRADE　|　ANALYZE　|　IMPROVE</div><div className="tools"><div className="search"><Search size={14}/><input placeholder="Search trades, setups, symbols…"/></div><button className="icon"><Moon size={16}/></button><button className="avatar" onClick={()=>setMenu(!menu)}><CircleUserRound size={18}/></button>{menu&&<div className="menu"><b>{session.user.email}</b><button onClick={logout}><LogOut size={15}/> Log out</button></div>}</div></header>
 <section><div className="welcome"><div><label>GEOJOURNALING / {page.toUpperCase()}</label><h1>{page==="Dashboard"?"Welcome back, Trader.":page}</h1><p>Track your performance. Improve your strategy. Build consistency.</p></div><button className="primary" onClick={()=>setModal(true)}><Plus size={16}/> Add New Trade</button></div>
 {page==="Dashboard"?<><div className="stats"><Stat title="Total P&L" value={`${pnl>=0?"+":"-"}$${Math.abs(pnl).toFixed(2)}`} sub="+12.4% vs. last 7 days" icon={TrendingUp}/><Stat title="Win Rate" value={`${wr.toFixed(1)}%`} sub={`${wins}W / ${trades.length-wins}L`} icon={Target}/><Stat title="Profit Factor" value={profit.toFixed(2)} sub="Gross profit / gross loss" icon={BarChart3}/><Stat title="Avg. R" value={`${avgR.toFixed(2)}R`} sub="Average risk/reward" icon={ShieldCheck}/></div>
 <div className="grid"><div className="panel chart"><div className="pt"><h3>Equity Curve</h3><span>Last 30 days⌄</span></div><ResponsiveContainer width="100%" height="90%"><AreaChart data={curve}><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16e5a0" stopOpacity=".32"/><stop offset="100%" stopColor="#16e5a0" stopOpacity="0"/></linearGradient></defs><XAxis dataKey="n" hide/><YAxis hide/><Tooltip contentStyle={{background:"#081721",border:"1px solid #1b3543"}}/><Area type="monotone" dataKey="pnl" stroke="#16e5a0" fill="url(#fill)" strokeWidth={2}/></AreaChart></ResponsiveContainer></div>
 <div className="panel quick"><div className="pt"><h3>Quick Stats</h3></div>{[["Total Trades",trades.length],["Winning Trades",wins],["Losing Trades",trades.length-wins],["Average Win","$"+(trades.filter(t=>t.pnl>0).reduce((a,t)=>a+t.pnl,0)/Math.max(1,wins)).toFixed(0)],["Largest Win","$"+Math.max(...trades.map(t=>t.pnl)).toFixed(0)]].map(a=><div className="q" key={a[0]}><span>{a[0]}</span><b>{a[1]}</b></div>)}</div></div>
 <div className="panel table"><div className="pt"><h3>Recent Trades</h3><button onClick={()=>setModal(true)}>+ Add trade</button></div><div className="scroll"><table><thead><tr><th>Date</th><th>Instrument</th><th>Direction</th><th>Entry</th><th>Exit</th><th>R</th><th>P&L</th><th>Setup</th></tr></thead><tbody>{trades.map(t=><tr key={t.id}><td>{t.trade_date}</td><td><b>{t.symbol}</b></td><td><em className={t.direction==="LONG"?"long":"short"}>{t.direction}</em></td><td>{t.entry}</td><td>{t.exit}</td><td>{t.result_r}R</td><td className={t.pnl>=0?"pos":"neg"}>{t.pnl>=0?"+":""}${t.pnl.toFixed(2)}</td><td>{t.setup}</td></tr>)}</tbody></table></div></div></>:<div className="empty"><Sparkles/><h2>{page}</h2><p>Module ready for the next build phase.</p></div>}
 </section></main>{modal&&<Modal close={()=>setModal(false)} save={save}/>}</div>
}
createRoot(document.getElementById("root")).render(<App/>);