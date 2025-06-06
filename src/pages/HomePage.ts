import { checkAuthState } from "../services/firebase/auth-service";

class HomePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.renderInitialStructure();
    this.checkAuthentication();
  }

  renderInitialStructure() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        :host {
          display: block;
          font-family: 'Poppins', sans-serif;
          --primary-color: #6366f1;
          --primary-hover: #4f46e5;
          --primary-light: #e0e7ff;
          --secondary-color: #ec4899;
          --secondary-hover: #db2777;
          --accent-color: #8b5cf6;
          --text-color: #1e1b4b;
          --text-secondary: #64748b;
          --border-color: #e2e8f0;
          --background-color: #f8fafc;
          --card-bg: #ffffff;
          --shadow: 0 10px 30px rgba(139, 92, 246, 0.15);
          --border-radius: 16px;
        }
        
        .main-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 60px 20px;
          text-align: center;
        }
        
        .welcome-container {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
          border-radius: var(--border-radius);
          padding: 60px 40px;
          box-shadow: var(--shadow);
          position: relative;
          overflow: hidden;
          animation: fadeIn 0.8s ease-out;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .welcome-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color), var(--accent-color));
        }
        
        h1 {
          color: var(--text-color);
          font-size: 3.5rem;
          margin-bottom: 20px;
          font-weight: 700;
          line-height: 1.2;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color), var(--accent-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .subtitle {
          color: var(--secondary-color);
          font-size: 1.5rem;
          margin-bottom: 30px;
          font-weight: 600;
        }
        
        p {
          color: var(--text-secondary);
          font-size: 1.2rem;
          margin-bottom: 40px;
          line-height: 1.8;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .auth-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 40px;
        }
        
        button {
          font-family: 'Poppins', sans-serif;
          padding: 16px 40px;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          z-index: 1;
          letter-spacing: 0.5px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        #login-btn {
          background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
          color: white;
        }
        
        #login-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(99, 102, 241, 0.4);
        }
        
        #login-btn:active {
          transform: translateY(0);
        }
        
        .secondary-btn {
          background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
          color: white;
        }
        
        .secondary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(236, 72, 153, 0.4);
        }
        
        .secondary-btn:active {
          transform: translateY(0);
        }
        
        .auth-options {
          background: var(--card-bg);
          border-radius: var(--border-radius);
          padding: 50px 40px;
          box-shadow: var(--shadow);
          animation: fadeIn 0.8s ease-out;
          border: 1px solid var(--border-color);
        }
        
        .auth-options h2 {
          color: var(--primary-color);
          font-size: 2.5rem;
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        .auth-options p {
          margin-bottom: 15px;
          color: var(--text-secondary);
        }
        
        .login-message {
          font-style: italic;
          color: var(--accent-color);
          font-size: 0.9rem;
          margin-bottom: 40px !important;
          opacity: 0.9;
        }
        
        .buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
        }
        
        .primary-btn {
          background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
          color: white;
          padding: 16px 40px;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(99, 102, 241, 0.4);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem;
          }
          
          .subtitle {
            font-size: 1.2rem;
          }
          
          p {
            font-size: 1rem;
          }
          
          .welcome-container {
            padding: 40px 20px;
          }
          
          .auth-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          button {
            width: 100%;
            max-width: 280px;
          }
        }
      </style>
      
      <div class="main-container">
        <!-- El contenido se cargará dinámicamente -->
      </div>
    `;
  }

  checkAuthentication() {
    // Verificar si el usuario está autenticado
    checkAuthState((user) => {
      if (user) {
        // Usuario autenticado, redirigir a recordatorios
        window.history.pushState({}, "", "/reminders");
        const event = new CustomEvent("route-change", {
          bubbles: true,
          composed: true,
          detail: { path: "/reminders" },
        });
        this.dispatchEvent(event);
      } else {
        // No autenticado, mostrar opciones de login/registro
        this.renderAuthOptions();
      }
    });
  }

  renderAuthOptions() {
    const container = this.shadowRoot?.querySelector(".main-container");
    if (!container) return;

    container.innerHTML = `
      <div class="auth-options">
        <h1>Asistente Personal de Cris</h1>
        <h2 class="subtitle">¡Tu organizador favorito!</h2>
        <p>Gestiona tus recordatorios, alcanza tus objetivos y mantén todo bajo control con estilo.</p>
        <p class="login-message">Inicia sesión o crea tu cuenta para comenzar tu experiencia personalizada.</p>
        
        <div class="buttons">
          <button id="login-btn" class="primary-btn">Iniciar Sesión</button>
          <button id="register-btn" class="secondary-btn">Crear Cuenta</button>
        </div>
      </div>
    `;

    const loginBtn = this.shadowRoot?.querySelector("#login-btn");
    loginBtn?.addEventListener("click", () => {
      window.history.pushState({}, "", "/login");
      const event = new CustomEvent("route-change", {
        bubbles: true,
        composed: true,
        detail: { path: "/login" },
      });
      this.dispatchEvent(event);
    });

    const registerBtn = this.shadowRoot?.querySelector("#register-btn");
    registerBtn?.addEventListener("click", () => {
      window.history.pushState({}, "", "/register");
      const event = new CustomEvent("route-change", {
        bubbles: true,
        composed: true,
        detail: { path: "/register" },
      });
      this.dispatchEvent(event);
    });
  }
}

export default HomePage;