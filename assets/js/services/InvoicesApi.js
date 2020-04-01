import axios from "axios";



function findAll(){
    return axios
        .get("http://localhost:8000/api/invoces")
        .then(response => response.data["hydra:member"]);
}


function deleteInvoices(id)
{
    return axios
    .delete("http://localhost:8000/api/invoces/" + id)
    .then(response => console.log(response))
}

function findbyId(id){
    return axios
                .get("http://localhost:8000/api/invoces/" + id)
                .then(response => response.data);
}

function update(id, invoice){
    return axios.put("http://localhost:8000/api/invoces/" + id , invoice)
}

function add(invoce, customer){
    return axios.post("http://localhost:8000/api/invoces", {
        ...invoce, 
        customer: `/api/customers/${invoce.customer}`}
    )
}
export default{
    findAll,
    deleteInvoices,
    findbyId,
    update,
    add
}