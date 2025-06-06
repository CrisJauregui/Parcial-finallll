class ActivityCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["id", "title", "description", "status"];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const statusButtons = this.shadowRoot?.querySelectorAll(".status-btn");
    statusButtons?.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const status = target.getAttribute("data-status");
        const activityCard = this.shadowRoot?.querySelector(".activity-card");
        const statusElement = activityCard?.querySelector(".activity-status");

        if (activityCard && statusElement && status) {
          // Actualizar la clase de la tarjeta
          activityCard.className = "activity-card " + status;

          if (status === "completed") {
            activityCard.classList.add("completed");
          } else {
            activityCard.classList.remove("completed");
          }

          // Actualizar el texto del estado
          statusElement.textContent =
            status === "pending"
              ? "Pendiente"
              : status === "in-progress"
              ? "En proceso"
              : "Finalizada";

          // Actualizar la clase del estado para aplicar el color correcto
          statusElement.className = "activity-status " + status;

          // Resaltar el botón activo
          const allStatusBtns =
            this.shadowRoot?.querySelectorAll(".status-btn");
          allStatusBtns?.forEach((statusBtn) => {
            if (statusBtn.getAttribute("data-status") === status) {
              statusBtn.classList.add("active-status");
            } else {
              statusBtn.classList.remove("active-status");
            }
          });

          // Emitir evento para notificar el cambio de estado
          this.dispatchEvent(
            new CustomEvent("activity-status-changed", {
              bubbles: true,
              composed: true,
              detail: {
                id: this.getAttribute("id"),
                status: status,
              },
            })
          );
        }
      });
    });

    // Agregar evento para el botón eliminar
    const deleteBtn = this.shadowRoot?.querySelector(".delete-btn");
    deleteBtn?.addEventListener("click", () => {
      // Emitir un evento para notificar que la actividad debe ser eliminada
      this.dispatchEvent(
        new CustomEvent("activity-deleted", {
          bubbles: true,
          composed: true,
          detail: {
            id: this.getAttribute("id"),
          },
        })
      );
    });
  }

  render() {
    if (!this.shadowRoot) return;

    const id = this.getAttribute("id") || "";
    const title = this.getAttribute("title") || "Sin título";
    const description = this.getAttribute("description") || "Sin descripción";
    const status = this.getAttribute("status") || "pending";

    const statusText =
      status === "pending"
        ? "Pendiente"
        : status === "in-progress"
        ? "En proceso"
        : "Finalizada";

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        :host {
          display: block;
          font-family: 'Inter', sans-serif;
          --primary-blue: #3b82f6;
          --primary-purple: #8b5cf6;
          --primary-pink: #ec4899;
          --secondary-blue: #1e40af;
          --light-blue: #dbeafe;
          --light-purple: #ede9fe;
          --light-pink: #fce7f3;
          --text-primary: #0f172a;
          --text-secondary: #475569;
          --text-muted: #94a3b8;
          --background: #ffffff;
          --surface: #f8fafc;
          --border: #e2e8f0;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          --radius: 12px;
        }
        
        .activity-card {
          background: linear-gradient(135deg, var(--background) 0%, var(--surface) 100%);
          border-radius: var(--radius);
          border: 1px solid var(--border);
          padding: 20px;
          margin-bottom: 16px;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        
        .activity-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple), var(--primary-pink));
          transition: all 0.3s ease;
        }
        
        .activity-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-purple);
        }
        
        .activity-card.pending::before {
          background: linear-gradient(90deg, var(--primary-blue), #60a5fa);
        }
        
        .activity-card.in-progress::before {
          background: linear-gradient(90deg, var(--warning), #fbbf24);
        }
        
        .activity-card.completed::before {
          background: linear-gradient(90deg, var(--success), #34d399);
        }
        
        .activity-card.completed {
          background: linear-gradient(135deg, var(--surface) 0%, #f0fdf4 100%);
          opacity: 0.85;
        }
        
        .activity-card.completed .activity-title {
          text-decoration: line-through;
          color: var(--text-muted);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        
        .activity-title {
          font-weight: 600;
          font-size: 17px;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.4;
          flex: 1;
          padding-right: 12px;
        }
        
        .activity-status {
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .activity-status.pending {
          background: var(--light-blue);
          color: var(--secondary-blue);
        }
        
        .activity-status.in-progress {
          background: #fef3c7;
          color: #d97706;
        }
        
        .activity-status.completed {
          background: #dcfce7;
          color: #16a34a;
        }
        
        .activity-status::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }
        
        .activity-description {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.5;
          margin: 0 0 16px 0;
        }
        
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .status-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        
        .status-btn {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .status-btn:hover {
          background: var(--light-purple);
          border-color: var(--primary-purple);
          color: var(--primary-purple);
          transform: translateY(-1px);
        }
        
        .status-btn.active-status {
          background: linear-gradient(135deg, var(--primary-purple), var(--primary-pink));
          border-color: var(--primary-purple);
          color: white;
          box-shadow: var(--shadow-md);
        }
        
        .delete-btn {
          background: linear-gradient(135deg, var(--danger), #dc2626);
          border: none;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 500;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .delete-btn:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .activity-card {
          animation: slideIn 0.3s ease-out;
        }
        
        @media (max-width: 640px) {
          .activity-card {
            padding: 16px;
          }
          
          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .activity-title {
            padding-right: 0;
          }
          
          .card-footer {
            flex-direction: column;
            align-items: stretch;
          }
          
          .status-actions {
            justify-content: space-between;
          }
        }
      </style>
      
      <div class="activity-card ${status}" data-id="${id}">
        <div class="card-header">
          <h3 class="activity-title">${title}</h3>
          <span class="activity-status ${status}">${statusText}</span>
        </div>
        
        <p class="activity-description">${description}</p>
        
        <div class="card-footer">
          <div class="status-actions">
            <button class="status-btn ${
              status === "pending" ? "active-status" : ""
            }" data-status="pending">
              📋 Pendiente
            </button>
            <button class="status-btn ${
              status === "in-progress" ? "active-status" : ""
            }" data-status="in-progress">
              ⚡ En proceso
            </button>
            <button class="status-btn ${
              status === "completed" ? "active-status" : ""
            }" data-status="completed">
              ✅ Finalizada
            </button>
          </div>
          <button class="delete-btn">
            🗑️ Eliminar
          </button>
        </div>
      </div>
    `;
  }
}

export default ActivityCard;