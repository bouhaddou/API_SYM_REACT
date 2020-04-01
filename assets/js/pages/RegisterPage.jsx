import React, { useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = ({ history})=> {
    const [user, setUser] = useState({
        firstname :"",
        lastename :"",
        email :"",
        password:"",
        passwordConfirme:""
    });
    const [error, setError] = useState({
        firstname :"",
        lastename :"",
        email :"",
        password:"",
        passwordConfirme:""
    });

    const handleChange = event => {
        const {value, name } = event.currentTarget;
        setUser({...user, [name]: value})
        };

        const handlesubmit = async event =>{
            event.preventDefault();
            const apiErrors ={};
            if(user.password !== user.passwordConfirme){
                apiErrors.passwordConfirme="votre confirmation de mot de passe n'est pas conforme avec le mote de pass originale";
                setError(apiErrors);
                return;
            }

            try{
                const response = await axios.post("http://localhost:8000/api/users", user);
                setError({});
                history.replace('/login');
            }catch(error){
                console.log(error.response)
                const {violations} = error.response.data;
                if(violations){
                    
                    violations.forEach(violation =>{
                        apiErrors[violation.propertyPath] = violation.message
                    });
                    setError(apiErrors)
                }
            }
        }

    return ( 
        <>
            <h1>Inscriprion</h1>
            <form onSubmit={handlesubmit}>
                <Field name="firstname" label="Prénom :" placeholder="Votre Prénom " error={error.firstname} value={user.firstname} onChange={handleChange} />
                <Field name="lastename" label="Nom :" placeholder="Votre Prénom " error={error.lastename} value={user.lastename} onChange={handleChange} />
                <Field name="email" type="email" label="email :" placeholder="Votre email " error={error.email} value={user.email} onChange={handleChange} />
                <Field name="password" type="paswword" label="password :" placeholder="Votre password " error={error.password} value={user.password} onChange={handleChange} />
                <Field name="passwordConfirme" type="paswword" label="password Confirme :" placeholder="Votre passwordConfirme " error={error.passwordConfirme} value={user.passwordConfirme} onChange={handleChange} />
                <div className="form-group">
                        <button className="btn btn-primary" type="submit">inscription</button>
                    </div>
                <Link to="/login">
                    j'ai déja un compte
                </Link>
            </form>
        </>
     );
}
 
export default RegisterPage;