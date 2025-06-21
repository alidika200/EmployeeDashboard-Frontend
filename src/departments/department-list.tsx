"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { departmentApi, handleApiError } from "../api/api"
import type { Department } from "../types"

export default function DepartmentList() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    const filtered = departments.filter(
      (department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (department.description && department.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredDepartments(filtered)
  }, [departments, searchTerm])

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const data = await departmentApi.getAll()
      setDepartments(data)
      setError(null)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await departmentApi.delete(id)
        setDepartments(departments.filter((dept) => dept.id !== id))
        setError(null)
      } catch (err) {
        setError(handleApiError(err))
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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchDepartments}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 mr-8 ml-8 mt-4 mb-3">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
        <Link to="/departments/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">
          {filteredDepartments.length} department{filteredDepartments.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDepartments.map((department) => (
          <Card key={department.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{department.name}</CardTitle>
                <div className="flex space-x-1">
                  <Link to={`/departments/${department.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(department.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {department.description && <p className="text-sm text-gray-600">{department.description}</p>}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Created: {new Date(department.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(department.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDepartments.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No departments found</p>
          <Link to="/departments/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add First Department
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}