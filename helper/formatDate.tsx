export function formatDate(date: string) {
  const objectDate = new Date(date);

  const day = objectDate.getDate().toString().padStart(2, "0");
  const month = (objectDate.getMonth() + 1).toString().padStart(2, "0");
  const year = objectDate.getFullYear();
  const hours = objectDate.getHours().toString().padStart(2, "0");
  const minutes = objectDate.getMinutes().toString().padStart(2, "0");

  const dateRes = `${day}-${month}-${year}`;
  const hoursRes = `${hours}:${minutes}`;

  return `${dateRes} | ${hoursRes}`;
}
