import { useState } from "react";
import "./index.css";

const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");
const setUsers = (u) => localStorage.setItem("users", JSON.stringify(u));
const getData = () =>
  JSON.parse(
    localStorage.getItem("data") ||
      '{"expenditures":[],"status":{"overall":"On Track","notes":""}}'
  );
const setData = (d) => localStorage.setItem("data", JSON.stringify(d));

function App() {
  const [mode, setMode] = useState("LOGIN");
  const [session, setSession] = useState(null);
  const [data, setDataState] = useState(getData());

  const login = (email, pw) => {
    const u = getUsers().find((x) => x.email === email && x.password === pw);
    if (!u) return alert("Invalid login");
    setSession(u);
  };

  const register = (name, email, pw, role) => {
    const users = getUsers();
    if (users.find((u) => u.email === email)) return alert("Email exists");
    const u = { id: Date.now(), name, email, password: pw, role };
    setUsers([...users, u]);
    alert("Account created! Please log in.");
    setMode("LOGIN");
  };

  // ---- UN actions ----
  const addExp = (p, a, d) => {
    if (!p || !a) return;
    const e = { id: Date.now(), project: p, amount: +a, date: d };
    const nd = { ...data, expenditures: [...data.expenditures, e] };
    setData(nd);
    setDataState(nd);
  };
  const updateStatus = (overall, notes) => {
    const nd = { ...data, status: { overall, notes } };
    setData(nd);
    setDataState(nd);
  };

  // ---- Session handling ----
  if (session) {
    if (session.role === "UN")
      return <UN data={data} onAdd={addExp} onStatus={updateStatus} onLogout={() => setSession(null)} user={session} />;
    if (session.role === "DONOR")
      return <Donor data={data} onLogout={() => setSession(null)} user={session} />;
    if (session.role === "GOV")
      return <Gov data={data} onLogout={() => setSession(null)} user={session} />;
  }

  if (mode === "LOGIN")
    return <Login onLogin={login} goRegister={() => setMode("REGISTER")} />;
  if (mode === "REGISTER")
    return <Register onRegister={register} goLogin={() => setMode("LOGIN")} />;
}

function Login({ onLogin, goRegister }) {
  const [email, setEmail] = useState(""),
    [pw, setPw] = useState("");
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Login</h2>
        <input className="input mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="input mb-3" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
        <button className="btn w-full mb-3" onClick={() => onLogin(email, pw)}>Sign In</button>
        <p className="text-sm text-gray-600 text-center">
          No account? <button className="text-blue-600 hover:underline" onClick={goRegister}>Register</button>
        </p>
      </div>
    </div>
  );
}

function Register({ onRegister, goLogin }) {
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [pw, setPw] = useState(""),
    [role, setRole] = useState("UN");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Register</h2>
        <input className="input mb-3" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="input mb-3" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
        <select className="input mb-3" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="UN">UN Personnel</option>
          <option value="DONOR">Donor</option>
          <option value="GOV">Government</option>
        </select>
        <button className="btn w-full mb-3" onClick={() => onRegister(name, email, pw, role)}>Create Account</button>
        <p className="text-sm text-gray-600 text-center">
          Have an account? <button className="text-blue-600 hover:underline" onClick={goLogin}>Login</button>
        </p>
      </div>
    </div>
  );
}

function UN({ data, onAdd, onStatus, onLogout, user }) {
  const [p, setP] = useState(""),
    [a, setA] = useState(""),
    [d, setD] = useState(""),
    [st, setSt] = useState(data.status.overall),
    [notes, setNotes] = useState(data.status.notes);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">UN Dashboard ({user.name})</h2>
        <button className="btn" onClick={onLogout}>Logout</button>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h3 className="font-semibold mb-3">Add Expenditure</h3>
          <input className="input mb-2" placeholder="Project" value={p} onChange={(e) => setP(e.target.value)} />
          <input className="input mb-2" placeholder="Amount" value={a} onChange={(e) => setA(e.target.value)} />
          <input type="date" className="input mb-2" value={d} onChange={(e) => setD(e.target.value)} />
          <button className="btn w-full" onClick={() => { onAdd(p, a, d); setP(""); setA(""); setD(""); }}>Add</button>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3">Project Status</h3>
          <input className="input mb-2" value={st} onChange={(e) => { setSt(e.target.value); onStatus(e.target.value, notes); }} />
          <textarea className="input" value={notes} onChange={(e) => { setNotes(e.target.value); onStatus(st, e.target.value); }} />
        </div>
      </div>

      <div className="card mt-6">
        <h3 className="font-semibold mb-3">Expenditures</h3>
        <ul className="space-y-1 text-gray-700">
          {data.expenditures.map((e) => (
            <li key={e.id} className="border-b py-1">{e.project} — ${e.amount}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Donor({ data, onLogout, user }) {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Donor Dashboard ({user.name})</h2>
        <button className="btn" onClick={onLogout}>Logout</button>
      </header>
      <div className="card">
        <h3 className="font-semibold mb-3">Project Expenditures</h3>
        <ul className="space-y-1 text-gray-700">
          {data.expenditures.map((e) => (
            <li key={e.id} className="border-b py-1">{e.project} — ${e.amount}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Gov({ data, onLogout, user }) {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Government Dashboard ({user.name})</h2>
        <button className="btn" onClick={onLogout}>Logout</button>
      </header>
      <div className="card">
        <h3 className="font-semibold mb-3">Project Status</h3>
        <p className="text-gray-700 font-medium">Overall: {data.status.overall}</p>
        <p className="text-gray-600 mt-2">{data.status.notes}</p>
      </div>
    </div>
  );
}

export default App;
