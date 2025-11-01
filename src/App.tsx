import './App.css'
import './i18n'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NotFound from "./pages/NotFound.tsx";
import Home from "./pages/Home.tsx";
import CreateBlankSchedule from "./pages/CreateBlankSchedule.tsx";

const App = () => (
    <BrowserRouter>
        <Routes>
            {/* Define your routes here */}
            <Route path="*" element={<NotFound/>}/>
            <Route path={"/"} element={<Home/>}/>
            <Route path={"/create-blank"} element={<CreateBlankSchedule/>}/>
        </Routes>
    </BrowserRouter>
);

export default App
