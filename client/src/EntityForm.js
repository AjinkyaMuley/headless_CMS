import React, { useState } from 'react';
import './styles.css';

const EntityForm = ({ onCreateEntity }) => {
  const [entityName, setEntityName] = useState('');
  const [attributes, setAttributes] = useState([{ name: '', type: '' }]);

  const handleEntityNameChange = (e) => {
    setEntityName(e.target.value);
  };

  const handleAttributeChange = (index, e) => {
    const { name, value } = e.target;
    const newAttributes = attributes.map((attribute, i) => {
      if (i === index) {
        return { ...attribute, [name]: value };
      }
      return attribute;
    });
    setAttributes(newAttributes);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', type: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (entityName && attributes.every(attr => attr.name && attr.type)) {
      onCreateEntity({ name: entityName, attributes });
      setEntityName('');
      setAttributes([{ name: '', type: '' }]);
    } else {
      alert('Please fill out all fields before submitting.');
    }
  };

  return (
    <div className="entity-form">
      <h3>Create Entity</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Entity Name</label>
          <input
            type="text"
            className="form-control"
            value={entityName}
            onChange={handleEntityNameChange}
            required
          />
        </div>
        <h4>Attributes</h4>
        {attributes.map((attribute, index) => (
          <div className="attributes" key={index}>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Attribute Name"
              value={attribute.name}
              onChange={(e) => handleAttributeChange(index, e)}
              required
            />
            <select
              className="form-control"
              name="type"
              value={attribute.type}
              onChange={(e) => handleAttributeChange(index, e)}
              required
            >
              <option value="">Select Type</option>
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
          </div>
        ))}
        <button type="button" className="btn btn-secondary" onClick={handleAddAttribute}>Add Attribute</button>
        <button type="submit" className="btn btn-primary">Create Entity</button>
      </form>
    </div>
  );
};

export default EntityForm;
