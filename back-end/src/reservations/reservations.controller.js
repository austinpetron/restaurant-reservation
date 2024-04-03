const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { today } = require("../utils/date-time");
/**
 * List handler for reservation resources
 */


//GET
async function list(req, res) {
  if (req.query.date) {
    const data = await service.list(req.query.date);
    res.json({ data });
  } else if (req.query.mobile_number) {
    const data = await service.search(req.query.mobile_number);
    res.json({ data });
  } else {
    const data = await service.list(today());
    res.json({ data });
  }
}


//variable to confirm properties
const VALID_PROPERTIES = [
  "reservation_id",
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "created_at",
  "updated_at"
];

//validation middleware to check whether the request body contains fields
function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({ status: 400, message: "Body must have data property"});
};


//middleware for validationg properties 
function hasProperties(...properties) {
  return function (req, res, next) {
    const { data = {} } = req.body;

    try {
      properties.forEach((property) => {
        if (!data[property]) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

function hasValidDate(req, res, next) {
  const { reservation_date } = req.body.data || {};

  const dateRegex = /^(?<year>\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[1-2][0-9]|3[0-1])$/;

  if (!dateRegex.test(reservation_date)) {
    return next({ status: 400, message: "reservation_date must be a valid date" });
  }

  next();
}

function hasValidTime(req, res, next) {
  const { reservation_time } = req.body.data || {};

  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!reservation_time || !timeRegex.test(reservation_time)) {
    return next({ status: 400, message: "reservation_time must be a valid time" });
  }

  next();
}

function peopleIsNumber(req, res, next) {
  const { data: {people } = {} } = req.body;
  if (!Number.isInteger(people)) {
    next({ status: 400, message: "people must be a number"});
  }
  next();
}

function isNotTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const dateString = reservation_date.split("-");
  const date = new Date(
    Number(dateString[0]),
    Number(dateString[1])-1,
    Number(dateString[2]),
    0,
    0,
    1
  );
  if (date.getDay() === 2) {
    next({ status: 400, message: "restaurant is closed on Tuesdays"})
  } else {
    next();
  }
}

function isNotPastDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const [hour, minute] = reservation_time.split(":");
  let [year, month, day] = reservation_date.split("-");
  month -= 1;
  const reservationDate = new Date(year, month, day, hour, minute, 59, 59).getTime();
  const today = new Date().getTime();

  if (reservationDate > today) {
    next();
  } else {
    next({
      status: 400,
      message: "reservation date and time must be set in the future",
    });
  }
};

function isWithinBusinessHours(req, res, next) {
  const { reservation_time } = req.body.data;
  if (reservation_time >= "10:30" && reservation_time <= "21:30") {
    next();
  } else {
    next({
      status: 400,
      message: "reservation time must be within business hours"
    });
  }
}

function hasDefaultBookedStatus(req, res, next) {
  const { status } = req.body.data;
  if (status && status !== "booked") {
    next({ status: 400, message: `A new reservation cannot have a status of ${status}` });
  } else {
    next();
  }
}

function isValidReservationStatus(req, res, next) {
  const { status } = req.body.data || {};

  if (!["booked", "seated", "finished", "cancelled"].includes(status)) {
    return next({
      status: 400,
      message: `Invalid status: ${status}. Status must be one of "booked", "seated", or "finished".`,
    });
  }

  next();
}

 function isFinished(req, res, next) {
  const currentStatus = res.locals.reservation.status;
  if (currentStatus === "finished") {
    next({ status: 400, message: "A finished reservation cannot be updated." });
  } else {
    next();
  }
 }


async function reservationExists(req, res, next) {
  const reservation_id = req.params.reservation_id;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `reservation ${reservation_id} does not exist`})
}

//POST
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data: data});
}

//READ
function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

//Update
async function updateReservation(req, res) {
const updatedReservation = {
  ...req.body.data,
  reservation_id: res.locals.reservation.reservation_id,
}
const data = await service.update(updatedReservation);
res.json({ data });
}

async function updateStatus(req, res, next) {
  const validStatuses = ["booked", "seated", "finished", "cancelled"];
  const { status } = req.body.data
  const { reservation_id } = res.locals.reservation
  if (status && !validStatuses.includes(status)) {
    next({
      status: 400,
      message: `Invalid status: '${status}.' Status must be either 'booked', 'seated', 'finished,' or 'cancelled.' `
    });
  } else {
    const data = await service.updateStatus(reservation_id, status);
    res.json({ data })
  }
}

module.exports = {
  create: [ 
    hasData, 
    hasProperties("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"), 
    hasValidDate,
    peopleIsNumber,
    hasValidTime,
    isNotTuesday,
    isNotPastDate,
    isWithinBusinessHours,
    hasDefaultBookedStatus,
    asyncErrorBoundary(create) ],

  list: asyncErrorBoundary(list),

  read: [
    asyncErrorBoundary(reservationExists),
    read,
  ],

  update: [
    hasData,
    hasProperties("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"),
    hasValidDate,
    peopleIsNumber,
    hasValidTime,
    isNotTuesday,
    isNotPastDate,
    isWithinBusinessHours,
    hasDefaultBookedStatus,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updateReservation),
  ],

  updateStatus: [
    hasData,
    asyncErrorBoundary(reservationExists),
    isValidReservationStatus,
    isFinished,
    asyncErrorBoundary(updateStatus),
  ],
};
