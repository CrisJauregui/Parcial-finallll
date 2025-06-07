// import firebaseComponent from "./components/firebase-component";
import RootApp from "./root/RootApp";
import TaskForm from "./components/CanvaForm";
import TaskCard from "./components/CanvaCard";
import TaskList from "./components/CanvaBoard";
import RegisterForm from "./components/SignUpForm";
import MainPage from "./pages/HomePage";
import FourPage from "./pages/FourPage";
import TasksPage from "./pages/TasksPage";
import CajaDeTexto from "./Components/Login/CajaTexto";
import BotonLogin from "./Components/Login/Boton";
import LoginForm from "./Components/Login/CajaLogin";

// customElements.define("firebase-component", firebaseComponent);
customElements.define("root-app", RootApp);
customElements.define("task-form", TaskForm);
customElements.define("task-card", TaskCard);
customElements.define("task-list", TaskList);
customElements.define("register-form", RegisterForm);
customElements.define("main-page", MainPage);
customElements.define("four-page", FourPage);
customElements.define("tasks-page", TasksPage);
customElements.define("caja-de-texto", CajaDeTexto);
customElements.define("boton-login", BotonLogin);
customElements.define("login-form", LoginForm);

