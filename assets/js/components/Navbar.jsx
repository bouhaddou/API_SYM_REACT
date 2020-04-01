import React from 'react';
import LoginApi from '../services/LoginApi';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';


const Navbar = ({isAuthenticated,onLogout, history}) => {

    const handleLogout = () =>{
        LoginApi.logout();
        onLogout(false);
        toast.info("Vous êtes désormais déconnecté :-)");
        history.push("/login");
    }
    return ( 
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavLink className="navbar-brand" to="/">Api React</NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor03">
                    <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/customers">Clients</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/invoices">Factures</NavLink>
                    </li>
                    </ul>
                    <ul className="navbar-nav">
                    {(!isAuthenticated && ( <>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/register">Inscription</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className=" btn btn-success" to="/login">Connexion</NavLink>
                        </li>
                    </> )) ||
                        <li className="nav-item">
                            <button 
                                onClick={() => handleLogout()}
                                className="btn btn-danger" 
                                href="#">Déconnexion
                            </button>
                        </li>
                    }
                    </ul>
                </div>
            </nav>

     );
}
 
export default Navbar;