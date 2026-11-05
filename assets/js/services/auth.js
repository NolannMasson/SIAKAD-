const USERS = [
  {
    username: "admin",
    password: "admin123",
    role: "Admin",
    name: "Administrator Sistem",
  },
  {
    username: "mahasiswa",
    password: "mhs123",
    role: "Mahasiswa",
    name: "Mahasiswa Demo",
  },
  {
    username: "dosen",
    password: "dosen123",
    role: "Dosen",
    name: "Dosen Pengajar",
  },
];

const AuthService = {
  login(username, password) {
    const user = USERS.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      const sessionData = {
        username: user.username,
        name: user.name,
        role: user.role,
        loginAt: new Date().toISOString(),
      };

      Storage.set("siakad_session", sessionData);
      return { success: true, role: user.role };
    }

    return { success: false, message: "Username atau kata sandi salah." };
  },

  logout() {
    Storage.remove("siakad_session");
    window.location.href = "index.html";
  },

  
  getCurrentUser() {
    return Storage.get("siakad_session");
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  redirectBasedOnRole(role) {
    if (role === "Admin") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "dashboard.html";
    }
  },


  protectRoute() {
    const currentPage = window.location.pathname.split("/").pop();
    const isAuth = this.isAuthenticated();

    if (currentPage === "dashboard.html" && !isAuth) {
      window.location.href = "index.html";
    }
  },
};
