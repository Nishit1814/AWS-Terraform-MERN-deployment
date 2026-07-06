
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { motion } from 'motion/react';
import { MapPin, Calendar, Users, Wallet, Zap, Car, Info } from 'lucide-react';
import { saveHistory } from '../../services/historyService';
import { aiTrip, deployPackage } from '../../services/tripServices';
import { useAuth } from '../../context/AuthContext';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const CreateTrip = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const today = new Date().toISOString().split('T')[0];

  const formik = useFormik({
    initialValues: {
      from: '',
      to: '',
      startDate: today,
      endDate: '',
      budget: 'Mid-range',
      travelers: 1,
      tripPace: 'Moderate',
      transportMode: 'Bus',
      description: ''
    },
    validationSchema: Yup.object({
      from: Yup.string().required('Required'),
      to: Yup.string().required('Required'),
      startDate: Yup.date().required('Required'),
      endDate: Yup.date().min(Yup.ref('startDate'), "End date can't be before start date").required('Required'),
      travelers: Yup.number().min(1, 'At least 1 person').required('Required'),
    }),
    onSubmit: async (values) => {
      setError(null);

      try {
        console.log("submitted value : ", values);

        const result = await aiTrip(values);
        console.log("ai result :", result);

        // ✅ Proper response check
        if (!result || result.success === false || !result.data) {
          Swal.fire({
            icon: "error",
            title: "Oops! Trip Creation Failed 😔",
            html: `
    <div style="font-size:14px; color:#64748b; margin-top:8px;">
      We couldn't generate your trip right now.<br/>
      Please check your internet connection or try again in a moment.
    </div>
  `,
            confirmButtonText: "Try Again",
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonColor: "#4f46e5",

            // ✅ animation (correct)
            showClass: {
              popup: "animate__animated animate__fadeInDown"
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp"
            },

            backdrop: `rgba(15, 23, 42, 0.6)`
          }).then((result) => {
            if (result.isConfirmed) {
              formik.handleSubmit();
            }
          });
          return;
        }

        const tripData = result.data;

        // ✅ Create trip correctly
        const newTrip = {
          ...tripData,
          // _id: `ai-${Date.now()}`, // 🔥 IMPORTANT (you were missing this)
          createdBy: user._id,
          createdAt: Date.now(),
          tripType: "AI",
          images: [`https://picsum.photos/seed/${values?.to}ai/800/600`]
        };

        console.log("newTrip:", newTrip);

        // ✅ Save trip
        const resTrip = await deployPackage(newTrip, user);

        // ✅ Save history (use _id correctly)
        await saveHistory({
          // id: `hist-${Date.now()}`,
          userId: user._id,
          tripId: newTrip._id, // 🔥 now works
          type: "CREATED",
          date: Date.now()
        });

        // ✅ Navigate correctly
        navigate(`/trip/${resTrip._id}`);

      } catch (err) {
        console.error("onSubmit error:", err);
        Swal.fire({
          icon: "error",
          title: "Failed to generate trip",
          text: err.message || "Something went wrong",
          confirmButtonColor: "#4f46e5",
        });
      }
    }
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col" >

      {/* <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-grow"> */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* <h1 className="text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
            CRAFT YOUR <span className="text-indigo-600">ESCAPE</span>
          </h1> */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight">
            CRAFT YOUR <span className="text-indigo-600">ESCAPE</span>
          </h1>
          <p className="text-sm text-slate-400 font-black uppercase tracking-[0.4em]">Where logic meets wanderlust</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          // className="bg-white rounded-[64px] p-16 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.12)] border border-slate-100 relative overflow-hidden"
          className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[48px] p-4 sm:p-8 md:p-12 shadow-lg border border-slate-100"
        >
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-600"
            >
              <span className="text-2xl">⚠️</span>

              <div className="text-left">
                <p className="font-bold">Failed to generate trip</p>
                <p className="text-sm opacity-80">{error}</p>

                {/* ✅ ADD HERE */}
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-sm underline hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            </motion.div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-12 relative z-10">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-12"> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="group">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2 group-focus-within:text-indigo-600 transition-colors">
                  <MapPin size={12} /> Origin City
                </label>
                <input
                  id="from"
                  name="from"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.from}
                  placeholder="Starting point..."
                  className={`w-full  bg-slate-50 border-2 ${formik.touched.from && formik.errors.from ? 'border-rose-400' : 'border-slate-100'} focus:border-indigo-600 focus:bg-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl outline-none transition-all font-black text-slate-700 placeholder:text-slate-300 shadow-sm`}
                // className={`w-full px-8 py-6 bg-slate-50 border-2 ${formik.touched.from && formik.errors.from ? 'border-rose-400' : 'border-slate-100'} focus:border-indigo-600 focus:bg-white rounded-[32px] outline-none transition-all font-black text-slate-700 placeholder:text-slate-300 shadow-sm`}
                />
              </div>
              <div className="group">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2 group-focus-within:text-indigo-600 transition-colors">
                  <MapPin size={12} /> Destination City
                </label>
                <input
                  id="to"
                  name="to"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.to}
                  placeholder="Where to?"
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border-2 ${formik.touched.to && formik.errors.to ? 'border-rose-400' : 'border-slate-100'} focus:border-indigo-600 focus:bg-white  outline-none transition-all font-black text-slate-700 placeholder:text-slate-300 shadow-sm`}
                // className={`w-full px-8 py-6 bg-slate-50 border-2 ${formik.touched.to && formik.errors.to ? 'border-rose-400' : 'border-slate-100'} focus:border-indigo-600 focus:bg-white rounded-[32px] outline-none transition-all font-black text-slate-700 placeholder:text-slate-300 shadow-sm`}
                />
              </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-12"> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="group">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2 group-focus-within:text-indigo-600 transition-colors">
                  <Calendar size={12} /> Start Journey
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  min={today}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.startDate}
                  className={`w-full  bg-white border-2 ${formik.touched.startDate && formik.errors.startDate ? 'border-rose-400' : 'border-slate-200'} focus:border-indigo-600 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl outline-none transition-all font-black text-slate-800 shadow-sm`}
                // className={`w-full px-8 py-6 bg-white border-2 ${formik.touched.startDate && formik.errors.startDate ? 'border-rose-400' : 'border-slate-200'} focus:border-indigo-600 rounded-[32px] outline-none transition-all font-black text-slate-800 shadow-sm`}
                />
              </div>
              <div className="group">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2 group-focus-within:text-indigo-600 transition-colors">
                  <Calendar size={12} /> Return Home
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  min={formik.values.startDate || today}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.endDate}
                  className={`w-full bg-white border-2 ${formik.touched.endDate && formik.errors.endDate ? 'border-rose-400' : 'border-slate-200'} focus:border-indigo-600 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl outline-none transition-all font-black text-slate-800 shadow-sm`}
                // className={`w-full px-8 py-6 bg-white border-2 ${formik.touched.endDate && formik.errors.endDate ? 'border-rose-400' : 'border-slate-200'} focus:border-indigo-600 rounded-[32px] outline-none transition-all font-black text-slate-800 shadow-sm`}
                />
              </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-12"> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="group">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2 group-focus-within:text-indigo-600 transition-colors">
                  <Wallet size={12} /> Budget Level
                </label>
                <select
                  id="budget"
                  name="budget"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.budget}
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm appearance-none cursor-pointer"
                // className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 focus:bg-white rounded-[32px] outline-none transition-all font-black text-slate-700 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="Budget">Economy (Budget)</option>
                  <option value="Mid-range">Standard (Mid-range)</option>
                  <option value="Luxury">Premium (Luxury)</option>
                </select>
              </div>
              <div className="group">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2 group-focus-within:text-indigo-600 transition-colors">
                  <Users size={12} /> Number of Travelers
                </label>
                <input
                  id="travelers"
                  name="travelers"
                  type="number"
                  min="1"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.travelers}
                  className={`w-full bg-slate-50 border-2 ${formik.touched.travelers && formik.errors.travelers ? 'border-rose-400' : 'border-slate-100'} focus:border-indigo-600 focus:bg-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl outline-none transition-all font-black text-slate-700 shadow-sm`}
                // className={`w-full px-8 py-6 bg-slate-50 border-2 ${formik.touched.travelers && formik.errors.travelers ? 'border-rose-400' : 'border-slate-100'} focus:border-indigo-600 focus:bg-white rounded-[32px] outline-none transition-all font-black text-slate-700 shadow-sm`}
                />
              </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-12"> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="group">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2 group-focus-within:text-indigo-600 transition-colors">
                  <Car size={12} /> Transport
                </label>
                <select
                  id="transportMode"
                  name="transportMode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.transportMode}
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 focus:bg-white outline-none transition-all font-black text-slate-700 shadow-sm appearance-none cursor-pointer"
                // className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 focus:bg-white rounded-[32px] outline-none transition-all font-black text-slate-700 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="Bus"> Bus</option>
                  <option value="Train">Train</option>
                  <option value="Plane">Plane</option>
                  <option value="Car">Private Car</option>
                </select>
              </div>
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2 group-focus-within:text-indigo-600 transition-colors">
                <Info size={12} /> Additional Context (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                placeholder="e.g. I want a luxury trip with focus on local food and hiking..."
                className="w-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 focus:bg-white outline-none transition-all font-black text-slate-700 placeholder:text-slate-300 min-h-[160px] shadow-sm"
              // className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 focus:bg-white rounded-[32px] outline-none transition-all font-black text-slate-700 placeholder:text-slate-300 min-h-[160px] shadow-sm"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={formik.isSubmitting}
              type="submit"
              className="w-full bg-slate-900 text-white py-4 sm:py-6 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl"
            // className="w-full bg-slate-900 text-white py-8 rounded-[40px] font-black text-2xl shadow-[0_32px_64px_-16px_rgba(79,70,229,0.4)] hover:bg-indigo-600 transition-all flex items-center justify-center gap-6 uppercase tracking-[0.4em] disabled:opacity-50 mt-8"
            >
              {formik.isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="tracking-widest">Generating your trip...</span>
                </>
              ) : (
                "PLAN MY TRIP"
              )}
            </motion.button>
          </form>
          {formik.isSubmitting && (
            <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
              {/* <div className="bg-white px-10 py-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4"> */}
              <div className="bg-white px-6 sm:px-10 py-6 sm:py-8 rounded-2xl shadow-xl">

                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>

                <p className="font-bold text-slate-700">
                  Creating your perfect trip...
                </p>

              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div >
  );
};

export default CreateTrip;
