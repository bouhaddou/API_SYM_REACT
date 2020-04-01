import axios from "axios";



function findAll(){
    return axios
                .get("http://localhost:8000/api/customers")
                .then(response =>response.data["hydra:member"])
        }

function deleteCustomer(id)
{
    return axios
                .delete("http://localhost:8000/api/customers/" + id)
                .then(response => console.log(response))
}

function findbyId(id){
    return axios
                .get("http://localhost:8000/api/customers/" + id)
                .then(response => response.data);
}

function update(id, customer){
    return axios.put("http://localhost:8000/api/customers/" + id , customer)
}

function add(customer){
    return axios.post("http://localhost:8000/api/customers", customer)
}

export default{
    findAll,
    deleteCustomer,
    findbyId,
    update,
    add
}