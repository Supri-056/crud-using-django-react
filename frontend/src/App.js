// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
const App = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Fetch items
  useEffect(() => {
      axios.get('http://localhost:8000/api/items/')
          .then(response => setItems(response.data))
          .catch(error => console.error(error));
  }, []);

  // Add or update item
  const handleSubmit = (event) => {
      event.preventDefault();
      if (editingItem) {
          axios.put(`http://localhost:8000/api/items/${editingItem.id}/`, { name, description })
              .then(response => {
                  setItems(items.map(item => item.id === editingItem.id ? response.data : item));
                  setEditingItem(null);
              });
      } else {
          axios.post('http://localhost:8000/api/items/', { name, description })
              .then(response => setItems([...items, response.data]));
      }
      setName('');
      setDescription('');
  };

  // Edit item
  const handleEdit = (item) => {
      setEditingItem(item);
      setName(item.name);
      setDescription(item.description);
  };

  // Delete item
  const handleDelete = (id) => {
      axios.delete(`http://localhost:8000/api/items/${id}/`)
          .then(() => setItems(items.filter(item => item.id !== id)));
  };

  return (
      <div>
          <h1>CRUD Application</h1>
          <form onSubmit={handleSubmit}>
              <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
              />
              <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
              <button type="submit">{editingItem ? 'Update' : 'Add'} Item</button>
          </form>
          <ul>
              {items.map(item => (
                  <li key={item.id}>
                      {item.name} - {item.description}
                      <button onClick={() => handleEdit(item)}>Edit</button>
                      <button onClick={() => handleDelete(item.id)}>Delete</button>
                  </li>
              ))}
          </ul>
      </div>
  );
};

export default App;