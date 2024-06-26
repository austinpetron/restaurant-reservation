import React from "react";
import { Link } from "react-router-dom"
import CancelButton from "./CancelButton";
import "./ReservationCard.css"

function ReservationCard({
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
    setReservationsError,
    loadReservationsAndTables
}) {

    return (
        <div className="card h-100 w-100 mb-3">
            <h3 className="card-header d-flex justify-content-between align-items-center">
                {first_name} {last_name}
                {status === "booked" && <Link
                    type="button"
                    className="btn btn-primary"
                    to={`/reservations/${reservation_id}/edit`}>
                        Edit
                    </Link> }
            </h3>

            <div className="card-body">
                <h4 className="card-title">{reservation_time}, {reservation_date}</h4>
                <h5 className="card-subtitle mb-2 text-muted">Party Size: {people}</h5>
                <h5 className="card-subtitle mb-2 text-muted">Mobile Number: {mobile_number}</h5>
            </div>
            
            <div
                className="card-footer border-secondary text-secondary"
                id="resCardFooter">
                    {status === "booked" && 
                        <Link
                            className="btn btn-primary"
                            id="seatButton"
                            to={`/reservations/${reservation_id}/seat`}
                            role="button">
                            Seat
                        </Link>}

                <h5>
                    <span 
                        className="badge text-light"
                        id="statusBadge"
                        data-reservation-id-status={reservation_id}>
                            {status}
                    </span>
                </h5>

                {status === "booked" && 
                    <CancelButton
                    reservation_id={reservation_id}
                    setReservationsError={setReservationsError}
                    loadReservationsAndTables={loadReservationsAndTables}
                    />}
            </div>
        </div>
    );
}

export default ReservationCard;