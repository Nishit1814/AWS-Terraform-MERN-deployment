import { Route } from "react-router-dom";
import ProtectedRoute from "../component/guards/ProtectedRoute";

// User Pages
import Dashboard from "../pages/user/UserDashboard";
// import EditProfile from "../component/user/EditProfile";
import HistoryPage from "../pages/user/HistoryPage";
import Favourites from "../pages/user/Favourites";
import JoinTrip from "../pages/user/JoinTrip";
import Reviews from "../pages/user/UserReviews";
import { Settings } from "../pages/user/Settings";
import CreateTrip from "../pages/user/CreateTrip";
import { Navbar } from "../component/layouts/Navbar";
import TripDetails from "../pages/user/TripDetails";
import CancellationManager from "../component/layouts/CancelTrip";


export default function UserRoutes() {
    return (
        <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
            <Route element={<Navbar />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/join-trip" element={<JoinTrip />} />
                <Route
                    path="/trip/:id"
                    element={<TripDetails key={window.location.pathname} />} />
                <Route path="/create-trip" element={<CreateTrip />} />
                {/* <Route path="/edit-profile" element={<EditProfile />} /> */}
                <Route path="/favourites" element={<Favourites />} />
                <Route path="/user-reviews" element={<Reviews />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/cancellations" element={<CancellationManager />} />
            </Route>
        </Route>
    );
}