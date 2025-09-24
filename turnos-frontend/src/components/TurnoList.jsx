function TurnosList({ turnos }) {
  if (turnos.length === 0) {
    return <p>No hay turnos registrados.</p>;
  }

  return (
    <ul>
      {turnos.map((turno, index) => (
        <li key={index}>
          {turno.nombre} - {turno.fecha}
        </li>
      ))}
    </ul>
  );
}

export default TurnosList;

