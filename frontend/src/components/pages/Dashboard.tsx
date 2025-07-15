import React from "react";
import { useAuth } from "../../context/AuthContext";
import { PermissionGate } from "../auth/PermissionGate";

export const Dashboard: React.FC = () => {
  const { user, permissions, error } = useAuth();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          User Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Username:</p>
            <p className="font-medium text-gray-800">{user?.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Roles:</p>
            <p className="font-medium text-gray-800">
              {permissions?.roles?.join(", ") ||
                user?.roles?.join(", ") ||
                "None"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PermissionGate object="users" action="read">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <h3 className="font-semibold text-blue-800">Users Management</h3>
            </div>

            <p className="text-blue-700 text-sm">You can view users</p>
            <PermissionGate
              object="users"
              action="write"
              fallback={null}
              showLoading={false}
            >
              <p className="text-blue-600 text-xs mt-2 font-medium">
                ✓ Can also modify users
              </p>
            </PermissionGate>
          </div>
        </PermissionGate>

        <PermissionGate object="settings" action="read">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <h3 className="font-semibold text-green-800">Settings</h3>
            </div>
            <p className="text-green-700 text-sm">You can view settings</p>

            <PermissionGate
              object="settings"
              action="write"
              fallback={null}
              showLoading={false}
            >
              <p className="text-green-600 text-xs mt-2 font-medium">
                ✓ Can also modify settings
              </p>
            </PermissionGate>
          </div>
        </PermissionGate>

        <PermissionGate object="profile" action="read">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <h3 className="font-semibold text-purple-800">Profile</h3>
            </div>
            <p className="text-purple-700 text-sm">You can view your profile</p>

            <PermissionGate
              object="profile"
              action="write"
              fallback={null}
              showLoading={false}
            >
              <p className="text-purple-600 text-xs mt-2 font-medium">
                ✓ Can also edit profile
              </p>
            </PermissionGate>
          </div>
        </PermissionGate>
      </div>

      {permissions && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Your Permissions
          </h3>

          {/* Handle casbin.js manual mode format */}
          {typeof permissions === "object" &&
            !Array.isArray(permissions) &&
            !permissions.permissions && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Actions You Can Perform:
                </h4>
                {Object.entries(permissions).map(([action, objects]) => (
                  <div key={action} className="mb-3">
                    <h5 className="font-medium text-gray-700 capitalize mb-1">
                      {action}:
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      {Array.isArray(objects) ? (
                        objects.map((object, index) => (
                          <li
                            key={index}
                            className="bg-white px-2 py-1 rounded"
                          >
                            {action} → {object}
                          </li>
                        ))
                      ) : (
                        <li className="bg-white px-2 py-1 rounded">
                          {action} → {String(objects)}
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            )}

          {/* Handle detailed permissions format */}
          {permissions.permissions !== undefined &&
            permissions.implicitPermissions !== undefined && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Direct Permissions:
                  </h4>
                  {permissions.permissions &&
                  permissions.permissions.length > 0 ? (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {permissions.permissions.map((perm, index) => (
                        <li key={index} className="bg-white px-2 py-1 rounded">
                          {Array.isArray(perm)
                            ? perm.join(" → ")
                            : String(perm)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No direct permissions
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Role-based Permissions:
                  </h4>
                  {permissions.implicitPermissions &&
                  permissions.implicitPermissions.length > 0 ? (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {permissions.implicitPermissions.map((perm, index) => (
                        <li key={index} className="bg-white px-2 py-1 rounded">
                          {Array.isArray(perm)
                            ? perm.join(" → ")
                            : String(perm)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No role-based permissions
                    </p>
                  )}
                </div>
              </div>
            )}

          {/* Fallback for unknown permission formats */}
          {typeof permissions === "object" &&
            !Array.isArray(permissions) &&
            permissions.permissions === undefined &&
            permissions.implicitPermissions === undefined &&
            Object.keys(permissions).length === 0 && (
              <p className="text-sm text-gray-500">No permissions available</p>
            )}
        </div>
      )}
    </div>
  );
};
