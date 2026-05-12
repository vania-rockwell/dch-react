import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import DashboardPage from "./features/dashboard/DashboardPage";
import CatalogsPage from "./features/catalogs/CatalogsPage";
import ParametersPage from "./features/parameters/ParametersPage";
import ParametersGroupsPage from "./features/parameters/ParametersGroupsPage";
import TemplatesPage from "./features/templates/TemplatesPage";
import TemplatesCustomPage from "./features/templates/TemplatesCustomPage";
import AssetConfigurationPage from "./features/asset-configuration/AssetConfigurationPage";
import ApplicationPage from "./features/application/ApplicationPage";
import ApplicationModulesPage from "./features/application/ApplicationModulesPage";
import ApplicationModulesIntegrationPage from "./features/application/ApplicationModulesIntegrationPage";
import ApplicationModulesReportingPage from "./features/application/ApplicationModulesReportingPage";
import SecurityPage from "./features/security/SecurityPage";
import SecurityPermissionsPage from "./features/security/SecurityPermissionsPage";
import LogOutPage from "./features/log-out/LogOutPage";
import UserPage from "./features/user/UserPage";
import NotFoundPage from "./features/not-found/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "catalogs", element: <CatalogsPage /> },
      { path: "parameters", element: <ParametersPage /> },
      { path: "parameters/groups", element: <ParametersGroupsPage /> },
      { path: "templates", element: <TemplatesPage /> },
      { path: "templates/custom", element: <TemplatesCustomPage /> },
      { path: "asset-configuration", element: <AssetConfigurationPage /> },
      { path: "application", element: <ApplicationPage /> },
      { path: "application/modules", element: <ApplicationModulesPage /> },
      {
        path: "application/modules/integration",
        element: <ApplicationModulesIntegrationPage />,
      },
      {
        path: "application/modules/reporting",
        element: <ApplicationModulesReportingPage />,
      },
      { path: "security", element: <SecurityPage /> },
      { path: "security/permissions", element: <SecurityPermissionsPage /> },
      { path: "user", element: <UserPage /> },
      { path: "log-out", element: <LogOutPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);