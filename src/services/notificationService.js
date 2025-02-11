// Объект для хранения ID таймеров
const notificationTimers = {};

// Запрос разрешения на уведомления
export const requestNotificationPermission = () => {
  if (!("Notification" in window)) {
    console.log("Ваш браузер не поддерживает уведомления.");
    return;
  }

  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission !== "granted") {
        console.log("Разрешение на уведомления не предоставлено.");
      }
    });
  }
};

// Планирование уведомлений для заказа
export const scheduleNotification = (order) => {
  if (!("Notification" in window)) {
    console.log("Ваш браузер не поддерживает уведомления.");
    return;
  }

  if (Notification.permission !== "granted") {
    console.log("Разрешение на уведомления не предоставлено.");
    return;
  }

  const startTime = new Date(order.start).getTime();
  const now = Date.now();

  // Уведомление за час до начала
  const oneHourBefore = startTime - 60 * 60 * 1000;
  if (oneHourBefore > now) {
    const timerId = setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification(`Заказ "${order.title}"`, {
          body: `До начала заказа остался 1 час.`,
        });
      }
    }, oneHourBefore - now);

    // Сохраняем ID таймера
    if (!notificationTimers[order.id]) {
      notificationTimers[order.id] = [];
    }
    notificationTimers[order.id].push(timerId);
  }

  // Уведомление в момент начала
  if (startTime > now) {
    const timerId = setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification(`Заказ "${order.title}"`, {
          body: `Заказ начался.`,
        });
      }
    }, startTime - now);

    // Сохраняем ID таймера
    if (!notificationTimers[order.id]) {
      notificationTimers[order.id] = [];
    }
    notificationTimers[order.id].push(timerId);
  }
};

// Отмена уведомлений для заказа
export const cancelNotifications = (orderId) => {
  if (notificationTimers[orderId]) {
    // Отменяем все таймеры для этого заказа
    notificationTimers[orderId].forEach(timerId => {
      clearTimeout(timerId);
    });

    // Удаляем запись о таймерах для этого заказа
    delete notificationTimers[orderId];
  }
};