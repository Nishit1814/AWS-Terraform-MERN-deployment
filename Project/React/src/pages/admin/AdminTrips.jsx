import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileSidebar from "../../component/layouts/ProfileSidebar";
import { deleteTrip, fetchTrip } from "../../services/tripServices";
import AdminSidebar from "../../component/admin/AdminSidebar";
import { useAuth } from "../../context/AuthContext";
import TripForm from "../../component/admin/TripForm";
import AdminHeader from "../../component/admin/AdminHeader";
import { TripPhotos } from "../../component/user/TripPhotos";
import TripContent from "../../component/user/TripContent";
import ReviewSection from "../../component/user/ReviewSection";
import RelatedTrips from "../../component/user/RelatedTrips";
import { BiSearch } from "react-icons/bi";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const TRIPS_PER_PAGE = 6;

export const AdminTrips = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // ── Server-side pagination state ─────────────────────────────────────────
  const [trips, setTrips] = useState([]);
  const [totalTrips, setTotalTrips] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ── Fetch page from backend ───────────────────────────────────────────────
  // const loadPage = useCallback(async (page) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const data = await fetchTripWithPagination({ page, limit: TRIPS_PER_PAGE });
  //     console.log("trip data :", data)
  //     // setTrips(data.trips);
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);

  //     const activeTrips = data.trips.filter((trip) => {
  //       const endDate = new Date(trip.endDate);
  //       endDate.setHours(0, 0, 0, 0);

  //       return endDate >= today;
  //     });

  //     setTrips(activeTrips);
  //     setTotalTrips(data.totalTrips);
  //     setTotalPages(data.totalPages);
  //     setCurrentPage(data.currentPage);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  const loadPage = useCallback(async (page) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTrip(true);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // remove expired trips
      const activeTrips = data.trip.filter((trip) => {
        const endDate = new Date(trip.endDate);
        endDate.setHours(0, 0, 0, 0);

        return endDate >= today;
      });

      // pagination
      const startIndex = (page - 1) * TRIPS_PER_PAGE;
      const endIndex = startIndex + TRIPS_PER_PAGE;

      const paginatedTrips = activeTrips.slice(startIndex, endIndex);

      setTrips(paginatedTrips);

      setTotalTrips(activeTrips.length);
      setTotalPages(Math.ceil(activeTrips.length / TRIPS_PER_PAGE));
      setCurrentPage(page);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load page 1 on mount
  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  // Re-load current page whenever currentPage changes (via pagination buttons)
  useEffect(() => {
    loadPage(currentPage);
  }, [currentPage, loadPage]);

  // Open create modal if ?create=true in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("create") === "true") setShowCreateModal(true);
  }, [location.search]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const handleEditTrip = (trip) => {
    navigate(`/trips/edit/${trip._id}`);
  };

  const handleDeleteTrip = async (id, tripType) => {
    const confirmDelete = await Swal.fire({
      title: "Delete this trip?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!"
    });

    if (!confirmDelete.isConfirmed) return;
    try {
      setDeletingId(id);
      await deleteTrip(id, tripType);
      toast.success("Trip deleted successfully 🚀");
      // After delete: if this was the last item on the page, go back one page
      const newTotal = totalTrips - 1;
      const newTotalPages = Math.ceil(newTotal / TRIPS_PER_PAGE);
      const targetPage = currentPage > newTotalPages ? Math.max(1, newTotalPages) : currentPage;
      await loadPage(targetPage);
      setCurrentPage(targetPage);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.message,
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ── Pagination helpers ────────────────────────────────────────────────────
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      const isEdge = i === 1 || i === totalPages;
      const isNear = Math.abs(i - currentPage) <= 1;
      if (isEdge || isNear) {
        pages.push(i);
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        pages.push("...");
      }
    }
    // Deduplicate consecutive "..."
    return pages.filter((p, idx) => !(p === "..." && pages[idx - 1] === "..."));
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  const filteredTrips = trips.filter((trip) =>
    `${trip.from} ${trip.to} ${trip.tripType}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen  bg-slate-50 flex text-slate-900">

      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      <main
        className={`flex-grow overflow-y-auto transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-72"}`}
      >
        <AdminHeader
          title="Inventory Control"
          subtitle={`Active Batch Units: ${totalTrips}`}
          user={user}
          onProfileClick={() => setIsProfileOpen(true)}
          onToggleSidebar={() => setSidebarVisible(!isSidebarVisible)}
        />

        <div className={`px-8 pb-10 mx-auto ${selectedTrip ? "max-w-[1200px]" : "max-w-[1800px]"
          }`}>
          {/* Top bar */}

          {!selectedTrip && (
            <div className="py-4 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {totalTrips} trips · Page {currentPage} of {totalPages}
              </p>

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-[13px] font-bold"
              >
                Add New Inventory 🚀
              </button>
            </div>
          )}


          <div className="py-6 flex items-center justify-between gap-4">
            <div className="relative w-[380px] group">

              {/* Gradient Border Glow */}
              <div className="absolute -inset-[1px] rounded-2xl  from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-100 blur-sm transition duration-500"></div>

              {/* Main Input Container */}
              <div className="relative flex items-center bg-white/70  rounded-2xl border border-slate-200 transition-all duration-300 group-focus-within:shadow-md">

                {/* Icon */}
                <BiSearch className="ml-4 text-slate-400 text-xl group-focus-within:text-indigo-500 transition" />

                {/* Input */}
                <input
                  type="text"
                  placeholder="Search destinations, trips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-3 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                />

                {/* Clear Button */}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mr-3 text-slate-400 hover:text-red-500 transition text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Error state */}
          {error && (
            <div className="mb-4 px-5 py-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-bold">
              {error} —{" "}
              <button onClick={() => loadPage(currentPage)} className="underline">
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {selectedTrip ? (
            <div>
              {/* Back button */}
              <button
                onClick={() => setSelectedTrip(null)}
                className="mb-4 px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold"
              >
                ← Back to Trips
              </button>

              {/* Trip Details UI */}
              <TripPhotos trip={selectedTrip} />
              <TripContent trip={selectedTrip} />
              <RelatedTrips trip={selectedTrip} />
              <ReviewSection tripId={selectedTrip._id} />

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <div key={trip._id} className="bg-white rounded-[28px] overflow-hidden border border-slate-200 flex flex-col group shadow-sm hover:border-indigo-400 hover:shadow-md transition-all duration-300"
                >
                  {/* Image */}
                  <div className="h-56 relative overflow-hidden">
                    <img
                      src={trip.images?.[0] || "https://via.placeholder.com/400x208?text=No+Image"}
                      alt={`${trip.from} to ${trip.to}`}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <button
                      onClick={() => handleEditTrip(trip)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black text-indigo-600 uppercase tracking-widest border border-slate-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      Edit
                    </button>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-[8px] font-black text-indigo-100 uppercase tracking-widest mb-0.5">{trip.from}</p>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black tracking-tight leading-none">{trip.to}</h3>
                        <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-[7px] font-black text-white uppercase tracking-widest border border-white/30">
                          {trip.tripType}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Commercials</p>
                        <p className="text-lg font-black text-emerald-600 leading-none">
                          ₹{trip.price?.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Timeline</p>
                        <p className="text-sm font-black text-slate-900 leading-none">
                          {trip.dayPlan?.length ?? 0} Days
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedTrip(trip)}
                        className="flex-1 bg-slate-50 py-2.5 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 hover:text-indigo-600 transition-all"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleDeleteTrip(trip._id, trip.tripType)}
                        disabled={deletingId === trip._id}
                        className="flex-1 bg-rose-50 py-2.5 rounded-xl text-[9px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === trip._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Pagination ────────────────────────────────────────────────── */}
          {!selectedTrip && totalPages > 1 && !loading && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>

              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 font-bold text-sm select-none">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-xl text-[11px] font-black transition-all ${currentPage === page
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "border border-slate-200 text-slate-500 hover:bg-slate-100"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          )}
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

      {showCreateModal && (
        <TripForm
          setShowCreateModal={setShowCreateModal}
          onSuccess={async () => {
            await loadPage(1); // go to page 1 to see the new trip
            setCurrentPage(1);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};
