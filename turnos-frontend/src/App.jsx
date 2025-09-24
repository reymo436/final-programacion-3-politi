import { useEffect, useState } from "react";
import TurnoForm from "./components/TurnoForm.jsx";
import TurnoList from "./components/TurnoList.jsx";

function App() {
  const [turnos, setTurnos] = useState([]);

  // Cargar turnos desde el backend
  useEffect(() => {
    fetch("http://localhost:5000/api/turnos")
      .then((res) => res.json())
      .then((data) => setTurnos(data))
      .catch((err) => console.error(err));
  }, []);

  // Agregar turno nuevo
  const handleAddTurno = (nuevoTurno) => {
    fetch("http://localhost:5000/api/turnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoTurno),
    })
      .then((res) => res.json())
      .then(() => {
        setTurnos([...turnos, nuevoTurno]);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>Sistema de Turnos</h1>
      <TurnoForm onAddTurno={handleAddTurno} />
      <TurnoList turnos={turnos} />
    </div>
  );
}

export default App;
