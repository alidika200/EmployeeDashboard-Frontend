"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { employeeApi, handleApiError } from "../api/api"
import type { Employee } from "../types"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [expandedEmployees, setExpandedEmployees] = useState<Record<number, Employee>>({})
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState<Record<number, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  // Fetch details for visible employees when the list changes
  useEffect(() => {
    if (!loading && filteredEmployees.length > 0) {
      fetchVisibleEmployeeDetails()
    }
  }, [filteredEmployees, loading])

  useEffect(() => {
    const filtered = employees.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredEmployees(filtered)
  }, [employees, searchTerm])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const data = await employeeApi.getAll()
      setEmployees(data)
      setError(null)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  // Fetch details for all visible employees
  const fetchVisibleEmployeeDetails = async () => {
    const fetchPromises = filteredEmployees
      .filter(employee => !expandedEmployees[employee.id])
      .map(employee => {
        setLoadingDetails(prev => ({ ...prev, [employee.id]: true }))
        return employeeApi.getById(employee.id)
          .then(data => {
            setExpandedEmployees(prev => ({ ...prev, [employee.id]: data }))
            return employee.id
          })
          .catch(err => {
            console.error(`Error fetching details for employee ${employee.id}:`, handleApiError(err))
            return employee.id
          })
          .finally(() => {
            setLoadingDetails(prev => ({ ...prev, [employee.id]: false }))
          })
      })

    if (fetchPromises.length > 0) {
      await Promise.allSettled(fetchPromises)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeApi.delete(id)
        setEmployees(employees.filter((emp) => emp.id !== id))
        // Also remove from expanded employees if exists
        if (expandedEmployees[id]) {
          const newExpandedEmployees = { ...expandedEmployees }
          delete newExpandedEmployees[id]
          setExpandedEmployees(newExpandedEmployees)
        }
        setError(null)
      } catch (err) {
        setError(handleApiError(err))
      }
    }
  }

  // Helper to get the full employee object (either from expanded details or basic list)
  const getEmployeeData = (employee: Employee) => {
    return expandedEmployees[employee.id] || employee
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchEmployees}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 mr-8 ml-8 mt-4 mb-3">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
        <Link to="/employees/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((employee) => {
          const employeeData = getEmployeeData(employee)
          const isLoading = loadingDetails[employee.id]
          
          return (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {employee.firstName} {employee.lastName}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{employee.position}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Link to={`/employees/${employee.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to={`/employees/${employee.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(employee.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {employee.email}
                  </p>
                  {employeeData.phoneNumber && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {employeeData.phoneNumber}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Department:</span>{" "}
                    {isLoading ? (
                      <span className="inline-block w-16 h-4 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      employeeData.department?.name || "N/A"
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Salary:</span>{" "}
                    {isLoading ? (
                      <span className="inline-block w-16 h-4 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      employeeData.salary ? `$${employeeData.salary.toLocaleString()}` : "N/A"
                    )}
                  </p>
                </div>
              </CardContent>  
            </Card>
          )
        })}
      </div>

      {filteredEmployees.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No employees found</p>
          <Link to="/employees/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add First Employee
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}