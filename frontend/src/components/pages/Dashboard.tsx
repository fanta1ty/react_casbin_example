import React from "react";
import { useAuth } from "../../context/AuthContext";
import { PermissionGate } from "../auth/PermissionGate";
import { Users, Shield, Settings } from "lucide-react";

export const Dashboard: React.FC = () => {
  const { user, permissions, error } = useAuth();

  const stats = [
    {
      title: "Total Users",
      value: "12",
      icon: Users,
      color: "blue",
      permission: { action: "read", object: "users" },
    },
    {
      title: "Active Roles",
      value: "5",
      icon: Shield,
      color: "green",
      permission: { action: "read", object: "roles" },
    },
    {
      title: "System Settings",
      value: "Active",
      icon: Settings,
      color: "purple",
      permission: { action: "read", object: "settings" },
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* User Info */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Welcome, {user?.username}!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Username:</p>
            <p className="font-medium text-gray-800">{user?.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Roles:</p>
            <p className="font-medium text-gray-800">
              {user?.roles?.join(", ") || "None"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, index) => (
          <PermissionGate
            key={index}
            action={stat.permission.action}
            object={stat.permission.object}
            fallback={
              <div className="bg-gray-100 rounded-lg p-6 opacity-50">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gray-200">
                    <stat.icon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-lg font-bold text-gray-400">No Access</p>
                  </div>
                </div>
              </div>
            }
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </PermissionGate>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PermissionGate action="read" object="users">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <Users className="w-8 h-8 text-blue-500 mb-2" />
              <h4 className="font-medium text-gray-900">Manage Users</h4>
              <p className="text-sm text-gray-600">
                View and manage user accounts
              </p>
            </button>
          </PermissionGate>

          <PermissionGate action="read" object="roles">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <Shield className="w-8 h-8 text-green-500 mb-2" />
              <h4 className="font-medium text-gray-900">Role Management</h4>
              <p className="text-sm text-gray-600">Create and manage roles</p>
            </button>
          </PermissionGate>

          <PermissionGate action="read" object="settings">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <Settings className="w-8 h-8 text-purple-500 mb-2" />
              <h4 className="font-medium text-gray-900">System Settings</h4>
              <p className="text-sm text-gray-600">Configure system settings</p>
            </button>
          </PermissionGate>
        </div>
      </div>

      {/* Permissions Debug Info */}
      {permissions && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">
            Your Current Permissions:
          </h4>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(permissions, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
