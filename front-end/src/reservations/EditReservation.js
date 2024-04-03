import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function EditReservation() {
    const history = useHistory();
    const { reservation_id } = useParams();

    const [error, setError] = useState(null);
    const [reservation, setReservation] = useState({});

    useEffect(() => {
        const abortController = new AbortController();

        async function loadReservation() {
            try {
                const response = await readReservation(reservation_id, abortController.signal);
                setReservation(response);
            } catch (error) {
                setError(error);
            }
        }

        loadReservation();

        return () => {
            abortController.abort();
        };
    }, [reservation_id]);

    const handleChange = ({ target }) => {
        setReservation({ ...reservation, [target.name]: target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const abortController = new AbortController();
        try {
            await updateReservation(reservation, abortController.signal);
            history.push(`/dashboard?date=${reservation.reservation_date.slice(0, 10)}`);
        } catch (error) {
            setError(error);
        } finally {
            abortController.abort();
        }
    };

    return (
        <main>
            <div className="d-md-flex mb-3 flex-column">
                <h1>Edit Reservation</h1>
                <ErrorAlert error={error} setError={setError} />
            </div>

            <ReservationForm
                reservation={reservation}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
            />
        </main>
    );
}

export default EditReservation;