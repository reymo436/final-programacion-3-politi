import { useState, useEffect } from "react";
import TurnoForm from "./components/TurnoForm";
import TurnoList from "./components/TurnoList";
import TurnoEditForm from "./components/TurnoEditForm";
import LoginForm from "./components/LoginForm";

function App() {
  const [turnos, setTurnos] = useState([]);
  const [turnoEditando, setTurnoEditando] = useState(null);
  const [usuario, setUsuario] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("usuario");
    if (savedUser) setUsuario(JSON.parse(savedUser));
  }, []);

  // Cargar turnos solo si hay usuario logueado
  useEffect(() => {
    if (usuario) {
      fetch("http://localhost:4000/api/turnos")
        .then((res) => res.json())
        .then((data) => setTurnos(data))
        .catch((err) => console.error("Error cargando turnos:", err));
    }
  }, [usuario]);

  
  const handleLogin = (user) => {
    setUsuario(user);
    localStorage.setItem("usuario", JSON.stringify(user));
  };

  
  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    setTurnos([]); 
  };

 
  const handleAddTurno = async (nuevoTurno) => {
    try {
      const response = await fetch("http://localhost:4000/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoTurno),
      });
      const data = await response.json();
      setTurnos([data, ...turnos]);
    } catch (err) {
      console.error("Error al agregar turno:", err);
    }
  };

  
  const handleDeleteTurno = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/turnos/${id}`, {
        method: "DELETE",
      });
      setTurnos(turnos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error al eliminar turno:", err);
    }
  };

  
  const handleEditTurno = (turno) => {
    setTurnoEditando(turno);
  };

  
  const handleSaveEdit = async (turnoEditado) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/turnos/${turnoEditado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(turnoEditado),
        }
      );
      const updated = await response.json();
      setTurnos(turnos.map((t) => (t.id === updated.id ? updated : t)));
      setTurnoEditando(null);
    } catch (err) {
      console.error("Error al actualizar turno:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {!usuario ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <>
          <h1>Gestión de Turnos</h1>
          <div className="user-header">
          <span className="user-info">👤 {usuario.nombre}</span>
          <button onClick={handleLogout}>Cerrar Sesión</button>
          </div>
          {turnoEditando ? (
            <TurnoEditForm
              turno={turnoEditando}
              onSave={handleSaveEdit}
              onCancel={() => setTurnoEditando(null)}
            />
          ) : (
            <TurnoForm onAddTurno={handleAddTurno} />
          )}

          <TurnoList
            turnos={turnos}
            onDeleteTurno={handleDeleteTurno}
            onEditTurno={handleEditTurno}
          />
        </>
      )}
    </div>
  );
}

export default App;
