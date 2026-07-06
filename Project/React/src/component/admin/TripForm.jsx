

import  { useEffect, useState } from 'react'
import { createTrip } from '../../services/tripServices';
import { useFormik } from 'formik';
import { useAuth } from '../../context/AuthContext';
import * as Yup from "yup";

export default function TripForm({ setShowCreateModal }) {
  const { user } = useAuth();
  const [isDeploying, setIsDeploying] = useState(false);

  const validationSchema = Yup.object({

    from: Yup.string()
      .required("Origin city is required")
      .min(2, "City name too short"),

    to: Yup.string()
      .required("Destination city is required")
      .min(2, "City name too short"),

    startDate: Yup.date()
      .required("Start date is required"),

    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),

    price: Yup.number()
      .required("Price is required")
      .min(1000, "Minimum price should be ₹1000"),

    transportMode: Yup.string()
      .required("Transport mode required"),

    category: Yup.string()
      .required("Category required"),

    description: Yup.string()
      .required("Description required")
      .min(20, "Description must be at least 20 characters"),

    pickupPoint: Yup.string()
      .required("Pickup point required"),

    dropPoint: Yup.string()
      .required("Drop point required"),

    images: Yup.array()
      .of(
        Yup.string()
          .url("Enter valid image URL")
          .required("Image URL required")
      )
      .min(1, "At least one image required"),

    dayPlan: Yup.array().of(
      Yup.object({
        day: Yup.number().required(),

        image: Yup.string()
          .url("Enter valid image URL")
          .required("Day image required"),

        meals: Yup.object({
          breakfast: Yup.string().required("Breakfast required"),
          lunch: Yup.string().required("Lunch required"),
          dinner: Yup.string().required("Dinner required")
        }),

        activities: Yup.array()
          .of(Yup.string().required("Activity required"))
          .min(1, "At least one activity required")
      })
    )

  });

  const today = new Date().toISOString().split("T")[0];
  const { handleChange, handleSubmit, setFieldValue, values } = useFormik({
    initialValues: {
      from: "",
      to: "",
      startDate: today,
      endDate: "",
      price: 5000,
      transportMode: "Bus",
      category: "Heritage",
      description: "",
      pickupPoint: "",
      dropPoint: "",
      images: [""],
      dayPlan: []
    },

    // validationSchema,

    onSubmit: async (values, { resetForm }) => {
      console.log(" sublited values: ", values)
      const newTrip = {
        createdBy: user._id,
        tripType: "JOIN",
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
        description: values.description,
        images: values.images.filter((img) => img.trim() !== ""),
        hotels: [`${values.to} Premium Residency`],
        foodPlaces: [`${values.to} Heritage Kitchen`],
        dayPlan: values.dayPlan
      };

      try {
        console.log("newTrip : ", newTrip);
        await createTrip(newTrip);
        alert("Trip created successfully");
        resetForm();
      } catch (err) {
        alert(err.message);
      }
    }
  });

  // auto generate dayPlan
  useEffect(() => {
    // console.log("values.startDate :", values.startDate)
    // console.log("values.endDate :", values.endDate)
    if (
      values.startDate &&
      values.endDate &&
      values.endDate >= values.startDate
    ) {
      const start = new Date(values.startDate);
      const end = new Date(values.endDate);

      // const diffDays =
      //   Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const newDayPlan = Array.from({ length: diffDays }).map((_, i) => ({
        day: i + 1,
        activities: [""],
        image: values.images[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800',
        meals: { breakfast: 'Resort Breakfast', lunch: 'Local Deli', dinner: 'Fine Dining' },
      }));
      console.log("newDayPlan new :", newDayPlan)

      setFieldValue("dayPlan", newDayPlan);
    }
  }, [values.startDate, values.endDate]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowCreateModal(false)} />
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[48px] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Deploy Manual Package</h2>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Inventory Expansion Node</p>
          </div>
          <button onClick={() => setShowCreateModal(false)} className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-10 space-y-12">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Origin City</label>
                <input required type="text"
                  name='from'
                  value={values.from}
                  onChange={handleChange} placeholder="e.g. Mumbai" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Destination City</label>
                <input required type="text"
                  name='to'
                  value={values.to}
                  onChange={handleChange} placeholder="e.g. Manali" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Start Date</label>
                <input required type="date"
                  name='startDate'
                  price="startDate" min={today}
                  value={values?.startDate}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white border border-slate-100 focus:border-indigo-600 rounded-2xl font-bold text-sm" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">End Date</label>
                <input required type="date"
                  name="endDate"
                  min={values.startDate}
                  value={values?.endDate}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white border border-slate-100 focus:border-indigo-600 rounded-2xl font-bold text-sm" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Fare (₹)</label>
                <input required
                  type="number"
                  name='price'
                  value={values.price}
                  onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Description</label>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe this trip in at least 20 characters..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm resize-none"
              />
              {/* {fieldError("description")} */}
            </div>

            {/* Pickup / Drop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Pickup Point</label>
                <input
                  type="text"
                  name="pickupPoint"
                  value={values.pickupPoint}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai Central Station"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm"
                />
                {/* {fieldError("pickupPoint")} */}
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Drop Point</label>
                <input
                  type="text"
                  name="dropPoint"
                  value={values.dropPoint}
                  onChange={handleChange}
                  placeholder="e.g. Manali Terminal"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm"
                />
                {/* {fieldError("dropPoint")} */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Category</label>
                <select
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm"
                >
                  <option value="Heritage">Heritage</option>
                  <option value="Mountains">Mountains</option>
                  <option value="Beaches">Beaches</option>
                  <option value="Cities">Cities</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Wildlife">Wildlife</option>
                </select>
                {/* {fieldError("category")} */}
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Transport Mode</label>
                {/* FIX: added name prop so Formik can track this field */}
                <select
                  name="transportMode"
                  value={values.transportMode}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm"
                >
                  <option value="Bus">Bus</option>
                  <option value="Train">Train</option>
                  <option value="Plane">Plane</option>
                </select>
                {/* {fieldError("transportMode")} */}
              </div>
            </div>


            {/* IMAGES */}

            <div>
              <div className="flex justify-between items-center mb-4 px-1">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Gallery Assets (URLs)
                </label>
                <button
                  type="button"
                  onClick={() => setFieldValue("images", [...values.images, ""])}
                  className="text-indigo-600 font-bold text-[9px] uppercase tracking-widest"
                >
                  + Add Slot
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {values.images.map((img, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => {
                        const updated = [...values.images];
                        updated[idx] = e.target.value;
                        setFieldValue("images", updated);
                      }}
                      placeholder="https://unsplash.com/..."
                      className="flex-1 px-6 py-3 bg-slate-50 border border-slate-50 rounded-xl font-medium text-xs"
                    />

                    {values.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = values.images.filter((_, i) => i !== idx);
                          setFieldValue("images", updated);
                        }}
                        className="text-rose-400 font-black text-sm px-2"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Day Wise Plan Section */}
            {values.dayPlan.length > 0 && (
              <div className="space-y-8 pt-8 border-t border-slate-100">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                  Day Wise Itinerary
                </h3>
                <div className="space-y-6">
                  {values.dayPlan.map((day, dIndex) => (
                    <div key={dIndex} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-black text-slate-800">Day {day.day}</span>
                        <div className="flex gap-4">
                          <input
                            type="text"
                            name='image'
                            placeholder="Day Image URL"
                            value={day.image}
                            onChange={(e) =>
                              setFieldValue(
                                `dayPlan.${dIndex}.image`,
                                e.target.value
                              )
                            }
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none w-64"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Breakfast</label>
                          <input type="text"
                            name='breakfast'
                            value={day.meals.breakfast}
                            onChange={(e) =>
                              setFieldValue(
                                `dayPlan.${dIndex}.meals.breakfast`,
                                e.target.value
                              )
                            } className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs" />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Lunch</label>
                          <input type="text"
                            name='lunch'
                            value={day.meals.lunch}
                            onChange={(e) =>
                              setFieldValue(
                                `dayPlan.${dIndex}.meals.lunch`,
                                e.target.value
                              )
                            } className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs" />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Dinner</label>
                          <input type="text"
                            name='dinner'
                            value={day.meals.dinner}
                            onChange={(e) =>
                              setFieldValue(
                                `dayPlan.${dIndex}.meals.dinner`,
                                e.target.value
                              )
                            } className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs" />
                        </div>

                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            Activities
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...values.dayPlan];
                              updated[dIndex].activities.push("");
                              setFieldValue("dayPlan", updated);
                            }}
                            className="text-indigo-600 font-bold text-[8px] uppercase tracking-widest"
                          >
                            + Add Activity
                          </button>
                        </div>
                        <div className="space-y-2">
                          {day.activities?.map((act, aIdx) => (
                            <div key={aIdx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={act}
                                onChange={(e) => {
                                  const updated = [...values.dayPlan];
                                  updated[dIndex].activities[aIdx] = e.target.value;
                                  setFieldValue("dayPlan", updated);
                                }}
                                placeholder="e.g. Visit Golden Temple"
                                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs"
                              />
                              {day.activities.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...values.dayPlan];
                                    updated[dIndex].activities = updated[dIndex].activities.filter(
                                      (_, i) => i !== aIdx
                                    );
                                    setFieldValue("dayPlan", updated);
                                  }}
                                  className="text-rose-400 font-black text-sm px-2"
                                >
                                  ×
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

            <button disabled={isDeploying} type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-sm shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-widest">
              {isDeploying ? 'Deploying Node...' : 'Deploy Inventory Package'}
            </button>
          </form>
        </div>
      </div>
    </div >
  )
}




