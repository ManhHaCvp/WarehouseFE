import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      createdAt: "2025-01-01T10:30:00Z",
      role: "Admin",
      status: true,
      loginType: "Google",
      phone: "0901234567",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      createdAt: "2025-01-02T15:45:00Z",
      role: "User",
      status: false,
      loginType: "Facebook",
      phone: "0912345678",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@example.com",
      createdAt: "2025-01-03T08:20:00Z",
      role: "Moderator",
      status: true,
      loginType: "Email",
      phone: "0934567890",
    },
  ]);

  const [roles, setRoles] = useState(["Admin", "User", "Moderator"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10); // Default to 10 users per page

  const navigate = useNavigate();

  const onDetail = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  const onEdit = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, status: !user.status } : user
    );
    setUsers(updatedUsers);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.includes(searchTerm)) &&
      (selectedRole ? user.role === selectedRole : true) &&
      (selectedType ? user.loginType === selectedType : true)
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by email"
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-lg w-full sm:w-1/2 lg:w-1/3"
        />
        <div className="flex space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none bg-white hover:bg-gray-50 text-gray-800 py-1 px-2 border border-gray-200 rounded shadow">
              {selectedRole || "Role"} <ChevronDown size={18} className="inline-block ml-2" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roles.map((role) => (
                <DropdownMenuItem key={role} onClick={() => handleRoleSelect(role)}>
                  {role}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Create At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {user.createdAt ? format(parseISO(user.createdAt), "HH:mm:ss dd-MM-yyyy") : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{user.role}</Badge>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDetail(user.id)}
                    className="bg-white hover:bg-gray-50 text-indigo-600 py-1 px-2 border border-gray-200 rounded shadow"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onEdit(user.id)}
                    className={`ml-4 bg-white hover:bg-gray-50 py-1 px-2 border border-gray-200 rounded shadow ${
                      user.status ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {user.status ? "Active" : "Inactive"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
