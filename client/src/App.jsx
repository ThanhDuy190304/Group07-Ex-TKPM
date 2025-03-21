import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Student from "./pages/student";
import Academic from "./pages/academic";
import { ErrorProvider } from "./utils/ErrorContext";

function App() {
  return (
    <Router>
      <div className="flex bg-black h-screen">
        <Sidebar />
        <div className="flex-1 m-2 px-8 py-8 bg-white rounded-md overflow-auto">
          <ErrorProvider>
            <Routes>
              <Route path="/" element={<Student />} />
              <Route path="/student" element={<Student />} />
              <Route path="/academic" element={<Academic />} />
            </Routes>
          </ErrorProvider>
        </div>
      </div>
    </Router>
  );
}
export default App;
