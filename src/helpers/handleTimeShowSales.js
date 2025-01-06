export const handleTimeShowSales = ({
  salesData,
  popup,
  hasUpdatedForNone,
  daysCounter,
  handleUpdateStoreAvailability,
  setDaysCounter,
  setHasUpdatedForNone
}) => {
  if (!salesData || !salesData.isAllAvailables) return { shouldShow: false, updateInterval: null };

  const now = new Date();
  const eventDate = new Date(salesData.eventDate);
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const timeUntilMidnight = midnight.getTime() - now.getTime();

  if (isNaN(eventDate)) return { shouldShow: false, updateInterval: null };

  const handleMidnightUpdate = () => {
    handleUpdateStoreAvailability();
    setDaysCounter(prev => prev + 1);
  };

  let shouldShow = false;
  let updateInterval = null;

  switch (salesData.repeatFrequency) {
    case "NONE":
      shouldShow = now.toDateString() === eventDate.toDateString();
      if (!hasUpdatedForNone && popup.PopUpShowSales === false) {
        handleUpdateStoreAvailability();
        setHasUpdatedForNone(true);
      }
      break;

    case "DAILY":
      shouldShow = true;
      updateInterval = setTimeout(() => {
        handleMidnightUpdate();
        updateInterval = setTimeout(handleMidnightUpdate, timeUntilMidnight);
      }, timeUntilMidnight);
      break;

    case "WEEKLY": {
      shouldShow = now.getDay() === eventDate.getDay();
      if (daysCounter < 7) {
        updateInterval = setTimeout(() => {
          handleMidnightUpdate();
          updateInterval = setTimeout(handleMidnightUpdate, timeUntilMidnight);
        }, timeUntilMidnight);
      } else {
        setDaysCounter(0);
      }
      break;
    }

    case "MONTHLY": {
      shouldShow = now.getFullYear() === eventDate.getFullYear() && 
                  now.getMonth() === eventDate.getMonth();
      const daysInMonth = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth() + 1,
        0
      ).getDate();

      if (daysCounter < daysInMonth) {
        updateInterval = setTimeout(() => {
          handleMidnightUpdate();
          updateInterval = setTimeout(handleMidnightUpdate, timeUntilMidnight);
        }, timeUntilMidnight);
      } else {
        setDaysCounter(0);
      }
      break;
    }

    default:
      shouldShow = false;
  }

  if (salesData.isAllDay) {
    return { shouldShow, updateInterval };
  }

  if (salesData.startTime && salesData.endTime) {
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMinute] = salesData.startTime.split(":").map(Number);
    const [endHour, endMinute] = salesData.endTime.split(":").map(Number);
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    if (startTimeInMinutes <= endTimeInMinutes) {
      shouldShow = shouldShow && 
                  currentTime >= startTimeInMinutes && 
                  currentTime <= endTimeInMinutes;
    } else {
      shouldShow = shouldShow && 
                  (currentTime >= startTimeInMinutes || 
                   currentTime <= endTimeInMinutes);
    }
  }

  return { shouldShow, updateInterval };
};