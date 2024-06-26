import React from "react";
import { cancelReservation } from "../utils/api";

function CancelButton({ reservation_id, setReservationsError, loadReservationsAndTables }) {

    const handleCancel = (e) => {
        e.preventDefault();
        const message = "Do you want to cancel this reservation? This cannot be undone.";
        if (window.confirm(message)) {
            cancelReservation(reservation_id, "cancelled")
            .then(() => loadReservationsAndTables())
            .catch(setReservationsError);
        }
    };

    return (
        <div>
            <button 
            type="button"
            className="btn btn-danger"
            onClick={handleCancel}
            data-reservation-id-cancel={reservation_id}>
                Cancel
            </button>

        </div>
    );

}   

export default CancelButton