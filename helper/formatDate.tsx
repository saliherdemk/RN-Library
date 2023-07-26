export function formatDate(date: string) {
  let objectDate = new Date(date);

  let day = objectDate.getDate();

  let month = objectDate.getMonth().toString();

  let year = objectDate.getFullYear();

  let hours = objectDate.getHours();

  let minutes = objectDate.getMinutes();
  if (month.length == 1) {
    month = ("0" + month).toString();
  }
  let dateRes = day + "-" + month + "-" + year;
  let hoursRes = hours + ":" + minutes;

  return dateRes + " | " + hoursRes;
}
