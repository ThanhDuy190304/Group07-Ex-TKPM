// @ts-ignore
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "./components/layout/sidebar";
import Student from "./pages/students";
import FacultyAndProgram from "./pages/facultiesAndPrograms";
import { ErrorProvider } from "./context/ErrorContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
                <Route path="/" element={<Student />} />
                <Route path="/students" element={<Student />} />
                <Route path="/faculties-and-programs" element={<FacultyAndProgram />} />
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
