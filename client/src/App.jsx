// @ts-ignore
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "./components/layout/sidebar";
import StudentPageContainer from "./pages/students";
import FacultyAndProgramPage from "./pages/facultiesAndPrograms";
import CoursePage from "./pages/courses";
import SettingsPage from "./pages/settings";

import { ErrorProvider } from "./context/ErrorContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './config/i18n';

// Tạo QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex bg-black h-screen w-screen">
          <Sidebar />
          <div className="flex-1 m-2 px-8 py-8 bg-white rounded-md overflow-auto">
            <ErrorProvider>
              <Routes>
                <Route path="/" element={<StudentPageContainer />} />
                <Route path="/students" element={<StudentPageContainer />} />
                <Route path="/faculties-and-programs" element={<FacultyAndProgramPage />} />
                <Route path="/courses" element={<CoursePage />} />
                <Route path="/setting" element={<SettingsPage />} />
              </Routes>
              <ToastContainer position="top-right" autoClose={3000} />
            </ErrorProvider>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
