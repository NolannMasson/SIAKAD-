document.addEventListener("DOMContentLoaded", () => {
  if (typeof AuthService === "undefined" || !AuthService.isAuthenticated()) {
    window.location.href = "index.html";
    return;
  }

  const currentUser = AuthService.getCurrentUser();

  if (currentUser) {
    const userNameEl = document.getElementById("userName");
    const userRoleEl = document.getElementById("userRole");
    const userAvatar = document.getElementById("userAvatar");

    if (userNameEl) userNameEl.textContent = currentUser.name;
    if (userRoleEl) userRoleEl.textContent = currentUser.role;
    if (userAvatar && currentUser.name)
      userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
  }

  // Definisi Menu Berdasarkan Role
  const roleMenus = {
    Admin: [
      { label: "Dashboard", icon: "layout-dashboard", page: "Dashboard" },
      {
        label: "Manajemen Data",
        icon: "database",
        children: [
          { label: "Data Mahasiswa", page: "Data Mahasiswa" },
          { label: "Data Dosen", page: "Data Dosen" },
          { label: "Data Fakultas", page: "Data Fakultas" },
          { label: "Data Program Studi", page: "Data Program Studi" },
        ],
      },
      {
        label: "KBM",
        icon: "book-open",
        children: [
          { label: "Kelas Kuliah", page: "Kelas Kuliah" },
          { label: "Arsip Kelas Kuliah", page: "Arsip Kelas Kuliah" },
          { label: "Jadwal Perkuliahan", page: "Jadwal Perkuliahan" },
        ],
      },
      { label: "Pengaturan", icon: "settings", page: "Pengaturan" },
      { label: "Logout", icon: "log-out", action: "logout" },
    ],
    Mahasiswa: [
      { label: "Dashboard", icon: "layout-dashboard", page: "Dashboard" },
      { label: "Biodata", icon: "user", page: "Biodata" },
      {
        label: "Akademik",
        icon: "graduation-cap",
        children: [
          { label: "KRS", page: "KRS" },
          { label: "KHS", page: "KHS" },
        ],
      },
      {
        label: "KBM",
        icon: "book-open",
        children: [{ label: "Jadwal Kuliah", page: "Jadwal Kuliah" }],
      },
      { label: "Pengaturan Akun", icon: "settings", page: "Pengaturan Akun" },
      { label: "Logout", icon: "log-out", action: "logout" },
    ],
    Dosen: [
      { label: "Dashboard", icon: "layout-dashboard", page: "Dashboard" },
      { label: "Biodata", icon: "user", page: "Biodata" },
      {
        label: "KBM",
        icon: "book-open",
        children: [{ label: "Kelas yang Diampu", page: "Kelas yang Diampu" }],
      },
      { label: "Pengaturan Akun", icon: "settings", page: "Pengaturan Akun" },
      { label: "Logout", icon: "log-out", action: "logout" },
    ],
  };

  const userRole = currentUser.role;
  const menuConfig = roleMenus[userRole] || roleMenus["Mahasiswa"];
  const sidebarMenuEl = document.getElementById("sidebarMenu");

  function renderSidebar() {
    sidebarMenuEl.innerHTML = "";
    menuConfig.forEach((menu) => {
      const li = document.createElement("li");
      li.className = "menu-item";

      if (menu.children) {
        li.classList.add("has-dropdown");
        li.innerHTML = `
          <button class="menu-dropdown-toggle">
            <span class="menu-item-content">
              <i data-lucide="${menu.icon}" width="20" height="20"></i>
              <span class="menu-text">${menu.label}</span>
            </span>
            <i data-lucide="chevron-down" width="16" height="16" class="dropdown-arrow"></i>
          </button>
          <ul class="submenu">
            ${menu.children.map((child) => `<li><a href="#" data-page="${child.page}">${child.label}</a></li>`).join("")}
          </ul>
        `;
      } else {
        li.innerHTML = `
          <a href="#" ${menu.action === "logout" ? 'id="menuLogout"' : `data-page="${menu.page}"`}>
            <span class="menu-item-content">
              <i data-lucide="${menu.icon}" width="20" height="20"></i>
              <span class="menu-text">${menu.label}</span>
            </span>
          </a>
        `;
        if (menu.page === "Dashboard") li.classList.add("active");
      }
      sidebarMenuEl.appendChild(li);
    });
    if (typeof lucide !== "undefined") lucide.createIcons();
  }
  renderSidebar();

  const mainContentContainer = document.getElementById("mainContentContainer");
  const pageTitleEl = document.getElementById("pageTitle");
  const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");

  function renderBiodataPage(isEditMode = false) {
    const biodata = DataService.getBiodata(userRole);

    if (userRole === "Mahasiswa") {
      mainContentContainer.innerHTML = `
        <div class="biodata-card">
          <div class="biodata-grid">
            <div class="biodata-item">
              <span class="biodata-label">NIM</span>
              <input type="text" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioNim" value="${biodata.nim}" ${!isEditMode ? "readonly" : ""}>
            </div>
            <div class="biodata-item">
              <span class="biodata-label">Nama Lengkap</span>
              <input type="text" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioNama" value="${biodata.nama}" ${!isEditMode ? "readonly" : ""}>
            </div>
            <div class="biodata-item">
              <span class="biodata-label">Tempat & Tanggal Lahir</span>
              <input type="text" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioTtl" value="${biodata.ttl}" ${!isEditMode ? "readonly" : ""}>
            </div>
            <div class="biodata-item">
              <span class="biodata-label">Jenis Kelamin</span>
              <input type="text" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioGender" value="${biodata.gender}" ${!isEditMode ? "readonly" : ""}>
            </div>
            <div class="biodata-item">
              <span class="biodata-label">Alamat</span>
              <input type="text" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioAlamat" value="${biodata.alamat}" ${!isEditMode ? "readonly" : ""}>
            </div>
            <div class="biodata-item">
              <span class="biodata-label">Email</span>
              <input type="email" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioEmail" value="${biodata.email}" ${!isEditMode ? "readonly" : ""}>
            </div>
            <div class="biodata-item">
              <span class="biodata-label">Nomor Telepon</span>
              <input type="text" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioTelepon" value="${biodata.telepon}" ${!isEditMode ? "readonly" : ""}>
            </div>
            <div class="biodata-item">
              <span class="biodata-label">Program Studi</span>
              <input type="text" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioProdi" value="${biodata.prodi}" ${!isEditMode ? "readonly" : ""}>
            </div>
            <div class="biodata-item">
              <span class="biodata-label">Semester</span>
              <input type="text" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioSemester" value="${biodata.semester}" ${!isEditMode ? "readonly" : ""}>
            </div>
          </div>

          <div class="biodata-actions">
            ${
              !isEditMode
                ? `
              <button class="btn-primary" id="btnEditBiodata"><i data-lucide="edit-3" width="16" height="16"></i> Edit Biodata</button>
            `
                : `
              <button class="btn-secondary" id="btnCancelBiodata">Batal</button>
              <button class="btn-primary" id="btnSaveBiodata">Simpan Perubahan</button>
            `
            }
          </div>
        </div>
      `;
    } else if (userRole === "Dosen") {
      mainContentContainer.innerHTML = `
        <div class="biodata-card">
          <div class="biodata-grid">
            <div class="biodata-item">
              <span class="biodata-label">NIP</span>
              <input type="text" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioNip" value="${biodata.nip}" ${!isEditMode ? "readonly" : ""}>
            </div>
            <div class="biodata-item">
              <span class="biodata-label">Nama Lengkap & Gelar</span>
              <input type="text" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioNama" value="${biodata.nama}" ${!isEditMode ? "readonly" : ""}>
            </div>
            <div class="biodata-item">
              <span class="biodata-label">Email</span>
              <input type="email" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioEmail" value="${biodata.email}" ${!isEditMode ? "readonly" : ""}>
            </div>
            <div class="biodata-item">
              <span class="biodata-label">Nomor Telepon</span>
              <input type="text" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioTelepon" value="${biodata.telepon}" ${!isEditMode ? "readonly" : ""}>
            </div>
            <div class="biodata-item">
              <span class="biodata-label">Alamat</span>
              <input type="text" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioAlamat" value="${biodata.alamat}" ${!isEditMode ? "readonly" : ""}>
            </div>
            <div class="biodata-item">
              <span class="biodata-label">Fakultas</span>
              <input type="text" class="biodata-value ${isEditMode ? "editable-input" : ""}" id="bioFakultas" value="${biodata.fakultas}" ${!isEditMode ? "readonly" : ""}>
            </div>
          </div>

          <div class="biodata-actions">
            ${
              !isEditMode
                ? `
              <button class="btn-primary" id="btnEditBiodata"><i data-lucide="edit-3" width="16" height="16"></i> Edit Biodata</button>
            `
                : `
              <button class="btn-secondary" id="btnCancelBiodata">Batal</button>
              <button class="btn-primary" id="btnSaveBiodata">Simpan Perubahan</button>
            `
            }
          </div>
        </div>
      `;
    }

    if (typeof lucide !== "undefined") lucide.createIcons();

    // Event Handler Edit Mode
    if (!isEditMode) {
      const btnEdit = document.getElementById("btnEditBiodata");
      if (btnEdit) {
        btnEdit.addEventListener("click", () => renderBiodataPage(true));
      }
    } else {
      document
        .getElementById("btnCancelBiodata")
        .addEventListener("click", () => renderBiodataPage(false));
      document
        .getElementById("btnSaveBiodata")
        .addEventListener("click", () => {
          let updatedData = {};
          if (userRole === "Mahasiswa") {
            updatedData = {
              nim: document.getElementById("bioNim").value,
              nama: document.getElementById("bioNama").value,
              ttl: document.getElementById("bioTtl").value,
              gender: document.getElementById("bioGender").value,
              alamat: document.getElementById("bioAlamat").value,
              email: document.getElementById("bioEmail").value,
              telepon: document.getElementById("bioTelepon").value,
              prodi: document.getElementById("bioProdi").value,
              semester: document.getElementById("bioSemester").value,
            };
          } else {
            updatedData = {
              nip: document.getElementById("bioNip").value,
              nama: document.getElementById("bioNama").value,
              email: document.getElementById("bioEmail").value,
              telepon: document.getElementById("bioTelepon").value,
              alamat: document.getElementById("bioAlamat").value,
              fakultas: document.getElementById("bioFakultas").value,
            };
          }

          DataService.saveBiodata(userRole, updatedData);
          alert("Biodata berhasil diperbarui!");
          renderBiodataPage(false);
        });
    }
  }

  function renderDashboard() {
    if (userRole === "Admin") {
      mainContentContainer.innerHTML = `
        <div class="biodata-card">
          <h2 style="font-size:1.1rem; color:var(--primary-navy); margin-bottom:1rem;">Statistik Sistem Akademik</h2>
          <p style="color:var(--text-muted);">Gunakan menu di sebelah kiri untuk mengelola data Mahasiswa, Dosen, Fakultas, dan Program Studi.</p>
        </div>
      `;
    } else if (userRole === "Mahasiswa") {
      mainContentContainer.innerHTML = `
        <div class="biodata-card">
          <h2 style="font-size:1.2rem; color:var(--primary-navy); margin-bottom:0.5rem;">Selamat Datang, ${currentUser.name}</h2>
          <p style="color:var(--text-muted); font-size:0.9rem;">Silakan pilih menu <strong>Biodata</strong> untuk melihat atau memperbarui informasi profil akademik Anda.</p>
        </div>
      `;
    } else {
      mainContentContainer.innerHTML = `
        <div class="biodata-card">
          <h2 style="font-size:1.2rem; color:var(--primary-navy); margin-bottom:0.5rem;">Selamat Datang, ${currentUser.name}</h2>
          <p style="color:var(--text-muted); font-size:0.9rem;">Kelola profil dan jadwal pengajaran melalui menu di sidebar.</p>
        </div>
      `;
    }
    if (typeof lucide !== "undefined") lucide.createIcons();
  }

  renderDashboard();

  // Routing Sidebar
  sidebarMenuEl.addEventListener("click", (e) => {
    const dropdownToggle = e.target.closest(".menu-dropdown-toggle");
    if (dropdownToggle) {
      e.preventDefault();
      dropdownToggle.closest(".menu-item").classList.toggle("open");
      return;
    }

    const menuLink = e.target.closest("a[data-page]");
    if (menuLink) {
      e.preventDefault();
      const pageName = menuLink.getAttribute("data-page");

      if (pageTitleEl) pageTitleEl.textContent = pageName;
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = pageName;

      document
        .querySelectorAll(".sidebar-menu a, .sidebar-menu .menu-item")
        .forEach((el) => el.classList.remove("active"));
      menuLink.classList.add("active");

      if (pageName === "Dashboard") {
        renderDashboard();
      } else if (pageName === "Biodata") {
        renderBiodataPage(false);
      } else {
        mainContentContainer.innerHTML = `
          <div class="placeholder-card">
            <p style="color:var(--text-muted);">Halaman <strong>${pageName}</strong> sedang dipersiapkan.</p>
          </div>
        `;
      }
    }
  });

  const sidebar = document.getElementById("sidebar");
  const toggleSidebarBtn = document.getElementById("toggleSidebar");
  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle(
        window.innerWidth <= 768 ? "show-mobile" : "collapsed",
      );
    });
  }

  const handleLogout = () => AuthService.logout();
  const menuLogout = document.getElementById("menuLogout");
  const btnLogoutTop = document.getElementById("btnLogout");
  if (menuLogout) menuLogout.addEventListener("click", handleLogout);
  if (btnLogoutTop) btnLogoutTop.addEventListener("click", handleLogout);
});
