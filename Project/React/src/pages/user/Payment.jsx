
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from "../../component/layouts/Navbar";
import { useAuth } from '../../context/AuthContext';
import { savePayment } from '../../services/paymentService';
import { fetchTripById } from '../../services/tripServices';
import * as Yup from 'yup';
import { InvoiceButton } from '../../component/layouts/InvoiceButton';


export const Payment = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const persons = parseInt(queryParams.get('persons') || '1');

    const [trip, setTrip] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [txnId, setTxnId] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

    const formik = useFormik({
        initialValues: {
            passengers: Array.from({ length: persons }, () => ({ name: '', age: '', gender: 'Male', mobile: '' })),
            contactInfo: {
                email: user?.email || '',
                mobile: user?.mobile || '',
                emergencyName: '',
                emergencyPhone: '',
                specialRequests: ''
            },
            method: 'QR',
            upiId: '',
            cardNumber: '',
            cardExpiry: '',
            cardCVV: '',
            bankName: ''
        },
        validationSchema: Yup.object({
            passengers: Yup.array().of(
                Yup.object({
                    name: Yup.string().required('Required'),
                    age: Yup.number().min(1, 'Invalid age').required('Required'),
                    gender: Yup.string().required('Required'),
                    mobile: Yup.string().required('Required')
                })
            ),
            contactInfo: Yup.object({
                email: Yup.string().email('Invalid email').required('Required'),
                mobile: Yup.string().required('Required'),
                emergencyName: Yup.string().required('Required'),
                emergencyPhone: Yup.string().required('Required'),
            }),
            method: Yup.string().required('Required'),
            upiId: Yup.string().when('method', {
                is: 'UPI',
                then: () => Yup.string().required('UPI ID is required').matches(/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/, 'Invalid UPI ID format'),
                otherwise: () => Yup.string().notRequired()
            }),
            cardNumber: Yup.string().when('method', {
                is: 'CARD',
                then: () => Yup.string().required('Card number is required').matches(/^\d{16}$/, 'Must be 16 digits'),
                otherwise: () => Yup.string().notRequired()
            }),
            cardExpiry: Yup.string().when('method', {
                is: 'CARD',
                then: () => Yup.string().required('Expiry is required').matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format'),
                otherwise: () => Yup.string().notRequired()
            }),
            cardCVV: Yup.string().when('method', {
                is: 'CARD',
                then: () => Yup.string().required('CVV is required').matches(/^\d{3}$/, 'Must be 3 digits'),
                otherwise: () => Yup.string().notRequired()
            }),
            bankName: Yup.string().when('method', {
                is: 'NETBANKING',
                then: () => Yup.string().required('Please select a bank'),
                otherwise: () => Yup.string().notRequired()
            })
        }),
        onSubmit: async (values) => {
            if (!trip) return;

            if (values.method === 'QR' && !showQR) {
                setShowQR(true);
                return;
            }

            setLoading(true);

            try {
                await new Promise(res => setTimeout(res, 2500)); // Simulate processing

                const amount = trip.price * persons;
                const generatedTxn = `TXN${Math.floor(Math.random() * 100000000)}`;
                setTxnId(generatedTxn);

                const payment = {
                    id: `pay-${Date.now()}`,
                    userId: user._id,
                    tripId: trip._id,
                    amount: amount,
                    paymentMethod: values.method,
                    transactionId: generatedTxn,
                    status: 'SUCCESS',
                    date: Date.now(),
                    numPersons: persons,
                    passengers: values.passengers,
                    contactEmail: values.contactInfo.email,
                    contactMobile: values.contactInfo.mobile,
                    emergencyContactName: values.contactInfo.emergencyName,
                    emergencyContactPhone: values.contactInfo.emergencyPhone,
                    specialRequests: values.contactInfo.specialRequests,
                    methodDetails: values.method === 'UPI' ? { upiId: values.upiId } :
                        values.method === 'CARD' ? { last4: values.cardNumber.slice(-4) } :
                            values.method === 'NETBANKING' ? { bank: values.bankName } : {}
                };

                await savePayment(payment);

                setStep(3);
            } catch (err) {
                console.error(err);
                alert("Payment failed. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    });

    useEffect(() => {
        let timer;
        if (showQR && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setShowQR(false);
            alert("QR Code expired. Please try again.");
            setTimeLeft(300);
        }
        return () => clearInterval(timer);
    }, [showQR, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const allTrips = await fetchTripById(id);
                console.log("allTrips : ", allTrips.trip);
                setTrip(allTrips.trip);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTrip();
    }, [id]);



    if (!trip) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Adventure not found</div>;

    const totalPay = trip.price * persons;

    const upiUrl = `upi://pay?pa=8160491336-1@nyes&pn=Darshan&am=${totalPay}&cu=INR&tn=Trip Booking Payment`;

    const encodedUPI = encodeURIComponent(upiUrl);
    return (
        <div className="min-h-screen bg-white relative">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
                {/* Progress Stepper */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-3xl border border-slate-100">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-3">
                                <div className={`px-6 py-2 rounded-2xl flex items-center gap-3 font-black transition-all duration-500 ${step === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : step > s ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}>
                                    <span className="text-xs">{step > s ? '✓' : `0${s}`}</span>
                                    <span className="text-[10px] uppercase tracking-widest whitespace-nowrap">
                                        {s === 1 ? 'Manifest' : s === 2 ? 'Payment' : 'Confirm'}
                                    </span>
                                </div>
                                {s < 3 && <div className="w-4 h-px bg-slate-200" />}
                            </div>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                        >
                            {/* Left Column: Forms */}
                            <div className="lg:col-span-8 space-y-10">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">PASSENGER MANIFEST</h1>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Provide traveler details for your journey to {trip?.to}</p>
                                </div>

                                {/* Contact Section */}
                                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-indigo-100">📧</div>
                                        <div>
                                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Primary Contact</h2>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Where should we send your e-invoice?</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                            <input
                                                type="email"
                                                name="contactInfo.email"
                                                value={formik.values.contactInfo.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="your@email.com"
                                                className={`w-full px-6 py-4 bg-slate-50 border ${formik.touched.contactInfo?.email && formik.errors.contactInfo?.email ? 'border-rose-400' : 'border-slate-100'} rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-all`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mobile Number</label>
                                            <input
                                                type="text"
                                                name="contactInfo.mobile"
                                                value={formik.values.contactInfo.mobile}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="+91 00000 00000"
                                                className={`w-full px-6 py-4 bg-slate-50 border ${formik.touched.contactInfo?.mobile && formik.errors.contactInfo?.mobile ? 'border-rose-400' : 'border-slate-100'} rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-all`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Emergency Contact Name</label>
                                            <input
                                                type="text"
                                                name="contactInfo.emergencyName"
                                                value={formik.values.contactInfo.emergencyName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Contact Person Name"
                                                className={`w-full px-6 py-4 bg-slate-50 border ${formik.touched.contactInfo?.emergencyName && formik.errors.contactInfo?.emergencyName ? 'border-rose-400' : 'border-slate-100'} rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-all`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Emergency Phone</label>
                                            <input
                                                type="text"
                                                name="contactInfo.emergencyPhone"
                                                value={formik.values.contactInfo.emergencyPhone}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Emergency Number"
                                                className={`w-full px-6 py-4 bg-slate-50 border ${formik.touched.contactInfo?.emergencyPhone && formik.errors.contactInfo?.emergencyPhone ? 'border-rose-400' : 'border-slate-100'} rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-all`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Passengers Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-slate-100">👥</div>
                                            <div>
                                                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Traveler Details</h2>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manifest for {persons} traveler{persons > 1 ? 's' : ''}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {formik.values?.passengers.map((p, i) => (
                                            <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative group hover:border-indigo-100 transition-all">
                                                <div className="absolute -top-3 -left-3 w-10 h-10 bg-white border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center text-xs font-black shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                                    {i + 1}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                    <div className="md:col-span-1">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">Full Name</label>
                                                        <input
                                                            type="text"
                                                            name={`passengers[${i}].name`}
                                                            value={p?.name}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            placeholder="Legal Name"
                                                            className={`w-full px-5 py-3 bg-slate-50 border ${formik.touched.passengers?.[i]?.name && formik.errors?.passengers?.[i]?.name ? 'border-rose-400' : 'border-slate-100'} rounded-xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-all`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">Age</label>
                                                        <input
                                                            type="number"
                                                            name={`passengers[${i}].age`}
                                                            value={p?.age}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            placeholder="Years"
                                                            className={`w-full px-5 py-3 bg-slate-50 border ${formik.touched.passengers?.[i]?.age && formik.errors?.passengers?.[i]?.age ? 'border-rose-400' : 'border-slate-100'} rounded-xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-all`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">Gender</label>
                                                        <select
                                                            name={`passengers[${i}].gender`}
                                                            value={p?.gender}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-all appearance-none"
                                                        >
                                                            <option>Male</option>
                                                            <option>Female</option>
                                                            <option>Other</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2 block">Mobile No</label>
                                                        <input
                                                            type="text"
                                                            name={`passengers[${i}].mobile`}
                                                            value={p?.mobile}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            placeholder="Phone"
                                                            className={`w-full px-5 py-3 bg-slate-50 border ${formik.touched.passengers?.[i]?.mobile && formik.errors?.passengers?.[i]?.mobile ? 'border-rose-400' : 'border-slate-100'} rounded-xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-all`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Summary Card */}
                            <div className="lg:col-span-4">
                                <div className="sticky top-8 space-y-6">
                                    <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.43c-.16.09-.33.14-.5.14s-.34-.05-.5-.14l-7.97-4.43c-.32-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.97-4.43c.16-.09.33-.14.5-.14s.34.05.5.14l7.97 4.43c.32.17.53.5.53.88v9z" /></svg>
                                        </div>

                                        <div className="relative z-10 space-y-8">
                                            <div>
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Destination</p>
                                                <h3 className="text-3xl font-black tracking-tight">{trip?.to}</h3>
                                            </div>

                                            <div className="h-px bg-white/10" />

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Base Rate</span>
                                                    <span className="font-black">₹{trip?.price.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Travelers</span>
                                                    <span className="font-black">x {persons}</span>
                                                </div>
                                            </div>

                                            <div className="h-px bg-white/10" />

                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Total Payable</p>
                                                    <p className="text-4xl font-black tracking-tighter text-indigo-400">₹{totalPay?.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    const errors = await formik.validateForm();
                                                    if (Object.keys(errors).length === 0) {
                                                        setStep(2);
                                                    } else {
                                                        formik.setTouched({
                                                            passengers: formik.values.passengers.map(() => ({ name: true, age: true, gender: true, mobile: true })),
                                                            contactInfo: { email: true, mobile: true, emergencyName: true, emergencyPhone: true }
                                                        });
                                                        // Scroll to first error if needed
                                                    }
                                                }}
                                                className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20 uppercase tracking-widest"
                                            >
                                                Continue &rarr;
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">🛡️</div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                            Your data is encrypted with 256-bit SSL security. We never share your manifest details.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                        >
                            <div className="lg:col-span-7 space-y-8">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">SECURE CHECKOUT</h1>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Select your preferred payment gateway</p>
                                </div>

                                <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm">
                                    <AnimatePresence mode="wait">
                                        {!showQR ? (
                                            <motion.div
                                                key="methods"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                            >
                                                {[
                                                    { id: 'QR', icon: '📱', title: 'UPI QR', sub: 'Scan & Pay' },
                                                    { id: 'UPI', icon: '🏦', title: 'UPI ID', sub: 'VPA Transfer' },
                                                    { id: 'CARD', icon: '💳', title: 'Card', sub: 'Debit/Credit' },
                                                    { id: 'NETBANKING', icon: '🌐', title: 'Net Banking', sub: 'Direct Bank' }
                                                ].map((m) => (
                                                    <button
                                                        key={m?.id}
                                                        type="button"
                                                        onClick={() => formik.setFieldValue('method', m?.id)}
                                                        className={`p-6 rounded-[32px] border-2 text-left transition-all duration-300 ${formik.values?.method === m?.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'}`}
                                                    >
                                                        <div className="text-3xl mb-4">{m?.icon}</div>
                                                        <p className="font-black text-slate-900 uppercase tracking-tight">{m?.title}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m?.sub}</p>
                                                    </button>
                                                ))}

                                                <div className="md:col-span-2 pt-6">
                                                    <AnimatePresence mode="wait">
                                                        {formik.values.method === 'UPI' && (
                                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2">
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Enter UPI ID</label>
                                                                <input
                                                                    type="text"
                                                                    name="upiId"
                                                                    value={formik?.values?.upiId}
                                                                    onChange={formik.handleChange}
                                                                    placeholder="username@bank"
                                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-all"
                                                                />
                                                            </motion.div>
                                                        )}
                                                        {formik.values.method === 'CARD' && (
                                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Card Number</label>
                                                                    <input
                                                                        type="text"
                                                                        name="cardNumber"
                                                                        maxLength="16"
                                                                        value={formik?.values?.cardNumber}
                                                                        onChange={formik.handleChange}
                                                                        placeholder="0000 0000 0000 0000"
                                                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-all"
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Expiry</label>
                                                                        <input
                                                                            type="text"
                                                                            name="cardExpiry"
                                                                            maxLength="5"
                                                                            value={formik.values?.cardExpiry}
                                                                            onChange={formik.handleChange}
                                                                            placeholder="MM/YY"
                                                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-all"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">CVV</label>
                                                                        <input
                                                                            type="password"
                                                                            name="cardCVV"
                                                                            maxLength="3"
                                                                            value={formik.values?.cardCVV}
                                                                            onChange={formik.handleChange}
                                                                            placeholder="***"
                                                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-all"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                        {formik.values.method === 'NETBANKING' && (
                                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2">
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Bank</label>
                                                                <select
                                                                    name="bankName"
                                                                    value={formik.values?.bankName}
                                                                    onChange={formik.handleChange}
                                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-all appearance-none"
                                                                >
                                                                    <option value="">Choose a bank...</option>
                                                                    <option value="SBI">State Bank of India</option>
                                                                    <option value="HDFC">HDFC Bank</option>
                                                                    <option value="ICICI">ICICI Bank</option>
                                                                    <option value="AXIS">Axis Bank</option>
                                                                </select>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="qr-view"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="text-center py-4 space-y-8"
                                            >
                                                <div className="relative inline-block">
                                                    <div className="w-56 h-56 bg-white p-4 rounded-3xl border-2 border-indigo-600 shadow-2xl mx-auto">
                                                        <img
                                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedUPI}`}
                                                            // src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=8160491336-1@nyes&pn=Darshan&am=${totalPay}&cu=INR`}

                                                            alt="Payment QR"
                                                            className="w-full h-full"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                    </div>
                                                    <div className="absolute -top-3 -right-3 bg-slate-900 text-white px-3 py-1 rounded-xl font-black text-[10px] shadow-lg">
                                                        {formatTime(timeLeft)}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <button
                                                        type="button"
                                                        onClick={formik.handleSubmit}
                                                        className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs"
                                                    >
                                                        I have completed payment
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowQR(false)}
                                                        className="text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-rose-500 transition-colors"
                                                    >
                                                        Cancel & Change Method
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-indigo-600 transition-colors px-4"
                                >
                                    &larr; Back to Manifest
                                </button>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="sticky top-8 bg-slate-50 p-10 rounded-[56px] border border-slate-100 space-y-10">
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Order Summary</h3>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Adventure</span>
                                                <span className="font-black text-slate-800">{trip?.to}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Travelers</span>
                                                <span className="font-black text-slate-800">x {persons}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Subtotal</span>
                                                <span className="font-black text-slate-800">₹{totalPay.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Tax (GST)</span>
                                                <span className="font-black text-emerald-500">Included</span>
                                            </div>
                                        </div>

                                        <div className="h-px bg-slate-200" />

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Final Amount</p>
                                                <p className="text-4xl font-black tracking-tighter text-indigo-600">₹{totalPay.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {!showQR && (
                                        <button
                                            disabled={loading}
                                            onClick={formik.handleSubmit}
                                            className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50 uppercase tracking-widest"
                                        >
                                            {loading ? 'Verifying...' : 'Pay Now'}
                                        </button>
                                    )}

                                    <div className="flex items-center justify-center gap-4 opacity-30 grayscale">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" referrerPolicy="no-referrer" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" referrerPolicy="no-referrer" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" referrerPolicy="no-referrer" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="bg-white rounded-[64px] shadow-[0_48px_96px_-12px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden relative">
                                {/* Celebration Background */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50" />
                                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
                                </div>

                                <div className="relative z-10 p-12 md:p-20 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                                        className="w-24 h-24 bg-emerald-500 text-white rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-200"
                                    >
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <motion.path
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.5, delay: 0.5 }}
                                                strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </motion.div>

                                    <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Adventure Awaits!</h1>
                                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs mb-16">Your booking for {trip.to} is confirmed</p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Destination</p>
                                            <p className="text-xl font-black text-slate-900">{trip?.to}</p>
                                        </div>
                                        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Travelers</p>
                                            <p className="text-xl font-black text-slate-900">{persons} Person{persons > 1 ? 's' : ''}</p>
                                        </div>
                                        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Transaction ID</p>
                                            <p className="font-mono font-bold text-slate-600 text-sm">{txnId}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">

                                        <InvoiceButton
                                            trip={trip}
                                            persons={persons}
                                            txnId={txnId}
                                            passengers={formik.values.passengers}
                                            contact={formik.values.contactInfo}
                                            variant="big"   // 🔥 THIS LINE IS IMPORTANT
                                        />

                                        <button
                                            onClick={() => navigate('/history')}
                                            className="w-full md:w-auto bg-white border-2 border-slate-100 text-slate-600 px-12 py-6 rounded-3xl font-black uppercase tracking-widest text-xs hover:border-indigo-600 bg-blue-600 hover:text-indigo-600 transition-all"
                                        >
                                            View Trip History
                                        </button>

                                    </div>
                                </div>

                                <div className="bg-slate-50 p-8 text-center border-t border-slate-100 relative z-10">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        A confirmation email has been sent to {formik.values.contactInfo.email}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-indigo-600 transition-colors inline-flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Back to Dashboard
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};
