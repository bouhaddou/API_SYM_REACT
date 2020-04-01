import React from 'react';
{/* <Pagination itemsPerPage={itemsPerPage} handleChange={handleChange} length={customers.length} /> */}

const Pagination = ({itemsPerPage,handleChange,length,currentPage}) => {

    const NombrePage = Math.ceil(length/itemsPerPage);
    const pages=[];

    for(let i = 0 ;i< NombrePage ; i++){ pages.push(i+1);}
    return  (   
        <>
            <div>
                <ul className="pagination pagination-sm">
                    <li className={"page-item " + (currentPage === 1 && " disabled ")} >
                        <button 
                        className="page-link"
                        onClick={ () => handleChange(currentPage - 1)}
                        >&laquo;</button>
                    </li>
                {pages.map(page =>                        
                    <li key={page} className={"page-item " + (page === currentPage && " active") }>
                        <button 
                        onClick={() => handleChange(page)}
                            className="page-link"
                        >{page}</button>
                    </li>
                )}
                    <li className={"page-item " + (currentPage === pages.length && " disabled ")} >
                        <button 
                            onClick={ () => handleChange(currentPage + 1)}
                            className="page-link" 
                        >&raquo;</button>
                    </li>
                </ul>
            </div>
        </>
    )
};

Pagination.getData = (currentPage,itemsPerPage,items) => {
    const start = currentPage * itemsPerPage -itemsPerPage;
    return items.slice(start,start + itemsPerPage);
}
 
export default Pagination;