import { Link } from "react-router-dom";
import { Users, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Button } from "../../ui/Button";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Employee Dashboard</h1>
        <p className="text-xl text-gray-600">Manage your company's departments and employees</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Employees
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Manage your company's employees. View, add, edit, or remove employee records.
            </p>
            <div className="flex justify-end">
              <Link to="/employees">
                <Button>
                  View Employees
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center">
              <Briefcase className="w-6 h-6 mr-2" />
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Manage your company's departments. Create new departments or modify existing ones.
            </p>
            <div className="flex justify-end">
              <Link to="/departments">
                <Button>
                  View Departments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}