import React, { useEffect, useState } from 'react';
import CustomersApi from '../services/CustomersApi';
import { Link } from 'react-router-dom';
import Pagination from "../components/Pagination"
import TableLoader from '../components/loaders/tableLoader';
import { toast } from 'react-toastify';

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage]= useState(1);
    const [search , setSearch] = useState("");
    const [loading , setLoading] = useState(true);
  

    const fetchCustomers = async () =>{
         try{
          const data = await  CustomersApi.findAll();
             setCustomers(data);
             setLoading(false);
             toast.info("Liste des Clients ")
        }catch(error){
            console.log(error.response)
        }
    }
    useEffect(() => {
        fetchCustomers();  
    }, []);

    // fonction permet de supprimer un element dans la table customers
    const handleDelete = async (id) =>{
        const tableorigine = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id));
        try{
            await  CustomersApi.deleteCustomer(id)
        }catch(error){
                setCustomers(tableorigine);
        }
        
    };
    // Ensemble des traitement qui nous permet de faire des recherche sur les clients
    const handleSearch = event => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }
    const searchCustomers = customers.filter(
        c =>
            c.firstname.toLowerCase().includes(search.toLocaleLowerCase()) ||
            c.lastname.toLowerCase().includes(search.toLocaleLowerCase()) ||
            c.email.toLowerCase().includes(search.toLocaleLowerCase()) ||
            c.company.toLowerCase().includes(search.toLocaleLowerCase()) 
    )
    // contient pagination et fonction handlechange permet de naviger sur les clients 
    const handleChange = (id) =>{
        setCurrentPage(id);
    }
    const itemsPerPage = 5 ;
    const PaginationCustomers = Pagination.getData(currentPage,itemsPerPage,searchCustomers);

    return ( <>
             <div className=" mb-2 mt-5 d-flex justify-content-between align-items-center">
                <h1>list des clients</h1>
                <Link className="btn btn-success" to="/customers/new">Créer un Clients</Link>
            </div>
            <div className="form-group">
                <input type="text" placeholder="search" value={search} onChange={handleSearch} className="form-control" />
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant Total</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                {!loading && <tbody>
                {PaginationCustomers.map(customer => 
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            <Link to={"/customers/"+ customer.id } >
                                {customer.firstname} {customer.lastname}
                            </Link>
                            </td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td className="text-center">
                           <span className="badge badge-primary"> {customer.invoces.length}</span>
                        </td>
                        <td className="text-center">
                            {customer.totaleAmount.toFixed(2)} $
                            </td>
                        <td className="text-center">
                            <button 
                                className=" btn btn-danger"
                                disabled={customer.invoces.length > 0 }
                                onClick={() => handleDelete(customer.id)}
                            >
                                delete
                            </button>
                        </td>
                       
                    </tr>
                )}
                </tbody>}
            </table>
                {loading && <TableLoader /> }
               <br/>
            {searchCustomers.length > 5 && 
            <div className="d-flex justify-content-center">
            <Pagination 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                handleChange={handleChange} 
                length={searchCustomers.length} />
            </div>
            }
        </>
     );
}
 
export default CustomersPage;