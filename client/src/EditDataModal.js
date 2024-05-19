import React, { useState } from 'react';

const EditDataModal = ({ entity, dataEntry, onUpdateData, onClose }) => {
  const [data, setData] = useState(dataEntry);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await fetch(`http://localhost:4000/data/${entity.name}/${data.id}`,{
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        })
    } catch (error) {
      console.log("Error editing table data",error)
    }
    onUpdateData(data);
    onClose();
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} id="editDataModal" tabIndex="-1" role="dialog" aria-labelledby="editDataModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={onClose} aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 className="modal-title" id="editDataModalLabel">Edit Data Entry</h4>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {entity.attributes.map((attr, index) => (
                <div className="form-group" key={index}>
                  <label>{attr.name}</label>
                  <input
                    type={attr.type === 'number' ? 'number' : attr.type === 'date' ? 'date' : 'text'}
                    className="form-control"
                    name={attr.name}
                    value={data[attr.name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Save changes</button>
                <button type="button" className="btn btn-default" onClick={onClose}>Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDataModal;
