import { useState } from "react";

function TurnoForm({ onAddTurno }) {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !fecha || !hora) {
      alert("Por favor completa todos los campos");
      return;
    }

    const nuevoTurno = { 
      nombre_cliente: nombre, 
      fecha, 
      hora, 
      estado: "pendiente" 
    };

    onAddTurno(nuevoTurno);

    setNombre("");
    setFecha("");
    setHora("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <div>
        <label>Nombre Cliente:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div>
        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>
      <div>
        <label>Hora:</label>
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
        />
      </div>
      <button type="submit">Agregar Turno</button>
    </form>
  );
}

export default TurnoForm;
