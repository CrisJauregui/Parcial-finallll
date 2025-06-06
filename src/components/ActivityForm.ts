class ActivityForm extends HTMLElement {
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
    form?.addEventListener("submit", (e) => {
      e.preventDefault();

      const titleInput = this.shadowRoot?.querySelector(
        "#activity-title"
      ) as HTMLInputElement;
      const descriptionInput = this.shadowRoot?.querySelector(
        "#activity-description"
      ) as HTMLTextAreaElement;
      const prioritySelect = this.shadowRoot?.querySelector(
        "#activity-priority"
      ) as HTMLSelectElement;

      if (titleInput && descriptionInput && prioritySelect) {
        const activityData = {
          title: titleInput.value.trim(),
          description: descriptionInput.value.trim(),
          priority: prioritySelect.value,
        };

        // Validar que al menos el título no esté vacío
        if (activityData.title) {
          const event = new CustomEvent("activity-submitted", {
            bubbles: true,
            composed: true,
            detail: activityData,
          });

          this.dispatchEvent(event);

          // Limpiar el formulario
          form.reset();
        }
      }
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
        }
        
        .form-container {
          background: var(--bg-white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-soft);
          border: 1px solid rgba(139, 92, 246, 0.1);
          overflow: hidden;
        }
        
        .form-header {
          background: linear-gradient(135deg, var(--primary-blue), var(--primary-purple));
          color: white;
          padding: 25px 30px;
          text-align: center;
        }
        
        .form-header h3 {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
        }
        
        form {
          padding: 30px;
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
        
        input, textarea, select {
          width: 100%;
          padding: 16px 18px;
          border: 2px solid var(--border-light);
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          transition: all 0.3s ease;
          box-sizing: border-box;
          background: #fafbfc;
          color: var(--text-dark);
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--primary-purple);
          background: var(--bg-white);
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }
        
        textarea {
          min-height: 120px;
          resize: vertical;
          line-height: 1.6;
        }
        
        select {
          cursor: pointer;
        }
        
        .priority-high {
          color: #ef4444;
        }
        
        .priority-medium {
          color: #f59e0b;
        }
        
        .priority-low {
          color: #10b981;
        }
        
        .form-actions {
          display: flex;
          justify-content: center;
          margin-top: 30px;
        }
        
        .add-btn {
          padding: 16px 40px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3);
        }
        
        .add-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(236, 72, 153, 0.4);
        }
        
        .add-btn:active {
          transform: translateY(-1px);
        }
        
        ::placeholder {
          color: var(--text-light);
          opacity: 0.8;
        }
        
        /* Animación sutil */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .form-container {
          animation: fadeIn 0.5s ease-out;
        }
      </style>
      
      <div class="form-container">
        <div class="form-header">
          <h3>✨ Nueva Actividad para Cris</h3>
        </div>
        
        <form>
          <div class="form-group">
            <label for="activity-title">¿Qué necesitas hacer?</label>
            <input type="text" id="activity-title" required placeholder="Ejemplo: Llamar al dentista">
          </div>
          
          <div class="form-group">
            <label for="activity-description">Detalles adicionales</label>
            <textarea id="activity-description" placeholder="Describe lo que necesitas recordar o hacer..."></textarea>
          </div>
          
          <div class="form-group">
            <label for="activity-priority">Prioridad</label>
            <select id="activity-priority">
              <option value="medium">🟡 Normal</option>
              <option value="high" class="priority-high">🔴 Urgente</option>
              <option value="low" class="priority-low">🟢 Cuando puedas</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="add-btn">
              ➕ Agregar actividad
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

export default ActivityForm;