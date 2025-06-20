import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { employeeApi, handleApiError } from "../api/api";
import type { Employee } from "../types";

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEmployee(Number.parseInt(id));
    }
  }, [id]);

  const fetchEmployee = async (employeeId: number) => {
    try {
      setLoading(true);
      const data = await employeeApi.getById(employeeId);
      setEmployee(data);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!employee || !window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await employeeApi.delete(employee.id);
      navigate("/employees");
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (loading) {
    return <div className="p-4">Loading employee details...</div>;
  }

  if (!employee && !loading) {
    return (
      <div className="p-4">
        <p className="text-red-600">Employee not found</p>
        <Link to="/employees" className="text-blue-600 hover:underline">
          Back to Employees
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/employees">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {employee?.firstName} {employee?.lastName}
          </h1>
        </div>

        <div className="space-x-2">
          <Link to={`/employees/${employee?.id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="outline" className="text-red-600" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="mt-1 text-lg">
                {employee?.firstName} {employee?.lastName}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Position</h3>
              <p className="mt-1 text-lg">{employee?.position}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Department</h3>
              <p className="mt-1 text-lg">{employee?.department?.name || "-"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-lg">{employee?.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="mt-1 text-lg">{employee?.phone || "-"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Salary</h3>
              <p className="mt-1 text-lg">${employee?.salary.toLocaleString()}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Hire Date</h3>
              <p className="mt-1 text-lg">
                {new Date(employee?.hireDate ?? "").toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}