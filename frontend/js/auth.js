/* ============================
   PharmaSync - Auth (Login / Signup)
   Now connected to the real backend (Node + Express + TiDB).
   Backend handles password hashing (bcrypt) and JWT tokens.
   ============================ */

let selectedRole = "retailer";

function selectRole(role, btn) {
  selectedRole = role;
  document.querySelectorAll(".role-select button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

async function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const storeName = document.getElementById("signup-store").value.trim();

  if (!name || !email || !password) {
    showToast("Please fill all required fields", "error");
    return;
  }

  try {
    await api.post("/auth/signup", {
      name,
      email,
      password,
      role: selectedRole,
      storeName
    });

    showToast("Account created! Please log in.");
    setTimeout(() => (window.location.href = "login.html"), 1200);
  } catch (err) {
    showToast(err.message || "Signup failed", "error");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const data = await api.post("/auth/login", { email, password });

    setCurrentUser({ ...data.user, token: data.token });
    showToast("Welcome back, " + data.user.name);

    setTimeout(() => {
      if (data.user.role === "retailer") window.location.href = "retailer-dashboard.html";
      else if (data.user.role === "distributor") window.location.href = "distributor-dashboard.html";
      else window.location.href = "admin-dashboard.html";
    }, 800);
  } catch (err) {
    showToast(err.message || "Invalid email or password", "error");
  }
}