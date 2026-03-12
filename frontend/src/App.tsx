import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/dashboard/side-bar";
import { Header } from "./components/dashboard/header";
import Overview from "./pages/overview";
import UserManagement from "./pages/user-management";

function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSimulate={() => {}} />

        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
