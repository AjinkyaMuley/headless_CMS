import React, { useState } from 'react';

const AddUserForm = ({ onAddUser }) => {
  const [user, setUser] = useState({ name: '', address: '', age: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddUser(user);
    setUser({ name: '', address: '', age: '' });
  };

  return (
    <div>
      <h3>ADD USER</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input className="form-control" type="text" name="name" placeholder="Name" value={user.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input className="form-control" type="text" name="address" placeholder="Address" value={user.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input className="form-control" type="number" name="age" min="10" max="100" placeholder="Age" value={user.age} onChange={handleChange} required />
        </div>
        <button className="btn btn-primary form-control" type="submit">SUBMIT</button>
      </form>
    </div>
  );
};

export default AddUserForm;
