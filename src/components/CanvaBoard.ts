class ActivityBoard extends HTMLElement {
  private activities: ActivityItem[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["status"];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.loadActivities();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  get status() {
    return this.getAttribute("status") || "pending";
  }

  setupEventListeners() {
    document.addEventListener("activity-added", ((e: CustomEvent) => {
      if (this.status === "pending") {
        this.addActivity(e.detail.activity);
      }
    }) as EventListener);

    this.shadowRoot?.addEventListener("activity-toggle-complete", ((
      e: CustomEvent
    ) => {
      this.toggleActivityComplete(e.detail.activityId);
    }) as EventListener);

    this.shadowRoot?.addEventListener("activity-delete", ((e: CustomEvent) => {
      this.deleteActivity(e.detail.activityId);
    }) as EventListener);

    const activityContainer = this.shadowRoot?.querySelector(".activity-container");
    if (activityContainer) {
      activityContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        activityContainer.classList.add("drag-over");
      });

      activityContainer.addEventListener("dragleave", () => {
        activityContainer.classList.remove("drag-over");
      });

      activityContainer.addEventListener("drop", ((e: DragEvent) => {
        e.preventDefault();
        activityContainer.classList.remove("drag-over");

        const activityId = e.dataTransfer?.getData("text/plain");
        if (activityId) {
          this.moveActivityToStatus(activityId, this.status);
        }
      }) as EventListener);
    }
  }

  loadActivities() {
    // En lugar de localStorage, aquí se conectaría con Firebase
    // Por ahora mantenemos la funcionalidad básica
    const savedActivities = localStorage.getItem("cris-activities");
    if (savedActivities) {
      const allActivities = JSON.parse(savedActivities);
      this.activities = this.filterActivitiesByStatus(allActivities);
      this.render();
    }
  }

  filterActivitiesByStatus(allActivities: ActivityItem[]) {
    switch (this.status) {
      case "pending":
        return allActivities.filter(
          (activity: ActivityItem) =>
            !activity.completed && !activity.inProgress && !activity.inReview
        );
      case "in-progress":
        return allActivities.filter(
          (activity: ActivityItem) =>
            activity.inProgress && !activity.completed && !activity.inReview
        );
      case "review":
        return allActivities.filter(
          (activity: ActivityItem) => activity.inReview && !activity.completed
        );
      case "completed":
        return allActivities.filter((activity: ActivityItem) => activity.completed);
      default:
        return [];
    }
  }

  saveActivities() {
    const savedActivities = localStorage.getItem("cris-activities");
    let allActivities: ActivityItem[] = savedActivities ? JSON.parse(savedActivities) : [];

    allActivities = allActivities.filter((activity: ActivityItem) => {
      switch (this.status) {
        case "pending":
          return activity.inProgress || activity.inReview || activity.completed;
        case "in-progress":
          return !activity.inProgress || activity.inReview || activity.completed;
        case "review":
          return !activity.inReview || activity.completed;
        case "completed":
          return !activity.completed;
        default:
          return true;
      }
    });

    allActivities = [...allActivities, ...this.activities];
    localStorage.setItem("cris-activities", JSON.stringify(allActivities));
  }

  addActivity(activity: ActivityItem) {
    switch (this.status) {
      case "pending":
        activity.inProgress = false;
        activity.inReview = false;
        activity.completed = false;
        break;
      case "in-progress":
        activity.inProgress = true;
        activity.inReview = false;
        activity.completed = false;
        break;
      case "review":
        activity.inProgress = false;
        activity.inReview = true;
        activity.completed = false;
        break;
      case "completed":
        activity.inProgress = false;
        activity.inReview = false;
        activity.completed = true;
        break;
    }

    this.activities.push(activity);
    this.saveActivities();
    this.render();
  }

  toggleActivityComplete(activityId: string) {
    this.activities = this.activities.map((activity: ActivityItem) =>
      activity.id === activityId ? { ...activity, completed: !activity.completed } : activity
    );
    this.saveActivities();
    this.render();
  }

  deleteActivity(activityId: string) {
    this.activities = this.activities.filter((activity: ActivityItem) => activity.id !== activityId);
    this.saveActivities();
    this.render();
  }

  moveActivityToStatus(activityId: string, newStatus: string) {
    const savedActivities = localStorage.getItem("cris-activities");
    if (savedActivities) {
      const allActivities: ActivityItem[] = JSON.parse(savedActivities);
      const activityToMove = allActivities.find((a: ActivityItem) => a.id === activityId);

      if (activityToMove) {
        switch (newStatus) {
          case "pending":
            activityToMove.inProgress = false;
            activityToMove.inReview = false;
            activityToMove.completed = false;
            break;
          case "in-progress":
            activityToMove.inProgress = true;
            activityToMove.inReview = false;
            activityToMove.completed = false;
            break;
          case "review":
            activityToMove.inProgress = false;
            activityToMove.inReview = true;
            activityToMove.completed = false;
            break;
          case "completed":
            activityToMove.inProgress = false;
            activityToMove.inReview = false;
            activityToMove.completed = true;
            break;
        }

        localStorage.setItem("cris-activities", JSON.stringify(allActivities));
        document.dispatchEvent(new CustomEvent("activities-updated"));
        this.loadActivities();
      }
    }
  }

  render() {
    if (!this.shadowRoot) return;

    const pendingActivities = this.activities.filter((activity: ActivityItem) => !activity.completed);
    const completedActivities = this.activities.filter((activity: ActivityItem) => activity.completed);

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
          --bg-light: #f8fafc;
          --shadow-soft: 0 4px 20px rgba(139, 92, 246, 0.15);
          --border-radius: 16px;
          --success-color: #10b981;
          --warning-color: #f59e0b;
        }
        
        .activities-container {
          display: flex;
          flex-direction: column;
          gap: 25px;
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .activity-section {
          background: linear-gradient(135deg, var(--bg-white) 0%, var(--bg-light) 100%);
          border-radius: var(--border-radius);
          padding: 25px;
          box-shadow: var(--shadow-soft);
          border: 1px solid rgba(139, 92, 246, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .activity-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple), var(--primary-pink));
          border-radius: var(--border-radius) var(--border-radius) 0 0;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid var(--border-light);
        }
        
        .section-icon {
          font-size: 24px;
          width: 45px;
          height: 45px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary-purple), var(--primary-pink));
          color: white;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }
        
        .section-title {
          margin: 0;
          color: var(--text-dark);
          font-size: 22px;
          font-weight: 600;
          flex: 1;
        }
        
        .section-count {
          background: linear-gradient(135deg, var(--primary-blue), var(--primary-purple));
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        
        .activity-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 15px;
        }
        
        .activity-item {
          background: var(--bg-white);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .activity-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, var(--primary-blue), var(--primary-purple));
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }
        
        .activity-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
        }
        
        .activity-item:hover::before {
          transform: scaleY(1);
        }
        
        .activity-item.completed {
          opacity: 0.7;
          background: linear-gradient(135deg, var(--bg-light) 0%, #f0fdf4 100%);
        }
        
        .activity-item.completed .activity-title {
          text-decoration: line-through;
          color: var(--text-light);
        }
        
        .activity-content {
          flex: 1;
          padding-right: 15px;
        }
        
        .activity-title {
          font-weight: 600;
          font-size: 16px;
          margin: 0 0 8px 0;
          color: var(--text-dark);
          line-height: 1.4;
        }
        
        .activity-description {
          font-size: 14px;
          color: var(--text-light);
          line-height: 1.5;
          margin: 0;
        }
        
        .activity-priority {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          margin-top: 8px;
        }
        
        .priority-high {
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        
        .priority-medium {
          background: linear-gradient(135deg, #fefbf2, #fef3c7);
          color: #d97706;
          border: 1px solid #fed7aa;
        }
        
        .priority-low {
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }
        
        .activity-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 120px;
        }
        
        .action-btn {
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .complete-btn {
          background: linear-gradient(135deg, var(--success-color), #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        
        .complete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        
        .delete-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }
        
        .delete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }
        
        .empty-message {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-light);
          font-style: italic;
          font-size: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        
        .empty-icon {
          font-size: 48px;
          opacity: 0.5;
        }
        
        .drag-over {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
          border: 2px dashed var(--primary-purple);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .activity-item {
          animation: fadeInUp 0.5s ease-out;
        }
        
        @media (max-width: 768px) {
          .activities-container {
            padding: 15px;
            gap: 20px;
          }
          
          .activity-section {
            padding: 20px;
          }
          
          .activity-item {
            flex-direction: column;
            gap: 15px;
          }
          
          .activity-content {
            padding-right: 0;
          }
          
          .activity-actions {
            flex-direction: row;
            min-width: auto;
            width: 100%;
          }
        }
      </style>
      
      <div class="activities-container">
        <div class="activity-section">
          <div class="section-header">
            <div class="section-icon">📋</div>
            <h3 class="section-title">Actividades Pendientes</h3>
            <span class="section-count">${pendingActivities.length}</span>
          </div>
          
          ${
            pendingActivities.length > 0
              ? `
            <ul class="activity-list">
              ${pendingActivities
                .map(
                  (activity: ActivityItem) => `
                <li class="activity-item" data-id="${activity.id}">
                  <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    ${
                      activity.description
                        ? `<div class="activity-description">${activity.description}</div>`
                        : ""
                    }
                    ${
                      activity.priority
                        ? `<span class="activity-priority priority-${activity.priority}">
                            ${activity.priority === 'high' ? '🔴 Urgente' : 
                              activity.priority === 'medium' ? '🟡 Normal' : '🟢 Tranquilo'}
                           </span>`
                        : ""
                    }
                  </div>
                  <div class="activity-actions">
                    <button class="action-btn complete-btn">✓ Completar</button>
                    <button class="action-btn delete-btn">🗑️ Eliminar</button>
                  </div>
                </li>
              `
                )
                .join("")}
            </ul>
          `
              : `
            <div class="empty-message">
              <div class="empty-icon">🎉</div>
              <p>¡Genial Cris! No tienes actividades pendientes</p>
            </div>
          `
          }
        </div>
        
        <div class="activity-section">
          <div class="section-header">
            <div class="section-icon">✅</div>
            <h3 class="section-title">Actividades Completadas</h3>
            <span class="section-count">${completedActivities.length}</span>
          </div>
          
          ${
            completedActivities.length > 0
              ? `
            <ul class="activity-list">
              ${completedActivities
                .map(
                  (activity: ActivityItem) => `
                <li class="activity-item completed" data-id="${activity.id}">
                  <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    ${
                      activity.description
                        ? `<div class="activity-description">${activity.description}</div>`
                        : ""
                    }
                    ${
                      activity.priority
                        ? `<span class="activity-priority priority-${activity.priority}">
                            ${activity.priority === 'high' ? '🔴 Urgente' : 
                              activity.priority === 'medium' ? '🟡 Normal' : '🟢 Tranquilo'}
                           </span>`
                        : ""
                    }
                  </div>
                  <div class="activity-actions">
                    <button class="action-btn complete-btn">↶ Desmarcar</button>
                    <button class="action-btn delete-btn">🗑️ Eliminar</button>
                  </div>
                </li>
              `
                )
                .join("")}
            </ul>
          `
              : `
            <div class="empty-message">
              <div class="empty-icon">💪</div>
              <p>Aún no has completado ninguna actividad, ¡tú puedes Cris!</p>
            </div>
          `
          }
        </div>
      </div>
    `;

    // Configurar event listeners para los botones
    this.setupActionButtons();
  }

  private setupActionButtons() {
    const completeButtons = this.shadowRoot?.querySelectorAll('.complete-btn');
    const deleteButtons = this.shadowRoot?.querySelectorAll('.delete-btn');

    completeButtons?.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const activityItem = (e.target as HTMLElement).closest('.activity-item');
        const activityId = activityItem?.getAttribute('data-id');
        if (activityId) {
          this.toggleActivityComplete(activityId);
        }
      });
    });

    deleteButtons?.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const activityItem = (e.target as HTMLElement).closest('.activity-item');
        const activityId = activityItem?.getAttribute('data-id');
        if (activityId) {
          this.deleteActivity(activityId);
        }
      });
    });
  }
}

interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  completed?: boolean;
  inProgress?: boolean;
  inReview?: boolean;
}

export default ActivityBoard;