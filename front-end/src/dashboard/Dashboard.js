import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import TablesList from "../tables/TablesList";
import NavButtons from "./NavButtons";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationList";
import "./Dashboard.css";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [table, setTable] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  // Load Dashboard - reservations and tables, remove loading message //
  useEffect(() => {
    loadReservationsAndTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);


  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTable)
      .then(setTablesError);
    return () => abortController.abort();
  }

  function loadReservationsAndTables() {
    const abortController = new AbortController();
    loadReservations();
    loadTables();
    return () => abortController.abort();
  }

  return (
    <main className="dashboard">
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-2">
        {!reservations.length && <h2>No reservations on this date</h2>} 
      </div>
      <ErrorAlert error={reservationsError} setError={setReservationsError} />
      
      <div className="reservations-list">
        <h3 className="mb-2">Reservations for {date}</h3>
        <ReservationsList
          reservations={reservations}
          setReservationsError={setReservationsError}
          loadReservationsAndTables={loadReservationsAndTables}
        />
      </div>

      <div className="date-nav">
        <NavButtons currentDate={date} />
      </div>

      <div className="tables-list">
        <div className="d-md-flex mb-3">
          <h3 className="mb-0">Tables</h3>
        </div>
        {!table && <h4 className="load-message">Loading...</h4>}
        <ErrorAlert error={tablesError} setError={setTablesError} />
        <TablesList
          tables={table}
          setTablesError={setTablesError}
          loadReservationsAndTables={loadReservationsAndTables}
        />
      </div> 
    </main>

  );
}

export default Dashboard;
