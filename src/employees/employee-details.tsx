"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, DollarSign, Building2 } from "lucide-react"
import { Button } from "../ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { employeeApi } from "../api/api"
import type { Employee } from "../types"

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchEmployee(Number.parseInt(id))
    }
  }, [id])

  const fetchEmployee = async (employeeId: number) => {
    try {
      setLoading(true)
      const data = await employeeApi.getById(employeeId)
      setEmployee(data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch employee details")
      console.error("Error fetching employee:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!employee) return

    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeApi.delete(employee.id)
        navigate("/employees")
      } catch (err) {
        setError("Failed to delete employee")
        console.error("Error deleting employee:", err)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !employee) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || "Employee not found"}</p>
        <Link to="/employees">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Employees
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 mr-8 ml-8 mt-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/employees">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {employee.firstName} {employee.lastName}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Link to={`/employees/${employee.id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm">{employee.email}</p>
              </div>
            </div>
            {employee.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm">{employee.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Hire Date</p>
                <p className="text-sm">{new Date(employee.hireDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Position</p>
              <Badge variant="secondary" className="mt-1">
                {employee.position}
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="text-sm">{employee.department?.name || "N/A"}</p>
                {employee.department?.description && (
                  <p className="text-xs text-gray-400 mt-1">{employee.department.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Salary</p>
                <p className="text-sm font-semibold">${employee.salary.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Created At</p>
            <p className="text-sm">{new Date(employee.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Last Updated</p>
            <p className="text-sm">{new Date(employee.updatedAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
