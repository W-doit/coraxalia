import { Login , Register, Home } from "./pages";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import MemberDashboard from "./components/Dashboard/MemberDashboard";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
//       const fakeUser = {
//   name: "Maria Gomez",
//   email: "maria@example.com",
//   role: "member",
// };
//       const fakeUser2 = {
//   name: "adnane abdellaoui",
//   email: "adnaneabdellaoui@gmail.com",
//   role: "admin",
// };
  return (

 <>

 <Router>
 <Routes>
         {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
            {/* Dashboard Routes */}
        <Route path="/dashboard/admin" element={<AdminDashboard  />} />
        <Route path="/dashboard/member" element={<MemberDashboard />} />
        {/* Catch-all for undefined routes */}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
    </Router>
  
 </>
  );
}

export default App;