import React, { useState } from "react";
import ReservationList from "../reservations/ReservationList";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import "./search.css";

function Search() {
  const [error, setError] = useState(null);

  const [mobile_number, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [reservationMessage, setReservationMessage] = useState("");

  
  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  }

  const handleFind = (event) => {
    event.preventDefault();

    const abortController = new AbortController();
    listReservations({ mobile_number }, abortController.signal)
      .then((reservations) => setReservations(reservations))
      .then(setReservationMessage("No reservations found"))
      .catch((error) => setError(error));

    return () => abortController.abort();
  }

  return (
    <main>
      <div className="d-md-flex mb-3 justify-content-start">
        <h1>Reservation Search</h1>
        <ErrorAlert error={error} setError={setError} />
      </div>

    
      <div className="input-group mb-3" id="mobileSearchBox">
        <input 
          type="text" 
          name="mobile_number"
          className="form-control" 
          onChange={handleChange}
          value={mobile_number}
          placeholder="Enter a customer's phone number" 
          aria-label="Enter a customer's phone number" 
          aria-describedby="button-addon2" 
        />
        <button 
          className="btn" 
          type="submit" 
          id="button-addon2"
          onClick={handleFind}>
            Find
        </button>
      </div>

    
    <div className="reservationsList">
      {reservations.length ? 
        <ReservationList reservations={reservations} />
        :
        <h3>{reservationMessage}</h3>
      }
    </div>

    </main>
  );
}

export default Search;