import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom"
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";

function RoutesComponent() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path={"/"} element={<HomePage/>}></Route>
                    <Route path={"/login/"} element={<LoginPage/>}></Route>
                    <Route path={"/register/"} element={<RegisterPage/>}></Route>
                </Routes>
            </Router>
        </>
    )
}

export default RoutesComponent;