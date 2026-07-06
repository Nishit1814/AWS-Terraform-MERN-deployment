
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Activity, MapPin, Calendar, Mail, Phone, ArrowLeft, Trash2, CheckCircle } from 'lucide-react';
import { deleteUserbyId } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { fetchauditUser } from '../../services/auditService';


const AdminUserProfile = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const loadAuditData = useCallback(async () => {
    try {
      const audit = await fetchauditUser(id);
      console.log("user profile page :", audit);
      setAuditData(audit);
    } catch (err) {
      console.error("Failed to load audit data", err);
      navigate('/users');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAuditData();
  }, [loadAuditData]);

  const handleDeleteUser = async () => {
    if (id === user._id) {
      alert("Error: You cannot delete your own master admin account.");
      return;
    }
    if (!window.confirm("CRITICAL: Permanently remove this explorer and all associated journey logs?")) return;
    try {
      await deleteUserbyId(id);
      navigate('/users');
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading || !auditData) {
    return <div className="p-10">Loading...</div>;
  }

  const { nodeMetadata: target, history = [], reviews = [] } = auditData;

  return (
    <div className="h-screen bg-slate-50 flex text-slate-900 transition-all duration-300 overflow-hidden">


      <main
        className={`flex-grow h-full overflow-y-auto overflow-x-hidden transition-all duration-300 scroll-smooth`}
      >

        <button
          onClick={() => navigate('/users')}
          className="flex my-3 mx-3 gap-2 bg-white text-slate-600 px-5 py-4 border border-slate-200 rounded-2xl font-black text-[10px] hover:bg-slate-50 uppercase tracking-widest shadow-sm transition-all"
        >
          <ArrowLeft size={14} />
          Back to Registry
        </button>

        <div className="p-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm p-8 text-center">
                <div className="relative inline-block mb-6">
                  {target?.profilePhoto ? (
                    <img
                      src={target?.profilePhoto}
                      className="w-17 h-17 rounded-2xl border-2 border-white shadow-md object-cover"
                      alt={target?.fullname}
                    />
                  ) : (
                    <div className="w-17 h-17 bg-indigo-600 text-white text-5xl rounded-xl flex items-center justify-center font-bold">
                      {target?.fullname?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-4 border-white">
                    <CheckCircle size={16} />
                  </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">{target?.fullname}</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">{target.role}</p>

                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Mail size={16} className="text-indigo-600" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                      <p className="text-xs font-bold text-slate-700">{target.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Phone size={16} className="text-indigo-600" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mobile Contact</p>
                      <p className="text-xs font-bold text-slate-700">{target.mobile || 'Not Linked'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Calendar size={16} className="text-indigo-600" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Enrollment Date</p>
                      <p className="text-xs font-bold text-slate-700">{new Date(target.createdAt).toLocaleDateString('en-GB')}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDeleteUser}
                  className="w-full mt-8 flex items-center justify-center gap-2 bg-rose-50 text-rose-600 py-4 rounded-2xl font-black text-[10px] hover:bg-rose-600 hover:text-white uppercase tracking-widest transition-all shadow-sm"
                >
                  <Trash2 size={14} />
                  Purge Explorer
                </button>
              </div>
            </div>

            {/* Right Column: Activity & Stats */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Trips</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{history?.length}</p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Favourites</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{target?.favourites?.length}</p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Reviews</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{reviews}</p>
                </div>
              </div>

              <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity size={20} className="text-indigo-600" />
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Activity Stream</h3>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Historical Logs</span>
                </div>

                <div className="p-8 max-h-[350px] overflow-y-auto pr-2 ">
                  {history?.length === 0 ? (
                    <div className="py-20 text-center">
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No activity signals detected</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {history.map((trip, idx) => {
                        return (
                          <div key={trip._id} className="flex items-start gap-6 group">
                            <div className="relative flex flex-col items-center">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {idx + 1}
                              </div>
                              {idx < history.length - 1 && <div className="w-0.5 h-12 bg-slate-100 mt-2" />}
                            </div>

                            <div className="flex-grow pt-1">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-black text-slate-900 text-sm tracking-tight">
                                  {trip.type === 'JOINED' ? 'Enrolled in Journey' : 'Created Itinerary'}
                                </h4>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  {new Date(trip.createdAt).toLocaleString('en-GB')}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                                <MapPin size={12} />
                                {trip.tripId?.to || 'Unknown Destination'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default AdminUserProfile;
