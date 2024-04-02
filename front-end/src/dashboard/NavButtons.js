import React from "react";
import { useHistory } from "react-router-dom";
import {today, previous, next} from "../utils/date-time";

function NavButtons({ currentDate }) {
    const history = useHistory();

    //handle previous day//
    const handlePrevious = (e) => {
        e.preventDefault();
        history.push(`/dashboard?date=${previous(currentDate)}`);
    }
    //handle today//
    const handleToday = (e) => {
        e.preventDefault();
        history.push(`/dashboard?date=${today()}`);
    }

    //handle next day//
    const handleNext = (e) => {
        e.preventDefault();
        history.push(`/dashboard?date=${next(currentDate)}`)
    }

    return (
        <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button">
            <div className="btn-group" role="group">
                <button
                    type="button"
                    className="btn btn-primary "
                    onClick={handlePrevious}>
                        Previous Day
                    </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleToday}>
                        Today
                    </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}>
                        Next Day
                    </button>
                </div>
        </div>
    );
}

export default NavButtons

