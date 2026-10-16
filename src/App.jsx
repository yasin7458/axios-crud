import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const API = "http://localhost:3000/users";

  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(null);

  useEffect(() => {
    axios.get(API).then((res) => {
      setData(res.data);
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id === null) {
      axios.post(API, {
        name: name,
        email: email
      }).then((res) => {
        setData((prevData) => [...prevData, res.data]);
        setName("");
        setEmail("");
      });
    }
    else {
      axios.put(`${API}/${id}`, {
        id: id,
        name: name,
        email: email
      }).then((res) => {
        setData(data.map((element) => {
          return element.id == id ? res.data : element;
        }));

        setName("");
        setEmail("");
        setId(null);
      });
    }
  }

  const handleEdit = (user) => {
    setId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  const handleDelete = (deleteId) => {
    axios.delete(`${API}/${deleteId}`).then(() => {
      setData(data.filter((element) => element.id != deleteId));

      if (deleteId == id) {
        setName("");
        setEmail("");
        setId(null);
      }
    });
  };

  const handleCancel = () => {
    setName("");
    setEmail("");
    setId(null);
  };

  return (
    <div className="container">
      <h1>User Management</h1>

      <form className="user-form" onSubmit={handleSubmit}>
        <h2>{id === null ? "Add User" : "Update User"}</h2>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="add-btn">
          {id === null ? "Add User" : "Update User"}
        </button>

        {id !== null && (
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="user-list">
        {data.map((element) => {
          return (
            <div className="user-card" key={element.id}>
              <h2>ID : {element.id}</h2>
              <h3>Name : {element.name}</h3>
              <p>Email : {element.email}</p>

              <div className="buttons">
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => handleEdit(element)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDelete(element.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
