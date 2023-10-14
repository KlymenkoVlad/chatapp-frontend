import dayjs from "dayjs";

const dateFormat = (date: string) => {
  if (!date) return "";
  const messageDate = dayjs(date);

  // Get the current date using dayjs
  const currentDate = dayjs();

  // Check if the date is today
  const isToday = messageDate.isSame(currentDate, "day");

  // Check if the date is in the current week
  const isSameWeek = messageDate.isSame(currentDate, "week");

  // Format the date based on the conditions
  return isToday
    ? messageDate.format("HH:mm") // Today: Format as time
    : isSameWeek
    ? messageDate.format("dddd") // In the current week: Format as day of the week
    : messageDate.format("DD.MM.YYYY"); // Not in the current week: Format as full date
};

export default dateFormat;
