import React from 'react';


const Select = ({ name, value, label, error ="", children, onChange}) => {
    return ( <>
            <div className="form-group">
                <label htmlFor={name} >{label}</label>
                <select 
                    onChange={onChange}
                    name={name}
                    id={name} 
                    value={value} 
                    className="form-control"
                >
                   {children}
                </select>
                <p className={"invalid-feedback" + ( error  && " is-invalid") }>{error}</p>
            </div>
    </> );
};
 
export default Select;