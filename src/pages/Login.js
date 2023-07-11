import { useState, useEffect } from "react";
import Wrapper from "../assets/wrappers/RegisterPage";
import { toast } from "react-toastify";
import { useNavigate, Link, redirect } from "react-router-dom";
import axios from "axios";
import Logo from "../components/Logo";

function Login() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  const onLogin = async (e) => {
    e.preventDefault();
    try{
      const result = await axios.post(
        "https://birdtrading-api.azurewebsites.net/api/Staffs/login",
        {
          email: email,
          password: password,
        }
      );
      if (result.data !== null) {
        localStorage.setItem("profile", JSON.stringify(result.data));
        // localStorage.setItem('refreshToken', result.data.refreshToken);
        navigate("/home/chart");
        toast.success("Welcome Back");
      }else {
        redirect("/login");
        toast.error("Wrong email or password");
      }
    }catch(error) {
      if(error.response.status === 400 && error.response){
        toast.error("Wrong email or password");
      }else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <Wrapper className="full-page">
      <form onSubmit={onLogin} className="login-form">
        <Logo />
        {/* email field */}
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          className="form-input "
          type="email"
          name="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        {/* password field */}
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          className="form-input"
          type="password"
          name="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => setIsAuth(true)} type="submit" className="btn btn-block">
          Login
        </button>
        <Link to="/registerStaff" className="btn btn-block">
          Register
        </Link>
      </form>
    </Wrapper>
  );
}
export default Login;
