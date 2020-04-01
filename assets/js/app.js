import React,{ useState } from 'react';
import ReactDOM from 'react-dom';
import '../css/app.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { HashRouter, Switch, Route, withRouter, Redirect } from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import CustomerPage from './pages/CustomerPage';
import Invoices from './pages/Invoices';
import LoginPage from './pages/LoginPage';
import LoginApi from "./services/LoginApi";
import InvoicePage from './pages/InvoicePage';
import RegisterPage from './pages/registerPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


LoginApi.setup();

const  App = () =>{

const PrivatRoute = ({path, isAuthenticated, component}) =>{
 return isAuthenticated ? 
    <Route path={path} isAuthenticated={isAuthenticated} component={component} /> 
    : 
    <Redirect to="/login" />
}   
const [isAuthenticated, setIsAuthenticated] = useState(LoginApi.isAuthenticated)  ;
const WithRouterNavbar = withRouter(Navbar);
    return <HashRouter>
        <WithRouterNavbar isAuthenticated={isAuthenticated} onLogout={setIsAuthenticated} />
        <div className="container">
            <Switch> 
               
                <Route path="/login"  render={props => (  <LoginPage  onLogin={setIsAuthenticated} {...props} /> )} />
                <Route path="/register"  render={props => (  <RegisterPage  onLogin={setIsAuthenticated} {...props} /> )} />
                <PrivatRoute path="/invoices/:id" component={InvoicePage} isAuthenticated={isAuthenticated}  />
                <PrivatRoute path="/invoices" component={Invoices} isAuthenticated={isAuthenticated}  />
                <PrivatRoute path="/customers/:id" component={CustomerPage} isAuthenticated={isAuthenticated}  />
                <PrivatRoute path="/customers" component={CustomersPage} isAuthenticated={isAuthenticated}  />
                <Route path="/" component={HomePage} />
            </Switch>
        </div> 
        <ToastContainer position={toast.POSITION.BOTTOM_LEFT}/>
    </HashRouter>
   
}
const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>,rootElement);