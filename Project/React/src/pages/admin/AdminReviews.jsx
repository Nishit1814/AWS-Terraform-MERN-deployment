
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchReview } from '../../services/reviewServices';
import { AnimatePresence, motion } from 'motion/react';

import AdminHeader from '../../component/admin/AdminHeader';
import AdminSidebar from '../../component/admin/AdminSidebar';
import ProfileSidebar from '../../component/layouts/ProfileSidebar';
import { Search } from 'lucide-react';


const AdminReviews = () => {

  const { user, logout } = useAuth();
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState()

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [filterCategory, setFilterCategory] = useState('All');


  useEffect(() => {

    const loadData = async () => {
      try {
        const response = await fetchReview();
        setReviews(response.reviews);

      } catch (err) {
        console.error("Failed to load admin data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();

  }, []);

  const getTripCategory = (tripId) => {
    return tripId ? tripId.category : 'Unknown';
  };

  const getTripName = (tripId) => {
    return tripId ? `${tripId?.from} to ${tripId.to}` : 'Unknown Trip';
  };

  const filteredReviews = reviews.filter(review => {
    const category = getTripCategory(review?.tripId);
    const tripName = getTripName(review?.tripId);
    const matchesCategory = filterCategory === 'All' || category === filterCategory;

    const matchesSearch = tripName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      review?.fullname?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      review?.comment?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Heritage', 'Mountains', 'Beaches', 'Cities'];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex text-slate-900 transition-all duration-300 overflow-hidden">
      {/* Sidebar - TOGGLEABLE */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />


      {/* Main Content */}
      <main
        className={`flex-grow h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-72"}`}
      >

        <AdminHeader
          title="Review Management "
          subtitle={`Total Reviews : ${reviews.length}`}
          user={user}
          onProfileClick={() => setIsProfileOpen(true)}

        />

        <div className="p-8 space-y-8 max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${filterCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative text-slate-400 w-full md:w-[350px] lg:w-[420px]">
              <Search className='relative left-3 top-8.5 w-5 h-5 text-slate-400 ' />
              <input
                type="search"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 font-bold text-slate-700 text-sm shadow-lg" />

            </div>

          </div>



          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-white rounded-[64px] border border-slate-100">
              <div className="w-16 h-16 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Analyzing feedback data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredReviews.map((review, idx) => (
                  <motion.div
                    key={review._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden hover:shadow-2xl transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-100/50 transition-colors" />

                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-md group-hover:scale-110 transition-all duration-200">

                          {review.userId ? (
                            <> {
                              review.userId.profilePhoto ?

                                (<img
                                  src={review.userId.profilePhoto}
                                  className="w-full h-full object-cover"
                                />
                                ) : (
                                  <div className="w-full h-full text-2xl  font-black bg-indigo-600 text-white flex items-center justify-center">
                                    {review?.userId.fullname?.charAt(0).toUpperCase()}
                                  </div>)
                            }
                            </>
                          ) : (
                            review.profilePhoto ?
                              <img
                                src={review.profilePhoto}
                                className="w-full h-full object-cover"
                              /> :
                              <div className="w-full h-full text-2xl  font-black bg-indigo-600 text-white flex items-center justify-center">
                                {review?.fullname?.charAt(0).toUpperCase()}
                              </div>
                          )}
                        </div>
                        <div>
                          {
                            review.userId ?

                              (<h4 className="font-black text-slate-900 tracking-tight">{review?.userId?.fullname || "Unknown User"}</h4>) :
                              (<h4 className="font-black text-slate-900 tracking-tight">{review?.fullname || "Unknown User"}</h4>)

                          }

                          <div className="flex text-amber-400 text-xs gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 px-3 py-1.5 rounded-xl text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        {new Date(review.createdAt).toLocaleDateString('en-GB')}
                      </div>
                    </div>

                    <div className="mb-6 relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{getTripCategory(review?.tripId)}</span>
                      </div>
                      <h5 className="text-sm font-black text-slate-800 mb-4 line-clamp-1">{getTripName(review?.tripId)}</h5>
                      <p className="text-slate-500 font-bold text-sm leading-relaxed  line-clamp-3">
                        "{review?.comment}"
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex justify-between items-center relative z-10">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-emerald-50 text-slate-400 hover:scale-110 transition-all duration-200 hover:text-emerald-500 rounded-xl transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-rose-50 text-slate-400 hover:scale-110 transition-all duration-200 hover:text-rose-500 rounded-xl transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all">
                        View Trip
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && reviews.length === 0 && (
            <div className="bg-white border-4 border-dashed border-slate-100 rounded-[64px] p-32 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center text-4xl mb-6">🔍</div>
              <h3 className="text-2xl font-black text-slate-400 hover:scale-110 transition-all duration-200 uppercase tracking-widest">No reviews found</h3>
              <p className="text-slate-400 font-medium mt-2">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </main>

      {
        isProfileOpen && (
          <ProfileSidebar
            user={user}
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            logout={logout}
          />
        )
      }
    </div >
  );
};

export default AdminReviews;






