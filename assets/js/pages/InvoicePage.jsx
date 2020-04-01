import React, { useState, useEffect } from 'react';
import InvoicesApi from '../services/InvoicesApi';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import CustomersApi from '../services/CustomersApi';
import axios from 'axios';


const InvoicePage  = ({history,match}) => {
    const { id = "new" } = match.params;
    const [editing, setEditing] = useState(false);
    const [customers,setCustomers] =useState([]);
    const [currentPage,setCurrentPage] =useState(1);
    const [invoce, setInvoces] =useState({
        amount : "",
        customer : "",
        status : "SENT"
    });
    const [error, setError] =useState({
        amount : "",
        customer : "",
        status : ""
    });
    const STATUS_NAME = {
        SENT : "Envoyée",
        CANCELLED : "Annulée",
        PAID : "Payée"
    };
    
    const fetchCustomers = async () =>{
        
        try{
        
         const data = await  CustomersApi.findAll();
            setCustomers(data); 
            if(!invoce.customer) setInvoces({ ...invoce, customer: data[0].id});
           
           
       }catch(error){
           console.log(error.response)
       }
   }
   useEffect(() => {
       fetchCustomers();  
   }, []);

   const fetchInvoice = async id =>{
       try{
        const data = await axios.get("http://localhost:8000/api/invoces/" + id)
        .then(response => response.data)
        const {amount,status, customer} =data;
        setInvoces({amount,status, customer: customer.id})
       }catch(error){
           console.log(error.response)
       }
   }
   useEffect(() => {
       if(id !== "new"){
           setEditing(true);
        fetchInvoice(id);

       }
    }, [id]);

   const handleChange = event =>
   {
    const {value, name} = event.currentTarget;
    setInvoces({...invoce, [name]: value})
   }
   const handleSbmit = async (event) => {
    event.preventDefault();
        try{  
            if(!editing)
            {  
          const response =  await axios.post("http://localhost:8000/api/invoces", {
            ...invoce, 
            customer: `/api/customers/${invoce.customer}`
             });
            }else{
            const response = await axios.put("http://localhost:8000/api/invoces/" + id , {...invoce,
             customer:`/api/customers/${invoce.customer}`});
            }
            setError({});
            history.replace("/invoices");
        }catch({response})  {
           
            const { violations } = response.data;
             if(violations){
                 const apiErrors = {};
                 violations.forEach(({propertyPath,message})  => {
                     apiErrors[propertyPath] = message;
                 });
             
                setError(apiErrors);   
                 console.log(apiErrors);
             }
        }
   }

  
    return ( <>
            <div className=" mt-4 mr-5 ml-5">
         {editing && <h2 className="mb-2">Modification d'une facture  </h2> || <h2 className="mb-2">Ajouter une facture  </h2>}
        <form onSubmit={handleSbmit}> 
            <Field value={invoce.amount} type="number" placeholder="Montant de Facture"  name="amount" label="Montant  :" error={error.amount} onChange={handleChange} />
            <Select name="customer" id="customer" label="List des Clients :" error={error.customer} value={invoce.customer} onChange={handleChange} >
                {customers.map(customer => 
                <option key={customer.id} value={customer.id}>{customer.firstname} {customer.lastname}</option>
                )}
            </Select>
            <Select name="status" id="status" label="status :" error={error.status} value={invoce.status} onChange={handleChange} >
                <option  value="SENT">{STATUS_NAME.SENT}</option>
                <option  value="PAID">{STATUS_NAME.PAID}</option>
                <option  value="CANCELLED">{STATUS_NAME.CANCELLED}</option>
            </Select>
           
            
            <div className="form-group">
                <input type="submit" value="Enregistrer" className="btn btn-success" />
                <Link
                to="/customers"
                >Retour Vers factures</Link>
            </div>
        </form>
    </div>
        </>
    
    );
}
 
export default InvoicePage;