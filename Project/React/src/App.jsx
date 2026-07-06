
import './App.css'
import 'animate.css';
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast'
import 'sweetalert2/dist/sweetalert2.min.css';
import PublicRoutes from './routes/PublicRoutes';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import { Payment } from "./pages/user/Payment"
import Loading from './pages/Loading';
import ChatBot from './component/common/ChatBot';
import { SocketProvider } from './context/SocketContext';
import NotificationToast from './component/common/NotificationToast';



export const APPNAME = "InexTrip"
function App() {
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000);

    return () => clearTimeout(timer);
  }, [])


  return (
    <>
      <Toaster position="top-center" />

      <new Swal />

      {isloading ? (
        <Loading />
      ) : (

        <AuthProvider>
          {/* SocketProvider must be inside AuthProvider so it can read user/token */}
          <SocketProvider>
            {/* Global real-time notification toast — visible on every page */}
            <NotificationToast />
            <Routes>

              {PublicRoutes()}
              {UserRoutes()}
              {AdminRoutes()}

              {/* Common */}
              <Route path="/payment/:id" element={<Payment />} />
            </Routes >
            <ChatBot />
          </SocketProvider>
        </AuthProvider >
      )
      }
    </>
  )
}

export default App;
