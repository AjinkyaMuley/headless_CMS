import React, { useState } from 'react';

const EditUserModal = ({ user, onUpdateUser, onClose }) => {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser(editedUser);
    onClose();
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={onClose} aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 className="modal-title" id="myModalLabel">Update User</h4>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <label>Name</label>
              <input className="form-control" type="text" name="name" value={editedUser.name} onChange={handleChange} />
              <label>Address</label>
              <input className="form-control" type="text" name="address" value={editedUser.address} onChange={handleChange} />
              <label>Age</label>
              <input className="form-control" type="number" name="age" value={editedUser.age} onChange={handleChange} min="10" max="100" />
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

export default EditUserModal
