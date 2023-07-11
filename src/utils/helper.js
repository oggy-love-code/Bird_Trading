import moment from "moment/moment";

export const formatDateTime = (date, inputFormat) => {
  var format = "DD-MM-yyyy HH:mm:ss";
  if (inputFormat) {
    format = inputFormat;
  }
  return moment(date).format(format);
};
