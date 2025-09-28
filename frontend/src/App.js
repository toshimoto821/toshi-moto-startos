import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessage();
    fetchUsers();
  }, []);

  const fetchMessage = async () => {
    try {
      const response = await fetch('/api/hello');
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error fetching message:', error);
      setMessage('Error connecting to backend');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      if (response.ok) {
        setNewUser({ name: '', email: '' });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Start9 Hello World Full Stack</h1>
        <p className="message">{message}</p>
        
        <div className="content">
          <div className="section">
            <h2>Add New User</h2>
            <form onSubmit={addUser} className="user-form">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
              <button type="submit">Add User</button>
            </form>
          </div>

          <div className="section">
            <h2>Users ({users.length})</h2>
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <div className="users-list">
                {users.length === 0 ? (
                  <p>No users yet. Add one above!</p>
                ) : (
                  users.map((user) => (
                    <div key={user._id} className="user-card">
                      <div className="user-info">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                      <button 
                        onClick={() => deleteUser(user._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="footer">
          <p>
            This is a demonstration of a full-stack application running on StartOS
            <br />
            <strong>Frontend:</strong> React • <strong>Backend:</strong> Node.js/Express • <strong>Database:</strong> MongoDB
          </p>
        </footer>
      </header>
    </div>
  );
}

export default App;
