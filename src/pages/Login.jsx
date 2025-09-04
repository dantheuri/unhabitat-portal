import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("un@demo.org");
  const [pw, setPw] = useState("un123");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  return (
    <div>
      <h1>Login</h1>
    </div>
  );
};

export default Login;
