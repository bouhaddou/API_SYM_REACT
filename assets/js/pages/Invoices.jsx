import React, { useState, useEffect } from 'react';
import InvoicesApi from '../services/InvoicesApi';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Pagination from '../components/Pagination';


const Invoices  = (history) => {
    const [invoce, setInvoces] =useState([]);
    const [customers,setCustomers] =useState([]);
    const [currentPage, setCurrentPage]= useState(1);
    const [search , setSearch] = useState("");
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');
    
    const STATUS_COLOR = {
        "PAID" : "success",
        "SENT": "info",
        "CANCELLED" : "danger"
    };
    const STATUS_NAME = {
        SENT : "Envoyée",
        CANCELLED : "Annulée",
        PAID : "Payée"
    };
    const fetchInvoces = async () =>{
        try{
         const data = await  InvoicesApi.findAll();
            setInvoces(data);
       }catch(error){
           console.log(error.response)
       }
   }
   useEffect(() => {
       fetchInvoces();  
   }, []);

      // Ensemble des traitement qui nous permet de faire des recherche sur les clients
      const handleSearch = event => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }
    const searchInvoices = invoce.filter(
        c =>
            STATUS_NAME[c.status].toLowerCase().includes(search.toLocaleLowerCase()) ||
            c.customer.lastname.toLowerCase().includes(search.toLowerCase()) ||
            c.customer.firstname.toLowerCase().includes(search.toLowerCase()) ||
            c.amount.toString().startsWith(search.toString())  
            
    )
    // contient pagination et fonction handlechange permet de naviger sur les clients 
    const handleChange = (id) =>{
        setCurrentPage(id);
    }
    const itemsPerPage = 5 ;
    const PaginationCustomers = Pagination.getData(currentPage,itemsPerPage,searchInvoices);


  
    return ( <>
            <div className=" mb-2 mt-5 d-flex justify-content-between align-items-center">
                <h1>list des clients</h1>
                <Link className="btn btn-success" to="/invoices/new">Créer une Facture</Link>
            </div>
            <div className="form-group">
                <input type="text" placeholder="search" value={search} onChange={handleSearch} className="form-control" />
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center">id</th>
                        <th>Client</th>
                        <th className="text-center">Date</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Montant Total</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                {PaginationCustomers.map(invoce => 
                    <tr key={invoce.id}>
                    <td className="text-center">{invoce.id}</td>
                    <td>{invoce.customer.firstname} {invoce.customer.lastname}</td>
                    <td className="text-center">{formatDate(invoce.setAt)}</td>
                    <td className="text-center">
                <span className={" w-100 p-1 badge badge-" + STATUS_COLOR[invoce.status]  }>{STATUS_NAME[invoce.status]}</span>
                    </td>
                    <td className="text-center">{invoce.amount} $</td>
                    <td className="text-center">
                        <Link className="btn btn-success" to={"/invoices/" + invoce.id }>
                            Editer
                        </Link>
                        <button className="btn btn-danger"
                            //  onClick={() => handleDelete(invoce.id)}
                        >delete</button>
                    </td>
                </tr>
                )}
                </tbody>
            </table>
               <br/>
            {searchInvoices.length > 5 && 
            <div className="d-flex justify-content-center">
            <Pagination 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                handleChange={handleChange} 
                length={searchInvoices.length} />
            </div>
            }
        </>
    
    );
}
 
export default Invoices;