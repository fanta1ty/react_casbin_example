const express = require("express");
const cors = require("cors");
const { newEnforcer } = require("casbin");
const path = require("path");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

let enforcer;

// Initialize Casbin enforcer
const initCasbin = async () => {
  try {
    enforcer = await newEnforcer(
      path.join(__dirname, "models/rbac_model.conf"),
      path.join(__dirname, "policies/rbac_policy.csv")
    );
    console.log("Casbin enforcer initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Casbin:", error);
    process.exit(1);
  }
};
// Endpoint specifically for casbin.js
app.get("/api/casbin/:user", async (req, res) => {
  try {
    const { user } = req.params;
    const implicitPermissions = await enforcer.getImplicitPermissionsForUser(
      user
    );
    const permissions = {};
    implicitPermissions.forEach(([subject, object, action]) => {
      if (!permissions[action]) {
        permissions[action] = [];
      }
      permissions[action].push(object);
    });
    res.json(permissions);
  } catch (error) {
    console.error("Error getting permissions for casbin.js", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

app.get("/api/casbin/:user/detailed", async (req, res) => {
  try {
    const { user } = req.params;

    const roles = await enforcer.getRolesForUser(user);
    const permissions = await enforcer.getPermissionsForUser(user);
    const implicitPermissions = await enforcer.getImplicitPermissionsForUser(
      user
    );

    // Convert to casbin.js format
    const casbinJsPermissions = {};
    implicitPermissions.forEach(([subject, object, action]) => {
      if (!casbinJsPermissions[action]) {
        casbinJsPermissions[action] = [];
      }
      if (!casbinJsPermissions[action].includes(object)) {
        casbinJsPermissions[action].push(object);
      }
    });

    res.json({
      permissions: casbinJsPermissions,
      roles,
      rawPermissions: permissions,
      implicitPermissions,
    });
  } catch (error) {
    console.error("Error getting detailed permissions:", error);
    res.status(500).json({ error: error.message });
  }
});

// more detailed response
app.get("/api/casbin/:user/detailed", async (req, res) => {
  try {
    const { user } = req.params;

    const roles = await enforcer.getRolesForUser(user);
    const permissions = await enforcer.getPermissionsForUser(user);
    const implicitPermissions = await enforcer.getImplicitPermissionsForUser(
      user
    );

    // Convert to casbin.js format
    const casbinJsPermissions = {};
    implicitPermissions.forEach(([subject, object, action]) => {
      if (!casbinJsPermissions[action]) {
        casbinJsPermissions[action] = [];
      }
      if (!casbinJsPermissions[action].includes(object)) {
        casbinJsPermissions[action].push(object);
      }
    });

    res.json({
      permissions: casbinJsPermissions,
      roles,
      rawPermissions: permissions,
      implicitPermissions,
    });
  } catch (error) {
    console.error("Error getting detailed permissions:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user permissions
app.get("/api/casbin/permissions/:user", async (req, res) => {
  try {
    const { user } = req.params;

    // Get user roles
    const roles = await enforcer.getRolesForUser(user);

    // Get all permissions for user
    const permissions = await enforcer.getPermissionsForUser(user);

    // Get implicit permissions (through roles)
    const implicitPermissions = await enforcer.getImplicitPermissionsForUser(
      user
    );

    res.json({
      user,
      roles,
      permissions,
      implicitPermissions,
    });
  } catch (error) {
    console.error("Error getting permissions:", error);
    res.status(500).json({ error: error.message });
  }
});

// Check permission enforcement
app.post("/api/casbin/enforce", async (req, res) => {
  try {
    const { user, object, action } = req.body;

    if (!user || !object || !action) {
      return res
        .status(400)
        .json({ error: "Missing required fields: user, object, action" });
    }

    const result = await enforcer.enforce(user, object, action);

    res.json({
      allowed: result,
      request: { user, object, action },
    });
  } catch (error) {
    console.error("Error enforcing permission:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all policies
app.get("/api/casbin/policies", async (req, res) => {
  try {
    const policies = await enforcer.getPolicy();
    const groupingPolicies = await enforcer.getGroupingPolicy();

    res.json({
      policies,
      groupingPolicies,
    });
  } catch (error) {
    console.error("Error getting policies:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add new policy
app.post("/api/casbin/add-policy", async (req, res) => {
  try {
    const { subject, object, action } = req.body;

    if (!subject || !object || !action) {
      return res
        .status(400)
        .json({ error: "Missing required fields: subject, object, action" });
    }

    const result = await enforcer.addPolicy(subject, object, action);

    res.json({
      success: result,
      policy: [subject, object, action],
    });
  } catch (error) {
    console.error("Error adding policy:", error);
    res.status(500).json({ error: error.message });
  }
});

// Remove policy
app.delete("/api/casbin/remove-policy", async (req, res) => {
  try {
    const { subject, object, action } = req.body;

    if (!subject || !object || !action) {
      return res
        .status(400)
        .json({ error: "Missing required fields: subject, object, action" });
    }

    const result = await enforcer.removePolicy(subject, object, action);

    res.json({
      success: result,
      policy: [subject, object, action],
    });
  } catch (error) {
    console.error("Error removing policy:", error);
    res.status(500).json({ error: error.message });
  }
});

// Initialize Casbin and start server
initCasbin()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
