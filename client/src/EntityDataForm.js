import React, { useState } from 'react';

const EntityDataForm = ({ entity, onAddData, selectedEntityData }) => {
  const initialData = entity.attributes.reduce((acc, attr) => {
    acc[attr.name] = '';
    return acc;
  }, {});

  const [data, setData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:4000/adduser/${entity.name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });  
      console.log(data)
      const newData = await response.json();
      onAddData(newData); // Call onAddData with the new data including its ID
      setData(initialData);
    } catch (error) {
      console.log('Error adding data into entity', error);
    }
  };
  
  

  return (
    <div className="entity-data-form">
      <h3>Add Data to {entity.name}</h3>
      <form onSubmit={handleSubmit}>
        {entity.attributes.map((attr, index) => (
          // Exclude the 'id' attribute
          attr.name !== 'id' && (
            <div className="form-group" key={index}>
              <label>{attr.name}</label>
              <input
                type={attr.type === 'number' ? 'number' : attr.type === 'date' ? 'date' : 'text'}
                className="form-control"
                name={attr.name}
                value={data[attr.name]}
                onChange={handleChange}
                required={attr.required}
              />
            </div>
          )
        ))}

        <button type="submit" className="btn btn-primary">Add Data</button>
      </form>
    </div>
  );
};

export default EntityDataForm;
