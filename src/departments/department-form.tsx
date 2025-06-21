"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Textarea } from "../ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { departmentApi } from "../api/api"
import type { Department, CreateDepartmentRequest, UpdateDepartmentRequest } from "../types"

export default function DepartmentForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  console.log("DepartmentForm component before parse:", id)

  const [department, setDepartment] = useState<Department | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (isEditing && id) {
      fetchDepartment(id)
    }
  }, [id, isEditing])
  console.log("DepartmentForm component after parse:", id)

  const fetchDepartment = async (departmentId: string) => {
    console.log("Fetching department with ID:", departmentId)
    try {
      setLoading(true)
      const data = await departmentApi.getById(departmentId)
      setDepartment(data)
      setFormData({
        name: data.name,
        description: data.description || "",
      })
      setError(null)
    } catch (err) {
      setError("Failed to fetch department details")
      console.error("Error fetching department:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      setError("Department name is required")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const departmentData = {
        name: formData.name,
        description: formData.description || undefined,
      }

      if (isEditing && id) {
        const updateData: UpdateDepartmentRequest = {
          id: id,
          ...departmentData,
        }
        console.log("id",id)
        await departmentApi.update(id, updateData)
      } else {
        const createData: CreateDepartmentRequest = departmentData
        await departmentApi.create(createData)
      }

      navigate("/departments")
    } catch (err) {
      setError(`Failed to ${isEditing ? "update" : "create"} department`)
      console.error(`Error ${isEditing ? "updating" : "creating"} department:`, err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/departments">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{isEditing ? "Edit Department" : "Add New Department"}</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Department Details" : "Department Information"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                placeholder="Enter department name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter department description (optional)"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link to="/departments">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : isEditing ? "Update Department" : "Create Department"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
