// Página de inicio de sesión
class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        font-family: Arial, sans-serif;
                    }
                    
                    .login-page-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: white;
                        padding: 20px;
                    }
                    
                    .content-wrapper {
                        display: flex;
                        align-items: center;
                        max-width: 900px;
                        width: 100%;
                    }
                    
                    .logo-section {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        flex: 1;
                        padding-right: 40px;
                    }
                    
                    .logo-section img {
                        width: 400px;
                        height: auto;
                    }
                    
                    /* Responsive para móviles */
                    @media (max-width: 768px) {
                        .content-wrapper {
                            flex-direction: column;
                            gap: 30px;
                        }
                        
                        .logo-section {
                            padding-right: 0;
                        }
                        
                        .logo-section img {
                            width: 150px;
                        }
                    }
                </style>
                
               <div class="login-page-container">
                    <div class="content-wrapper">
                        <div class="logo-section">
                            <img 
                                src="https://i.postimg.cc/t44LmL1m/Capa-1.png" 
                                alt="Lulada Logo"
                            >
                        </div>
                        
                        <div class="form-section">
                            <login-form></login-form>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

export default LoginPage;