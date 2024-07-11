const formatTime = (time) => {
  const date = new Date(time);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  if (hour === 0 && minute === 0) {
    return `${day - 1 < 10 ? `0${day - 1}` : day - 1}-${
      month < 10 ? `0${month}` : month
    }-${year}`;
  }
  return `${day < 10 ? `0${day}` : day}-${
    month < 10 ? `0${month}` : month
  }-${year} ${hour < 10 ? `0${hour}` : hour}:${
    minute < 10 ? `0${minute}` : minute
  }`;
};

export default formatTime;
