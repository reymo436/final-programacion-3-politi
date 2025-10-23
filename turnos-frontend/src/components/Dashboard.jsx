import { useState, useEffect } from "react";
import TurnoForm from "./TurnoForm";
import TurnoList from "./TurnoList";
import TurnoEditForm from "./TurnoEditForm";

function Dashboard({ user, onLogout }) {
  const [turnos, setTurnos] = useState([]);
  const [turnoEditando, setTurnoEditando] = useState(null);

 
  useEffect(() => {
    fetch("http://localhost:4000/api/turnos")
      .then((res) => res.json())
      .then((data) => setTurnos(data))
      .catch((err) => console.error("Error cargando turnos:", err));
  }, []);

  
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

  
  const handleEditTurno = (turno) => setTurnoEditando(turno);

  
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
      <nav style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>
          Bienvenido, {user.username} ({user.role})
        </h2>
        <button onClick={onLogout}>Cerrar Sesión</button>
      </nav>

      <h1>Gestión de Turnos</h1>

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
    </div>
  );
}

export default Dashboard;
