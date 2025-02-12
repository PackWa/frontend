const notificationTimers = {};

export const requestNotificationPermission = () => {
  if (!("Notification" in window)) {
    console.log("Your browser does not support notifications.");
    return;
  }

  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission !== "granted") {
        console.log("Notification permission was not granted.");
      }
    });
  }
};

export const scheduleNotification = (order) => {
  if (!("Notification" in window)) {
    console.log("Your browser does not support notifications.");
    return;
  }

  if (Notification.permission !== "granted") {
    console.log("Notification permission was not granted.");
    return;
  }

  const startTime = new Date(order.start).getTime();
  const now = Date.now();

  const oneHourBefore = startTime - 60 * 60 * 1000;
  if (oneHourBefore > now) {
    const timerId = setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification(`Order "${order.title}"`, {
          body: "1 hour left until the order starts.",
        });
      }
    }, oneHourBefore - now);

    if (!notificationTimers[order.id]) {
      notificationTimers[order.id] = [];
    }
    notificationTimers[order.id].push(timerId);
  }

  if (startTime > now) {
    const timerId = setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification(`Order "${order.title}"`, {
          body: "The order has started.",
        });
      }
    }, startTime - now);

    if (!notificationTimers[order.id]) {
      notificationTimers[order.id] = [];
    }
    notificationTimers[order.id].push(timerId);
  }
};

export const cancelNotifications = (orderId) => {
  if (notificationTimers[orderId]) {
    notificationTimers[orderId].forEach(timerId => {
      clearTimeout(timerId);
    });

    delete notificationTimers[orderId];
  }
};
