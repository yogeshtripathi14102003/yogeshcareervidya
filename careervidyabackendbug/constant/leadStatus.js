export const ADMITTED_STATUS = "Admission Done";

export const LOST_STATUSES = [
  "Not Interested",
  "University Issue",
  "Fee Issue",
  "Distance Issue",
  "Language Issue",
  "Not Picked",
];

export const isTerminalStatus = (status) => status === ADMITTED_STATUS || LOST_STATUSES.includes(status);
