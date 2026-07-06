import  { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { string, object, ref } from 'yup';
import axios from '../services/axios';
import Swal from 'sweetalert2';
import { APPNAME } from '../App';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { handleSubmit, handleBlur, handleChange, errors, touched, isSubmitting } = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: object({
      password: string()
        .min(6, 'Minimum 6 characters required')
        .required('New password is required'),
      confirmPassword: string()
        .oneOf([ref('password')], 'Passwords do not match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values) => {
      try {
        console.log("values :", values)
        await axios.post(`/api/auth/reset-password/${token}`, {
          password: values.password,
        });
        navigate('/login');
      } catch (err) {
       console.log(err.message)
      }
    },
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center p-2">
      <img
        src="https://res.cloudinary.com/doug6jcc5/image/upload/v1774001629/register_page_kppnsl.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Background"
      />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-xs pointer-events-none" />

      <div className="relative z-10 max-w-md w-full rounded-[30px] overflow-hidden shadow-2xl backdrop-blur-lg bg-white/5">
        <div className="bg-slate-800 p-12 flex flex-col justify-center">

          <div className="mb-10 text-center">
            <h1 className="text-white text-3xl font-black tracking-widest uppercase mb-2">
              {APPNAME}
            </h1>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
              Set a new password
            </p>
          </div>

          <p className="text-white/50 text-sm text-center mb-8 leading-relaxed">
            Choose a strong password. It must be at least 6 characters long.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="relative mb-2 border-b border-white/30 pb-2">
              <input
                type={showNew ? 'text' : 'password'}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="New password"
                className="w-full bg-transparent text-white placeholder:text-white/40 py-2 outline-none font-medium transition-all duration-300 focus:scale-[1.02] pr-14"
              />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-0 top-2 opacity-40 hover:opacity-100 text-xs text-white">
                {showNew ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-red-400 text-xs mb-4 mt-1 font-semibold tracking-wide">⚠ {errors.password}</p>
            )}

            <div className="relative mt-4 mb-2 border-b border-white/30 pb-2">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full bg-transparent text-white placeholder:text-white/40 py-2 outline-none font-medium transition-all duration-300 focus:scale-[1.02] pr-14"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-0 top-2 opacity-40 hover:opacity-100 text-xs text-white">
                {showConfirm ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-400 text-xs mb-4 mt-1 font-semibold tracking-wide">⚠ {errors.confirmPassword}</p>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full mt-8 bg-white text-[#1b3a6e] py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'UPDATING...' : 'RESET PASSWORD'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold">
              Back to{' '}
              <Link to="/login" className="text-white hover:underline ml-1">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;