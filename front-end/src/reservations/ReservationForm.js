import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({ reservation, handleSubmit, handleChange }) {
    const history = useHistory();

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <div className="form-group">
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input 
                        type="text"
                        name="first_name"
                        id="first_name"
                        className="form-control"
                        onChange={handleChange}
                        value={`${reservation.first_name}`}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        className="form-control"
                        onChange={handleChange}
                        value={`${reservation.last_name}`}
                        required
                    />
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="mobile_number" className="form-label">Mobile Number</label>
                <input
                type="number"
                name="mobile_number"
                id="mobile_number"
                className="form-control"
                onChange={handleChange}
                value={`${reservation.mobile_number}`}
                required
                />

            </div>
            <div className="mb-3">
                <label htmlFor="date" className="form-label">Date</label>
                <input
                    type="date"
                    name="reservation_date"
                    id="reservation_date"
                    className="form-control"
                    onChange={handleChange}
                    value={`${reservation.reservation_date}`}
                    placeholder="YYYY-MM-DD"
                    required
                />

            </div>

            <div className="mb-3">
                <label htmlFor="time" className="form-label">Time</label>
                <input
                    type="time"
                    name="reservation_time"
                    id="reservation_time"
                    className="form-control"
                    onChange={handleChange}
                    value={`${reservation.reservation_time}`}
                    placeholder="HH:MM"
                    require
                />
            </div>

            <div className="mb-3">
                <label htmlFor="people" className="form-label">Party Size</label>
                <input
                    type="number"
                    name="people"
                    id="people"
                    className="form-control"
                    onChange={handleChange}
                    value={`${reservation.people}`}
                    min="1"
                    required
                />
            </div>

            <div >
                <button 
                    type="submit" 
                    class="btn btn-lg btn-primary btn-success" 
                    style={{marginRight: "15px"}}>
                        Reserve
                </button>
                <button 
                    type="button" 
                    class="btn btn-secondary btn-lg btn-danger"
                    onClick={() => history.go(-1)}>
                        Cancel
                </button>
            </div>


        </form>
    );
}

export default ReservationForm;