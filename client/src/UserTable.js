import React from 'react';

const UserTable = ({ users, onEditUser, onDeleteUser }) => {
  return (
    <div>
      <h3>USERS</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Age</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.address}</td>
              <td>{user.age}</td>
              <td>
                <button className="btn btn-success" onClick={() => onEditUser(user.id)}>EDIT</button>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => onDeleteUser(user.id)}>DELETE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
