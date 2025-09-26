import { useState, useEffect } from "react";
import TurnoForm from "./components/TurnoForm";
import TurnoList from "./components/TurnoList";
import TurnoEditForm from "./components/TurnoEditForm";

function App() {
  const [turnos, setTurnos] = useState([]);
  const [turnoEditando, setTurnoEditando] = useState(null);

  // Cargar turnos al iniciar
  useEffect(() => {
    fetch("http://localhost:4000/api/turnos")
      .then((res) => res.json())
      .then((data) => setTurnos(data))
      .catch((err) => console.error("Error cargando turnos:", err));
  }, []);

  // Agregar turno
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

  // Eliminar turno
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

  // Iniciar edición
  const handleEditTurno = (turno) => {
    setTurnoEditando(turno);
  };

  // Guardar turno editado
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
      setTurnoEditando(null); // cerrar el formulario
    } catch (err) {
      console.error("Error al actualizar turno:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
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

export default App;
