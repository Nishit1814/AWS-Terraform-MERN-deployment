
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import { signup } from '../services/authService';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {

    const myintitalvalue = {
        fullname: "",
        email: "",
        password: "",
        mobile: ""
    }

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const myvalidation = object({
        fullname: string().required("fullName is required"), // fullname required
        email: string().email("invalid Email").required("email is required"), // valid email required
        password: string().min(6, "minimum 6 characters").required("password is required"), // min 6 characters
        mobile: string()
            .matches(/^[0-9]{10}$/, "Phone must be 10 digits") // only 10 digit number
            .required("Phone is required"),
    })


    const { handleSubmit, handleBlur, handleChange, errors, touched }         // Formik hook for handling form
        = useFormik({

            initialValues: myintitalvalue,
            validationSchema: myvalidation,

            onSubmit: async (value) => {
                try {

                    const res = await signup(value);
                    console.log(res);
                    toast.success("Registration Successful");
                    setUser(res.user);
                    navigate('/dashboard');
                    console.log("welcome user")
                } catch (err) {
                    toast.error(err.message);
                }
            }
        })


    const [showPassword, setShowPassword] = useState(false);           // State to toggle password visibility


    return (
        <div className="min-h-screen  flex items-center justify-center p-2" >

            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/doug6jcc5/image/upload/v1774001638/register1_yetkow.jpg')] bg-cover bg-center"></div>

            {/* Blur Overlay */}
            <div className="absolute inset-0 backdrop-blur-md bg-black/20" />

            {/* Main Container */}
            <div className="max-w-4xl  w-full rounded-[50px] overflow-hidden flex flex-col md:flex-row ">

                {/* Left Side: Branding Section */}
                <div className="md:w-1/2 relative overflow-hidden group">
                    <img
                        src="https://res.cloudinary.com/doug6jcc5/image/upload/v1774001648/register2_msivp8.jpg"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 "
                        alt="Travel"
                    />

                    {/* Overlay for dark effect */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                    {/* Text Content */}
                    <div className="relative h-full flex flex-col items-center text-center justify-center gap-4 p-12 -translate-y-4">

                        {/* Logo */}
                        <div
                            onClick={() => navigate("/")}
                            className="px-6 py-2 rounded-full text-white font-bold text-base tracking-wide bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-lg shadow-purple-500/30 bg-white/10 backdrop-blur-md border border-white/20 hover:scale-105 hover:shadow-xl transition-all duration-300">
                            INEXTRIP
                        </div>

                        {/* Heading */}
                        <h2 className="text-4xl font-black text-white leading-tight drop-shadow-2xl uppercase tracking-tighter">
                            START YOUR <br /> JOURNEY WITH AI
                        </h2>

                        <p className="text-white/80 font-bold max-w-xs">
                            Create your profile and unlock the future of personalized travel.
                        </p>
                    </div>
                </div>

                <div className="md:w-1/2  z-10 bg-[#1b3b6d] p-12 flex flex-col border-white/30 justify-center">

                    {/* Heading */}
                    <div className="mb-8 text-center">
                        <h1 className="text-white text-3xl font-black tracking-widest uppercase mb-2">
                            CREATE ACCOUNT
                        </h1>

                        <div className="w-24 h-1 bg-white mx-auto" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 max-w-sm mx-auto w-full">

                        <div className="relative border-b border-white/30 pb-2">
                            <input
                                required
                                name='fullname'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="Full Name"
                                className="w-full bg-transparent text-white outline-none placeholder:text-white/40 font-medium py-2"
                            />

                            <span className="absolute right-0 top-2 opacity-100">🆔</span>
                        </div>

                        <div className="relative border-b border-white/30 pb-2">
                            <input
                                required
                                name='email'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-transparent text-white outline-none placeholder:text-white/40 font-medium py-2"
                            />

                            <span className="absolute right-0 top-2 opacity-100">✉️</span>
                        </div>

                        <div className="relative border-b border-white/30 pb-2">
                            <input
                                required
                                name='mobile'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="tel"
                                placeholder="Mobile Number"
                                className="w-full bg-transparent text-white outline-none placeholder:text-white/40 font-medium py-2"
                            />

                            <span className="absolute right-0 top-2 opacity-100">📱</span>
                        </div>

                        <div className="relative border-b border-white/30 pb-2">
                            <input
                                required
                                name='password'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type={showPassword ? "text" : "password"} // toggle visibility
                                placeholder="Password"
                                className="w-full bg-transparent text-white outline-none placeholder:text-white/40 font-medium py-2 pr-10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-2 opacity-60 "
                            >
                                {showPassword ? "HIDE" : "SHOW"}
                            </button>
                        </div>


                        {touched.fullname && errors.fullname ? (<p>{errors.fullname}</p>) : null}
                        {touched.email && errors.email ? (<p>{errors.email}</p>) : null}
                        {touched.mobile && errors.mobile ? (<p>{errors.mobile}</p>) : null}
                        {touched.password && errors.password ? (<p>{errors.password}</p>) : null}

                        <button
                            type="submit"
                            className="w-full bg-white text-[#1b3b6d] py-3 rounded-full font-black text-sm uppercase tracking-widest hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl"
                        >
                            REGISTER
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-white/40 text-xs">
                            Already a member?
                            <Link to="/login" className="text-white font-bold hover:underline ml-1">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Register;
