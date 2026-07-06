import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { string, object } from 'yup';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const token = sessionStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);

      if (decoded.exp > Date.now() / 1000) {
        return <Navigate to={
          decoded.role === "ADMIN"
            ? "/dashboard"
            : "/dashboard"
        } replace />;
      } else {
        sessionStorage.removeItem("token");
      }
    } catch {
      sessionStorage.removeItem("token");
    }
  }

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = object({
    email: string().email("Invalid email address").required("Email is required"),
    password: string().min(6, "Minimum 6 characters required").required("Password is required"),
  });

  const { handleSubmit, handleBlur, handleChange, errors, touched } = useFormik({
    initialValues,
    validationSchema,

    onSubmit: async (values) => {
      try {
        const res = await login(values);

        sessionStorage.setItem("token", res.token);
        setUser(res.user);

        if (res.user.role === "ADMIN") {
          navigate("/overview");
        } else {
          navigate("/dashboard");
        }

      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";

      alert({
        text: message
      }
      )
      }
    }
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center p-2">

      <img
        src="https://res.cloudinary.com/doug6jcc5/image/upload/v1774001629/register_page_kppnsl.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Background"
      />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-xs pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full rounded-[30px] overflow-hidden flex flex-col md:flex-row-reverse shadow-2xl backdrop-blur-lg bg-white/5">

        {/* Left Pane - Image */}
        <div className="md:w-1/2 relative overflow-hidden group">
          <img
            src="https://res.cloudinary.com/doug6jcc5/image/upload/v1774001616/Login_Page_bkcmwu.jpg"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt="Scenic view"
          />
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[3px]" />
          <div className="relative h-full flex flex-col justify-center items-center text-center p-12">
            <h2 className="md:text-4xl font-black mb-8 leading-tight drop-shadow-lg uppercase tracking-tight">
              TRAVEL IS THE ONLY THING, <br /> YOU BUY THAT MAKES YOU RICHER.
            </h2>
          </div>
        </div>

        <div className="md:w-1/2 bg-slate-800 z-10 p-12 md:p-16 flex flex-col justify-center">
          <div className="mb-10 flex items-center justify-center gap-3">
            <div
              onClick={() => navigate('/')}
              className="w-10 h-10 bg-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg cursor-pointer"
            >
              I
            </div>

            <h1 className="text-white text-3xl font-black tracking-widest uppercase">
              INEXTRIP
            </h1>
          </div>

          <p className="text-white/60 text-center text-xs font-bold mb-8 uppercase tracking-widest">
            Plan your journey with AI
          </p>

          <form onSubmit={handleSubmit}>

            <div className="relative mb-2 group border-b border-white/30 pb-2">
              <input
                type="email"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-transparent text-white placeholder:text-white/40 py-2 outline-none font-medium transition-all duration-300 focus:scale-[1.02]"
              />
              <span className="absolute right-0 top-2">👤</span>
            </div>
            {touched.email && errors.email && (
              <p className="text-red-400 text-xs mb-4 mt-1 font-semibold tracking-wide">
                {errors.email}
              </p>
            )}
            <div className="relative mb-2 group border-b border-white/30 pb-2">
              <input
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-transparent text-white placeholder:text-white/40 py-2 outline-none font-medium transition-all duration-300 focus:scale-[1.02] pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-2 opacity-40 hover:opacity-100 text-xs text-white"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-red-400 text-xs mb-4 mt-1 font-semibold tracking-wide">
                 {errors.password}
              </p>
            )}

            <div className="text-right my-4">
              <Link to="/forgot-password" className="text-white/40 ...">Forgot Your Password?</Link>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-[#1b3a6e] py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              ENTER
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold">
              Don't have an account?
              <Link to="/register" className="text-white hover:underline ml-1">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;