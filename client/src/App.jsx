import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import { UserContextProvider } from "./userContext";
export default function App() {
    return (
        <BrowserRouter>
            <UserContextProvider>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUP />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </UserContextProvider>
        </BrowserRouter>
    );
}
