document.addEventListener("DOMContentLoaded", () => {
  // Inisialisasi ikon Lucide
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  if (typeof AuthService !== "undefined" && AuthService.isAuthenticated()) {
    const user = AuthService.getCurrentUser();
    AuthService.redirectBasedOnRole(user.role);
    return;
  }

  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const generalError = document.getElementById("generalError");

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", () => {
      const isPassword = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isPassword ? "text" : "password");
      togglePasswordBtn.innerHTML = isPassword
        ? '<i data-lucide="eye-off" width="18" height="18"></i>'
        : '<i data-lucide="eye" width="18" height="18"></i>';
      lucide.createIcons();
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const usernameVal = usernameInput.value.trim();
      const passwordVal = passwordInput.value.trim();

      if (!usernameVal || !passwordVal) {
        if (generalError) {
          generalError.textContent = "Username dan kata sandi wajib diisi.";
          generalError.style.display = "block";
        }
        return;
      }

      if (generalError) {
        generalError.style.display = "none";
        generalError.textContent = "";
      }

      const result = AuthService.login(usernameVal, passwordVal);

      if (result.success) {
        AuthService.redirectBasedOnRole(result.role);
      } else {

        if (generalError) {
          generalError.textContent = result.message;
          generalError.style.display = "block";
        }
      }
    });
  }
});
