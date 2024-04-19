import React, {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import App from "./App";
import {Provider as StoreProvider} from "react-redux";
import {store} from "./state/store";
import {ServiceContextType, ServiceProvider} from "./contexts/ServiceContext";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {SignInPage} from "./pages/SignInPage";
import {SignInConfirmPage} from "./pages/SignInConfirmPage";
import {FirebaseAuthService} from "./services/FirebaseAuthService";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

const services: ServiceContextType = {
    // authService: new MockAuthService()
    authService: new FirebaseAuthService()
}



root.render(
    <StrictMode>
        <StoreProvider store={store}>
            <ServiceProvider services={services}>
                <Router>
                    <Routes>
                        <Route path={"editor/"} element={<App />} />
                        <Route path={"editor/access/signin"} element={<SignInPage />} />
                        <Route path={"editor/access/confirm"} element={<SignInConfirmPage />} />
                    </Routes>
                </Router>
            </ServiceProvider>
        </StoreProvider>
    </StrictMode>
);
