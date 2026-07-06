
import Footer from '../../component/layouts/Footer';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import useTrips from '../../hooks/useTrips';
import { fetchTrip } from '../../services/tripServices';
import { useEffect, useState } from 'react';
import { fetchUser } from '../../services/authService';

const About = () => {
    const { trips } = useTrips();
    const navigate = useNavigate();
    const [trip, setTrip] = useState([])
    const [user, setUser] = useState([])
    
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const allTrips = await fetchTrip();
                const allusers =await fetchUser();
                console.log("allTrips : ", allTrips.trip);
                setTrip(allTrips.trip);
                setUser(allusers.users);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTrips();
    },[])


const aiTrips = trip.filter(t => t?.tripType === "AI") || [];
const adminTrips = trip.filter(t => t?.tripType === "JOIN") || [];
const stats = [
    { label: "Happy Travelers", value: trips.length, icon: "🌍" },
    { label: "AI Itineraries", value: aiTrips.length, icon: "🤖" },
    { label: "Destinations", value: adminTrips.length, icon: "📍" },
    { label: "Local Partners", value: user.length, icon: "🤝" }
];

const values = [
    {
        title: "Expert Curation",
        desc: "Every itinerary is hand-picked and vetted by our local travel experts to ensure authenticity.",
        icon: "🌟",
        color: "bg-amber-50 text-amber-600"
    },
    {
        title: "AI-Powered",
        desc: "Our proprietary AI models analyze millions of data points to tailor every trip to your soul.",
        icon: "🤖",
        color: "bg-indigo-50 text-indigo-600"
    },
    {
        title: "Local Impact",
        desc: "We prioritize sustainable tourism that directly benefits local communities and preserves heritage.",
        icon: "🌍",
        color: "bg-emerald-50 text-emerald-600"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

return (
    <div className="min-h-screen flex flex-col bg-white">

        <main className="flex-grow">
            {/* Hero Section */}
            <section className="relative py-32 px-6 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:40px_40px]"></div>
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
                            The Future of <br />
                            <span className="text-indigo-400">Exploration</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                            We are redefining how the world experiences India by merging cutting-edge AI with deep-rooted local wisdom.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="bg-white p-10 rounded-[48px] shadow-lg shadow-slate-400 border border-slate-100 text-center group hover:border-indigo-200 transition-all"
                        >
                            <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">{stat.icon}</div>
                            <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}+</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Story Section */}
            <section className="max-w-7xl mx-auto px-6 py-40">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-indigo-600/10 rounded-[72px] blur-3xl"></div>
                        <img
                            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=2071"
                            alt="Our Story"
                            className="relative z-10 w-full h-[700px] object-cover rounded-[64px] shadow-2xl border-8 border-white"
                            referrerPolicy="no-referrer"
                        />
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -bottom-12 -right-12 z-20 bg-white p-10 rounded-[48px] shadow-2xl border border-slate-100 hidden md:block"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl">✨</div>
                                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Our Philosophy</h4>
                            </div>
                            <p className="text-slate-500 font-medium max-w-[200px]">Travel is not just about places, but new ways of seeing.</p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div>
                            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Our Mission</h2>
                            <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-8">Democratizing Luxury Travel</h3>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                We started with a simple idea: everyone should have access to the kind of personalized, high-touch travel planning that was once reserved for the elite. By leveraging AI, we&apos;ve made that a reality.
                            </p>
                        </div>
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">🎯</div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 mb-2">Precision Planning</h4>
                                    <p className="text-slate-500 font-medium">Our AI understands the nuances of your preferences, from local spice levels to architectural styles.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">🌱</div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 mb-2">Sustainable Growth</h4>
                                    <p className="text-slate-500 font-medium">We ensure that our growth supports the preservation of the very cultures we invite you to explore.</p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-8">
                            <button
                                onClick={() => {       // ✅ central logout
                                    navigate("/login");   // redirect
                                }}
                                className="px-12 py-6 bg-slate-900 text-white rounded-[32px] font-black hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 uppercase tracking-widest text-sm">
                                Plan Your AI Trip
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-slate-50 py-40 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Core Values</h2>
                        <h3 className="text-5xl md:text-5xl font-black text-slate-900 tracking-tighter">What Drives Us</h3>
                    </div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-12"
                    >
                        {values.map((value, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="bg-white p-12 rounded-[56px] shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-indigo-200 transition-all"
                            >
                                <div className={`w-20 h-20 ${value.color} rounded-3xl flex items-center justify-center text-4xl mb-10 group-hover:rotate-6 transition-transform`}>
                                    {value.icon}
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{value.title}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {value.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="bg-slate-900 py-40 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:60px_60px]"></div>
                </div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">Heritage & Legacy</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">Preserving the Soul of India</h3>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">
                            InEx-Trip was born from a deep respect for India&apos;s rich cultural tapestry. We recognize that every temple, every spice market, and every mountain pass tells a story that has been centuries in the making. Our mission is to ensure that these stories continue to be told with the dignity and respect they deserve.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                            <div className="space-y-4">
                                <h4 className="text-xl font-black text-white uppercase tracking-widest">Cultural Integrity</h4>
                                <p className="text-slate-500 font-medium">We work closely with local historians and cultural custodians to ensure that our AI-generated itineraries respect local customs and traditions, providing travelers with an authentic and respectful experience.</p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xl font-black text-white uppercase tracking-widest">Economic Empowerment</h4>
                                <p className="text-slate-500 font-medium">By connecting travelers directly with local artisans and service providers, we ensure that the economic benefits of tourism stay within the communities, fostering sustainable growth and heritage preservation.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Vision & Future Section */}
            <section className="max-w-7xl mx-auto px-6 py-40">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em]">The InEx-Trip Vision</h2>
                        <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">A New Era of Conscious Exploration</h3>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed">
                            At InEx-Trip, we believe that travel is the ultimate catalyst for personal growth and global understanding. Our vision extends beyond just booking trips; we are building a digital ecosystem where technology serves as a bridge between diverse cultures.
                        </p>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed">
                            We envision a world where every traveler can experience the soul of a destination without the friction of traditional planning. By harnessing the power of artificial intelligence, we preserve the spontaneity of travel while providing the security of expert curation. Our commitment is to create journeys that are as unique as the individuals who embark on them, ensuring that every mile traveled contributes to a more connected and empathetic world.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-50 p-12 md:p-20 rounded-[64px] border border-slate-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10 space-y-12">
                            <div>
                                <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Our Commitment to You</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    We pledge to maintain the highest standards of data privacy and ethical AI usage. Your travel preferences are your own, and we use them solely to craft experiences that resonate with your personal values and interests.
                                </p>
                            </div>
                            <div className="h-px bg-slate-200"></div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Sustainable Heritage</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    Every trip planned through our platform is designed to minimize environmental impact and maximize local economic benefit. We partner with grassroots organizations to ensure that tourism remains a force for good in the communities we visit.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>

        <Footer />
    </div>
);
};

export default About;

