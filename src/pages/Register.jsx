const Register = () => {
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [pw, setPw] = useState("");

  const [role, setRole] = useState("UN");
  const nav = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    const users = getUsers();
    if (users.find((u) => u.email === email)) return alert("Email exists");
    const u = { id: Date.now(), name, email, password: pw, role };
    setUsers([...users, u]);
    setSession(u);
    if (role === "UN") nav("/un");
    if (role === "DONOR") nav("/donor");
    if (role === "GOV") nav("/gov");
  };
  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">Register</h2>
      <form onSubmit={submit} className="space-y-2">
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <select
          className="input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="UN">UN Personnel</option>
          <option value="DONOR">Donor</option>
          <option value="GOV">Government</option>
        </select>
        <button className="btn w-full">Create</button>
      </form>
    </div>
  );
};

export default Register;
