import { useRoutes } from "react-router-dom";
import EmployeeList from "../employees/employee-list";
import EmployeeDetails from "../employees/employee-details";
import EmployeeForm from "../employees/employee-form";
import DepartmentList from "../departments/department-list";
import DepartmentForm from "../departments/department-form";
import HomePage from "./home/homePage";
import Login from "../auth/login";
import Signup from "../auth/signup";
import ProtectedRoute from "../auth/protectedRoutes";


const AppRoutes = () =>
  useRoutes([
    {
      path: "/",
      element: <ProtectedRoute><HomePage /></ProtectedRoute>,
    },
    {
      path: "/employees",
      element: <ProtectedRoute><EmployeeList /></ProtectedRoute>,
    },
    {
      path: "/employees/:id",
      element: <ProtectedRoute><EmployeeDetails /></ProtectedRoute>,
    },
    {
      path: "/employees/new",
      element: <ProtectedRoute><EmployeeForm /></ProtectedRoute>,
    },
    {
      path: "/employees/:id/edit",
      element: <ProtectedRoute><EmployeeForm /></ProtectedRoute>,
    },
    {
      path: "/departments",
      element: <ProtectedRoute><DepartmentList /></ProtectedRoute>,
    },
    {
      path: "/departments/new",
      element: <ProtectedRoute><DepartmentForm /></ProtectedRoute>,
    },
    {
      path: "/departments/:id/edit",
      element: <ProtectedRoute><DepartmentForm /></ProtectedRoute>,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "*",
      element: <div className="p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
      </div>,
    },
  ]);

export default AppRoutes;