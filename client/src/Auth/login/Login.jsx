import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  signInSuccess,
  signInFailure,
  signInStart,
} from "../../redux/user/userSlice";

import GoogleAuth from "../../components/googleAuth/GoogleAuth";

const Login = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  console.log(formData);

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data, "ohoo");

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <section className="login_section">
      <div className="main_login_div">
        <div className="form_div">
          <h1>Login</h1>
          <form action="" onSubmit={handelSubmit}>
            <div className="email_div">
              <span>Email :</span>
              <input type="email" id="email" onChange={handelChange} />
            </div>
            <div className="password_div">
              <span>Password :</span>
              <input type="password" id="password" onChange={handelChange} />
            </div>

            <div className="login_button">
              <button>
                <h3>{loading ? "logging u in " : "Login"}</h3>
              </button>
            </div>
            <div className="login_oauth_button">{/* <GoogleAuth /> */}</div>
          </form>
          <div className="a_login">
            <Link to="/register">
              Dont have an account ? <span className="reg_span">register</span>
            </Link>
          </div>
          {error && <span className="error_span">{error}</span>}
        </div>
      </div>
    </section>
  );
};

export default Login;
