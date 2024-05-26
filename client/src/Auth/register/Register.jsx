import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import GoogleAuth from "../../components/googleAuth/GoogleAuth";

const Register = () => {
  const [formData, setFormData] = useState({});
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  console.log(formData);

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        setloading(false);
        setError(data.message);
        return;
      }
      setloading(false);
      setError(null);
      navigate("/login");
    } catch (error) {
      setloading(false);
      setError(error.message);
    }
  };

  return (
    <section className="register_section">
      <div className="main_register_div">
        <div className="form_div">
          <h1>Register</h1>
          <form action="" onSubmit={handelSubmit}>
            <div className="first_last_div">
              <div>
                <span>First name :</span>
                <input
                  required
                  type="text"
                  id="firstname"
                  onChange={handelChange}
                />
              </div>
              <div>
                <span>Last name :</span>
                <input
                  required
                  type="text"
                  id="lastname"
                  onChange={handelChange}
                />
              </div>
            </div>
            <div className="email_div">
              <span>Username :</span>
              <input
                required
                type="text"
                id="username"
                onChange={handelChange}
              />
            </div>
            <div className="email_div">
              <span>Email :</span>
              <input required type="text" id="email" onChange={handelChange} />
            </div>
            <div className="password_div">
              <span>Password :</span>
              <input
                required
                type="password"
                id="password"
                onChange={handelChange}
              />
            </div>
            <div className="phonenumber_div">
              <span>Phonenumber :</span>
              <input required type="text" id="phone" onChange={handelChange} />
            </div>
            <div className="register_button">
              <button>
                <h3>{loading ? "Creating user...." : "Register"}</h3>
              </button>
            </div>
            {/* <span>Or</span> */}
            <div className="register_oauth_button">{/* <GoogleAuth /> */}</div>
          </form>
          <div className="a_login">
            <Link to="/login">
              Already have an account ?{" "}
              <span className="login_span">Login in</span>{" "}
            </Link>
          </div>
          {error && <span className="error_span">{error}</span>}
        </div>
      </div>
    </section>
  );
};

export default Register;
