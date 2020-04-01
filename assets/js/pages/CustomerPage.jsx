import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import CustomersApi from '../services/CustomersApi';
import { toast } from 'react-toastify';


const CustomerPage = ({history,match}) => {
    
    const [error , setError] = useState({
        firstname : "",
        lastname : "",
        email : "",
        company : ""
    });
    const [customer, setCustomer]= useState({
        firstname : "",
        lastname : "",
        email : "",
        company : ""
    })
    const { id = "new" } = match.params;
    const [editing, setEditing] = useState(false);
    const handleChange = event => {
    const {value, name } = event.currentTarget;
    setCustomer({...customer, [name]: value})
    }

    const fetchcustomer = async () =>{
        try{
            if(id !== "new")
            { 
         const  {firstname,lastname,email,company} = await CustomersApi.findbyId(id);
            setCustomer({firstname,lastname,email,company});
            
                setEditing(true); 
               toast.info("Modifier un Client");
           }else{ 
               toast.info("Ajouter un Client");
               setEditing(false); 
           }
        }catch(error){
            console.log(error.response);
        }
    }
     

    useEffect(() =>{
        fetchcustomer();
    },[])

    const handleSbmit =async event => {
        event.preventDefault();
        try{
            if(id === "new")
            {
                await CustomersApi.add(customer);
                toast.info("Vous êtes Ajouter le Client avec succée")
            }else{
                await CustomersApi.update(id,customer);
                toast.info("Vous êtes Modifier le Client avec succée")
            }
            setError({});
            history.push("/customers")
        }catch({response}){
            const { violations } = response.data;
            if(violations){
                const apiErrors = {};
                violations.forEach(({propertyPath,message})  => {
                    apiErrors[propertyPath] = message;
                });

               setError(apiErrors);
            }
        }
    }
    return ( 
    <div className=" mt-4 mr-5 ml-5">
            <h2 className="mb-2">Ajouter un Client</h2>
        <form onSubmit={handleSbmit}> 
            <Field value={customer.lastname} placeholder="le nom famille de client"  name="lastname" label="Nom de Famille :" error={error.lastname} onChange={handleChange} />
            <Field value={customer.firstname} placeholder="Tapez le Prénom de client"  name="firstname" label="Prénom :" error={error.firstname} onChange={handleChange} />
            <Field value={customer.email} placeholder="Tapez l'email de client"  name="email" label="Email :" error={error.email} onChange={handleChange} />
            <Field value={customer.company} placeholder="Tapez l'entreprise de client"  name="company" label="Entreprise  :" error={error.company} onChange={handleChange} />
            <div className="form-group">
                <input type="submit" value="Enregistrer" className="btn btn-success" />
                <Link
                to="/customers"
                >Retour Vers Clients</Link>
            </div>
        </form>
    </div>
    );
}
 
export default CustomerPage;