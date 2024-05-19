import React, { useState } from 'react';
import AddUserForm from './AddUserForm';
import UserTable from './UserTable';
import EditUserModal from './EditUserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Bob", address: "Manila", age: 27 },
    { id: 2, name: "Harry", address: "Baguio", age: 32 }
  ]);

  const [editingUser, setEditingUser] = useState(null);

  const handleAddUser = (user) => {
    const lastUser = users[users.length - 1];
    const newUserId = lastUser ? lastUser.id + 1 : 1;
    const userToAdd = { ...user, id: newUserId };
    setUsers([...users, userToAdd]);
  };

  const handleEditUser = (id) => {
    const user = users.find(user => user.id === id);
    setEditingUser(user);
  };

  const handleUpdateUser = (editedUser) => {
    const updatedUsers = users.map(user => user.id === editedUser.id ? editedUser : user);
    setUsers(updatedUsers);
    setEditingUser(null);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleCloseModal = () => {
    setEditingUser(null);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <AddUserForm onAddUser={handleAddUser} />
        </div>
        <div className="col-md-8">
          <UserTable users={users} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} />
        </div>
      </div>
      {editingUser && (
        <EditUserModal user={editingUser} onUpdateUser={handleUpdateUser} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default UserManagement;
