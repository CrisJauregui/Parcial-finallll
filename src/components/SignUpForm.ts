import { createUser } from "../services/firebase/auth-service";

class SignUpForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  setupListeners() {
    const form = this.shadowRoot?.querySelector("form");
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const usernameInput = this.shadowRoot?.querySelector(
        "#username"
      ) as HTMLInputElement;
      const emailInput = this.shadowRoot?.querySelector(
        "#email"
      ) as HTMLInputElement;
      const passwordInput = this.shadowRoot?.querySelector(
        "#password"
      ) as HTMLInputElement;
      const confirmPasswordInput = this.shadowRoot?.querySelector(
        "#confirm-password"
      ) as HTMLInputElement;
      const errorMsg = this.shadowRoot?.querySelector(".error-message");

      if (
        usernameInput &&
        emailInput &&
        passwordInput &&
        confirmPasswordInput &&
        errorMsg
      ) {
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validaciones básicas
        if (!username || !email || !password || !confirmPassword) {
          errorMsg.textContent = "Por favor, completa todos los campos";
          return;
        }

        if (password !== confirmPassword) {
          errorMsg.textContent = "Las contraseñas no coinciden";
          return;
        }

        if (password.length < 6) {
          errorMsg.textContent =
            "La contraseña debe tener al menos 6 caracteres";
          return;
        }

        // Mostrar estado de carga
        const submitBtn = this.shadowRoot?.querySelector(
          "button[type='submit']"
        ) as HTMLButtonElement;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Creando cuenta...";
        }

        // Intentar crear el usuario
        const result = await createUser(email, password, username);

        if (result.success) {
          // Redirigir al panel de actividades
          window.history.pushState({}, "", "/activities");
          const event = new CustomEvent("route-change", {
            bubbles: true,
            composed: true,
            detail: { path: "/activities" },
          });
          this.dispatchEvent(event);
        } else {
          // Mostrar error
          errorMsg.textContent =
            "Error al crear la cuenta. El correo podría estar en uso.";

          // Restaurar botón
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Crear cuenta";
          }
        }
      }
    });

    // Enlace para ir a login
    const signinLink = this.shadowRoot?.querySelector(".signin-link");
    signinLink?.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState({}, "", "/signin");
      const event = new CustomEvent("route-change", {
        bubbles: true,
        composed: true,
        detail: { path: "/signin" },
      });
      this.dispatchEvent(event);
    });
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        :host {
          display: block;
          font-family: 'Poppins', sans-serif;
          --primary-blue: #6366f1;
          --primary-purple: #8b5cf6;
          --primary-pink: #ec4899;
          --text-dark: #1e293b;
          --text-light: #64748b;
          --border-light: #e2e8f0;
          --bg-white: #ffffff;
          --shadow-soft: 0 4px 20px rgba(139, 92, 246, 0.15);
          --border-radius: 12px;
          --error-color: #ef4444;
        }
        
        .signup-container {
          max-width: 420px;
          margin: 0 auto;
          padding: 40px 35px;
          background: var(--bg-white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-soft);
          border: 1px solid rgba(236, 72, 153, 0.1);
        }
        
        .header {
          text-align: center;
          margin-bottom: 35px;
        }
        
        .header h2 {
          color: var(--text-dark);
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
        }
        
        .header p {
          color: var(--text-light);
          margin: 0;
          font-size: 16px;
        }
        
        .form-group {
          margin-bottom: 24px;
        }
        
        label {
          display: block;
          margin-bottom: 10px;
          font-weight: 500;
          font-size: 15px;
          color: var(--text-dark);
        }
        
        input {
          width: 100%;
          padding: 16px 18px;
          border: 2px solid var(--border-light);
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          transition: all 0.3s ease;
          box-sizing: border-box;
          background: #fafbfc;
        }
        
        input:focus {
          outline: none;
          border-color: var(--primary-pink);
          background: var(--bg-white);
          box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
        }
        
        .signup-btn {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
        }
        
        .signup-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4);
        }
        
        .signup-btn:active {
          transform: translateY(0);
        }
        
        .signup-btn:disabled {
          background: linear-gradient(135deg, #9ca3af, #d1d5db);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .error-message {
          color: var(--error-color);
          font-size: 14px;
          margin-top: 18px;
          text-align: center;
          font-weight: 500;
        }
        
        .form-footer {
          margin-top: 28px;
          text-align: center;
          font-size: 15px;
          color: var(--text-light);
        }
        
        .signin-link {
          color: var(--primary-blue);
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        
        .signin-link:hover {
          color: var(--primary-purple);
          text-decoration: underline;
        }
      </style>
      
      <div class="signup-container">
        <div class="header">
          <h2>¡Hola Cris!</h2>
          <p>Crea tu cuenta para comenzar</p>
        </div>
        
        <form>
          <div class="form-group">
            <label for="username">Nombre de usuario</label>
            <input type="text" id="username" required placeholder="Cris (o como prefieras)">
          </div>
          
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input type="email" id="email" required placeholder="cris@email.com">
          </div>
          
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" required placeholder="Mínimo 6 caracteres">
          </div>
          
          <div class="form-group">
            <label for="confirm-password">Confirmar contraseña</label>
            <input type="password" id="confirm-password" required placeholder="Repite tu contraseña">
          </div>
          
          <button type="submit" class="signup-btn">Crear cuenta</button>
          
          <div class="error-message"></div>
        </form>
        
        <div class="form-footer">
          ¿Ya tienes cuenta? <a class="signin-link">Iniciar sesión</a>
        </div>
      </div>
    `;
  }
}

export default SignUpForm;