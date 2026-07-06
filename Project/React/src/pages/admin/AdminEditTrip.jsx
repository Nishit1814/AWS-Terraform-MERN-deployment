
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AdminHeader from '../../component/admin/AdminHeader.jsx';
import AdminSidebar from '../../component/admin/AdminSidebar.jsx';
import ProfileSidebar from '../../component/layouts/ProfileSidebar.jsx';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchTripById, updateTrip } from '../../services/tripServices.js';
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const AdminEditTrip = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const formik = useFormik({
    initialValues: {
      from: '',
      to: '',
      startDate: today,
      endDate: '',
      price: 5000,
      transportMode: 'Bus',
      category: 'Heritage',
      description: '',
      images: [''],
      pickupPoint: '',
      dropPoint: '',
      dayPlan: []
    },
    validationSchema: Yup.object({
      from: Yup.string().required('Required'),
      to: Yup.string().required('Required'),
      startDate: Yup.date().required('Required'),
      endDate: Yup.date().min(Yup.ref('startDate'), "End date can't be before start date").required('Required'),
      price: Yup.number().min(0, 'Must be positive').required('Required'),
      category: Yup.string().required('Required'),
      description: Yup.string(),
    }),
    onSubmit: async (values) => {
      const confirmUpdate = await Swal.fire({
        title: "Update this trip?",
        text: "Changes will be saved permanently.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#6366f1",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Yes, update it!"
      });

      if (!confirmUpdate.isConfirmed) return;
      const tripPayload = {
        createdBy: user._id,
        tripType: 'JOIN',
        from: values.from,
        to: values.to,
        startDate: values.startDate,
        endDate: values.endDate,
        pickupPoint: values.pickupPoint || `${values.from} Central Station`,
        dropPoint: values.dropPoint || `${values.to} Terminal`,
        budget: values.price + 3000,
        price: values.price,
        transportMode: values.transportMode,
        category: values.category,
        images: values.images.filter(img => img.trim() !== ''),
        description: `Category: ${values.category} | [Curated] ${values.description}`,
        hotels: [`${values.to} Premium Residency`],
        foodPlaces: [`${values.to} Heritage Kitchen`],
        dayPlan: values.dayPlan.map(day => ({
          ...day,
          activities: day.activities.filter((a) => a.trim() !== '')
        }))
      };

      try {
        await updateTrip(id, tripPayload);
        toast.success("Trip updated successfully 🚀");
        navigate('/trips');
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: err.message,
          confirmButtonColor: "#ef4444"
        });
      }
    },
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetchTripById(id);
        const trip = res.trip;
        console.log("API DATA 👉", trip);
        if (trip) {
          formik.setValues({
            from: trip.from,
            to: trip.to,
            startDate: trip.startDate?.split('T')[0] || '',
            endDate: trip.endDate?.split('T')[0] || '',
            price: trip.price,
            transportMode: trip.transportMode,
            category: trip.category,
            description: trip.description
              ? trip.description.split(' | [Curated] ')[1] || ''
              : '',
            images: trip.images?.length > 0 ? trip.images : [''],
            pickupPoint: trip.pickupPoint || '',
            dropPoint: trip.dropPoint || '',
            dayPlan: trip.dayPlan || []
          });
        } else {
          navigate('/trips');
        }
      } catch (err) {
        console.error(err);
        navigate('/trips');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [id]);

  // Update dayPlan when dates change
  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate && formik.values.endDate >= formik.values.startDate) {
      const start = new Date(formik.values.startDate);
      const end = new Date(formik.values.endDate);
      const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      if (formik.values.dayPlan.length !== diffDays) {
        const newDayPlan = Array.from({ length: diffDays }).map((_, i) => {
          const existingDay = formik.values.dayPlan[i];
          return existingDay || {
            day: i + 1,
            activities: [''],
            image: formik.values.images[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800',
            meals: { breakfast: 'Resort Breakfast', lunch: 'Local Deli', dinner: 'Fine Dining' }
          };
        });
        formik.setFieldValue('dayPlan', newDayPlan);
      }
    }
  }, [formik.values.startDate, formik.values.endDate, formik.values.images, formik.setFieldValue, formik.values.dayPlan.length, formik]);

  if (loading) return null;

  return (
    <div className=" bg-slate-50 text-slate-900 transition-all duration-300">
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      <main
        className={`h-screen overflow-y-auto overflow-x-auto transition-all duration-300
 ${isCollapsed ? 'ml-20' : 'ml-72'}`}
      >

        <AdminHeader
          title="Edit-Trip"
          subtitle={`Modifying Trip: ${id}`}
          user={user}
          onProfileClick={() => setIsProfileOpen(true)}
        />
        <button
          onClick={() => navigate('/trips')}
          className="flex my-3 mx-3 gap-2 bg-white text-slate-600 px-5 py-4 border border-slate-200 rounded-2xl font-black text-[10px] hover:bg-slate-50 uppercase tracking-widest shadow-sm transition-all"
        >
          <ArrowLeft size={14} />
          Back to Inventory
        </button>



        <div className="p-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-10 space-y-12">
              <form onSubmit={formik.handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Origin City</label>
                    <input
                      id="from"
                      name="from"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.from}
                      placeholder="e.g. Mumbai"
                      className={`w-full px-6 py-4 bg-slate-50 border ${formik.touched.from && formik.errors.from ? 'border-rose-400' : 'border-slate-100'} focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Destination City</label>
                    <input
                      id="to"
                      name="to"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.to}
                      placeholder="e.g. Manali"
                      className={`w-full px-6 py-4 bg-slate-50 border ${formik.touched.to && formik.errors.to ? 'border-rose-400' : 'border-slate-100'} focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Commence Date</label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      min={today}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.startDate}
                      className={`w-full px-6 py-4 bg-white border ${formik.touched.startDate && formik.errors.startDate ? 'border-rose-400' : 'border-slate-100'} focus:border-indigo-600 rounded-2xl font-bold text-sm`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Conclude Date</label>
                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
                      min={formik.values.startDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.endDate}
                      className={`w-full px-6 py-4 bg-white border ${formik.touched.endDate && formik.errors.endDate ? 'border-rose-400' : 'border-slate-100'} focus:border-indigo-600 rounded-2xl font-bold text-sm`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Fare (₹)</label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.price}
                      className={`w-full px-6 py-4 bg-slate-50 border ${formik.touched.price && formik.errors.price ? 'border-rose-400' : 'border-slate-100'} rounded-2xl font-bold text-sm`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Category</label>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      list="category-suggestions"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.category}
                      placeholder="e.g. Heritage, Mountains, Beaches"
                      className={`w-full px-6 py-4 bg-slate-50 border ${formik.touched.category && formik.errors.category ? 'border-rose-400' : 'border-slate-100'} focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm`}
                    />
                    <datalist id="category-suggestions">
                      <option value="Heritage" />
                      <option value="Mountains" />
                      <option value="Beaches" />
                      <option value="Cities" />
                      <option value="Adventure" />
                      <option value="Wildlife" />
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Transport Mode</label>
                    <select
                      id="transportMode"
                      name="transportMode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.transportMode}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm"
                    >
                      <option value="Bus">Bus</option>
                      <option value="Train">Train</option>
                      <option value="Plane">Plane</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    placeholder="Describe the trip experience..."
                    className={`w-full px-6 py-4 bg-slate-50 border ${formik.touched.description && formik.errors.description ? 'border-rose-400' : 'border-slate-100'} focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm min-h-[120px]`}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4 px-1">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Gallery Assets (URLs)</label>
                    <button type="button" onClick={() => formik.setFieldValue('images', [...formik.values.images, ''])} className="text-indigo-600 font-bold text-[9px] uppercase tracking-widest">+ Add Slot</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formik.values.images.map((img, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={img}
                          onChange={(e) => {
                            const updated = [...formik.values.images];
                            updated[idx] = e.target.value;
                            formik.setFieldValue('images', updated);
                          }}
                          placeholder="https://unsplash.com/..."
                          className="flex-grow px-6 py-3 bg-slate-50 border border-slate-50 rounded-xl font-medium text-xs"
                        />
                        {formik.values.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formik.values.images.filter((_, i) => i !== idx);
                              formik.setFieldValue('images', updated);
                            }}
                            className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day Wise Plan Section */}
                {formik.values.dayPlan.length > 0 && (
                  <div className="space-y-8 pt-8 border-t border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                      Day Wise Itinerary
                    </h3>
                    <div className="space-y-6">
                      {formik.values.dayPlan.map((day, dIdx) => (
                        <div key={dIdx} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-6">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-black text-slate-800">Day {day.day}</span>
                            <div className="flex gap-4">
                              <input
                                type="text"
                                value={day.image}
                                placeholder="Day Image URL"
                                onChange={(e) => {
                                  const updated = [...formik.values.dayPlan];
                                  updated[dIdx].image = e.target.value;
                                  formik.setFieldValue('dayPlan', updated);
                                }}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none w-64"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Breakfast</label>
                              <input
                                type="text"
                                value={day.meals.breakfast}
                                onChange={(e) => {
                                  const updated = [...formik.values.dayPlan];
                                  updated[dIdx].meals.breakfast = e.target.value;
                                  formik.setFieldValue('dayPlan', updated);
                                }}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Lunch</label>
                              <input
                                type="text"
                                value={day.meals.lunch}
                                onChange={(e) => {
                                  const updated = [...formik.values.dayPlan];
                                  updated[dIdx].meals.lunch = e.target.value;
                                  formik.setFieldValue('dayPlan', updated);
                                }}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Dinner</label>
                              <input
                                type="text"
                                value={day.meals.dinner}
                                onChange={(e) => {
                                  const updated = [...formik.values.dayPlan];
                                  updated[dIdx].meals.dinner = e.target.value;
                                  formik.setFieldValue('dayPlan', updated);
                                }}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Activities</label>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...formik.values.dayPlan];
                                  updated[dIdx].activities.push('');
                                  formik.setFieldValue('dayPlan', updated);
                                }}
                                className="text-indigo-600 font-bold text-[8px] uppercase tracking-widest"
                              >
                                + Add Activity
                              </button>
                            </div>
                            <div className="space-y-2">
                              {day.activities.map((act, aIdx) => (
                                <div key={aIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={act}
                                    onChange={(e) => {
                                      const updated = [...formik.values.dayPlan];
                                      updated[dIdx].activities[aIdx] = e.target.value;
                                      formik.setFieldValue('dayPlan', updated);
                                    }}
                                    placeholder="e.g. Visit Golden Temple"
                                    className="flex-grow px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs"
                                  />
                                  {day.activities.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...formik.values.dayPlan];
                                        updated[dIdx].activities = updated[dIdx].activities.filter((_, i) => i !== aIdx);
                                        formik.setFieldValue('dayPlan', updated);
                                      }}
                                      className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  disabled={formik.isSubmitting}
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-sm shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {formik.isSubmitting ? 'Updating Node...' : (
                    <>
                      <Save size={18} />
                      Update Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {isProfileOpen && (
        <ProfileSidebar
          user={user}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          logout={logout}
        />
      )}
    </div>
  );
};

export default AdminEditTrip;
