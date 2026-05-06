import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import DashboardPage from "./features/dashboard/DashboardPage";
import CatalogsPage from "./features/catalogs/CatalogsPage";
import ParametersPage from "./features/parameters/ParametersPage";
import TemplatesPage from "./features/templates/TemplatesPage";
import AssetConfigurationPage from "./features/asset-configuration/AssetConfigurationPage";
import ApplicationPage from "./features/application/ApplicationPage";
import SecurityPage from "./features/security/SecurityPage";
import LogOutPage from "./features/log-out/LogOutPage";
import NotFoundPage from "./features/not-found/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "catalogs", element: <CatalogsPage /> },
      { path: "parameters", element: <ParametersPage /> },
      { path: "templates", element: <TemplatesPage /> },
      { path: "asset-configuration", element: <AssetConfigurationPage /> },
      { path: "application", element: <ApplicationPage /> },
      { path: "security", element: <SecurityPage /> },
      { path: "log-out", element: <LogOutPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);