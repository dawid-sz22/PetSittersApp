import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom"
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ResetPasswordRequest from "./pages/ResetPasswordRequest.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import {PetSitterComponent} from "./components/PetSitterComponent.tsx";
import {PetSittersDetailsPage} from "./pages/PetSittersDetailsPage.tsx";

function RoutesComponent() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path={"/"} element={<HomePage/>}></Route>
                    <Route path={"/pet-sitters/"} element={<PetSitterComponent/>}></Route>
                    <Route path={"/pet-sitter/"} element={<PetSittersDetailsPage/>}></Route>
                    <Route path={"/login/"} element={<LoginPage/>}></Route>
                    <Route path={"/register/"} element={<RegisterPage/>}></Route>
                    <Route path={"/reset-password/"} element={<ResetPasswordRequest/>}></Route>
                    <Route path={"/reset-password/change/"} element={<ResetPassword/>}></Route>
                </Routes>
            </Router>
        </>
    )
}

export default RoutesComponent;