/**
 * Modul Layanan Autentikasi SIAKAD (Unified Login)
 */
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
  // Proses verifikasi login dengan pesan error generik
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

  // Mengakhiri sesi dan kembali ke login
  logout() {
    Storage.remove("siakad_session");
    window.location.href = "index.html";
  },

  // Mendapatkan data sesi user yang sedang aktif
  getCurrentUser() {
    return Storage.get("siakad_session");
  },

  // Memeriksa apakah user sudah login
  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  // Pengalihan halaman otomatis berdasarkan role
  redirectBasedOnRole(role) {
    if (role === "Admin") {
      window.location.href = "dashboard.html";
    } else {
      // Sementara untuk Mahasiswa & Dosen diarahkan ke dashboard yang sama atau halaman indikator
      // (Nanti bisa kita buatkan dashboard khusus mahasiswa/dosen di tahap berikutnya)
      window.location.href = "dashboard.html";
    }
  },

  // Proteksi rute otomatis
  protectRoute() {
    const currentPage = window.location.pathname.split("/").pop();
    const isAuth = this.isAuthenticated();

    if (currentPage === "dashboard.html" && !isAuth) {
      window.location.href = "index.html";
    }
  },
};
