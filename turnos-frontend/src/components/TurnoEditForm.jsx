import { useState, useEffect } from "react";

function TurnoEditForm({ turno, onSave, onCancel }) {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [estado, setEstado] = useState("pendiente");

  // Cargar datos iniciales al abrir el form
  useEffect(() => {
    if (turno) {
      setNombre(turno.nombre_cliente);
      setFecha(turno.fecha);
      setHora(turno.hora);
      setEstado(turno.estado || "pendiente");
    }
  }, [turno]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...turno,
      nombre_cliente: nombre,
      fecha,
      hora,
      estado,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Editar Turno</h3>
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
      <div>
        <label>Estado:</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="pendiente">Pendiente</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      <button type="submit">Guardar</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
        Cancelar
      </button>
    </form>
  );
}

export default TurnoEditForm;
