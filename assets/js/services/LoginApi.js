import axios from 'axios';
import jwtDecode from "jwt-decode";

function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers['Authorization'];
}

function setup()
{
    const token = window.localStorage.getItem("authToken") ;
    if(token){
        const jwtData = jwtDecode(token);
        if(jwtData.exp * 1000 > new Date().getTime())
        {
            axios.defaults.headers["Authorization"] = "Bearer " + token ;
        }else{
            logout();
        }
    }else{
        logout();
    }
}

function autheticate(credentials)
{
    return  axios
    .post("http://localhost:8000/api/login_check",credentials)
    .then(response => response.data.token)
    .then(token => {
            window.localStorage.setItem("authToken", token);
            axios.defaults.headers["Authorization"] = "Bearer " + token ;
        });
}

function isAuthenticated()
{
    const token = window.localStorage.getItem("authToken") ;
    if(token){
        const jwtData = jwtDecode(token);
        if(jwtData.exp * 1000 > new Date().getTime())
        {
            axios.defaults.headers["Authorization"] = "Bearer " + token ;
            return true;
        }
            return false
    }
    return false;
}

export default{
    autheticate,
    logout,
    setup,
    isAuthenticated
}