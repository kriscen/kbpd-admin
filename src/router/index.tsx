import {Routes,Route} from 'react-router-dom'
import Home from "@/views/home"
import About from "@/views/about"

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default Router;