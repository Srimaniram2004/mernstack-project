import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [user, setUser] = useState({ username: "", pass: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        username: user.username,
        password: user.pass,
      });

      setUser({ username: "", pass: "" });
      window.alert(res.data.msg);

      if (res.data.msg === 'Login Success') {
        onLogin();  // Notify App of successful login
        navigate('/');  // Redirect to home page
      }
    } catch (err) {
      console.error(err);
      window.alert(err.response?.data.msg || 'Login failed');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center mb-4">Login</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="pass" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="pass"
                    name="pass"
                    value={user.pass}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
            </div>
          </div>
          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
