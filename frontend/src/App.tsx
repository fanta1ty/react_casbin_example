import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Dashboard } from "./components/pages/Dashboard";
import { Header } from "./components/common/Header";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { User } from "./types";

const LoginScreen: React.FC = () => {
  const { setUser, loading } = useAuth();

  const testUsers: User[] = [
    { id: "1", username: "alice", roles: ["admin"] },
    { id: "2", username: "bob", roles: ["manager"] },
    { id: "3", username: "charlie", roles: ["user"] },
  ];

  const handleLogin = async (user: User) => {
    await setUser(user);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Setting up user..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Role Management Demo
        </h2>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Choose a user to test different permission levels
        </p>
        <div className="space-y-3">
          {testUsers.map((user) => (
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

const AppContent: React.FC = () => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Dashboard />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider mode="manual">
      <AppContent />
    </AuthProvider>
  );
}

export default App;
