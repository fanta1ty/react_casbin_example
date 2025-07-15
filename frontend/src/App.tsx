import React from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { User } from "./types/casbin";
import { Dashboard } from "./components/pages/Dashboard";

const LoginScreen: React.FC = () => {
  const { setUser } = useAuth();

  const users: User[] = [
    { id: "1", username: "alice", roles: ["admin"] },
    { id: "2", username: "bob", roles: ["manager"] },
    { id: "3", username: "charlie", roles: ["user"] },
  ];

  const handleLogin = (user: User) => {
    setUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Select User to Login
        </h2>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Choose a user to test different permission levels
        </p>
        <div className="space-y-3">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleLogin(user)}
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-left"
            >
              <div className="font-medium">{user.username}</div>
              <div className="text-blue-100 text-sm">
                Role: {user.roles.join(", ")}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { user, setUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Casbin Authorization Demo
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Welcome, <span className="font-medium">{user.username}</span>
              </span>
              <button
                onClick={() => {
                  setUser(null);
                }}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Dashboard />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider mode="manual" apiEndpoint="http://localhost:5001/api/casbin">
      <MainApp />
    </AuthProvider>
  );
}

export default App;
