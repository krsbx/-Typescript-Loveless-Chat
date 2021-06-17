type MessageContent = {
  to: string;
  sound: string;
  title: string;
  body: string;
  data?: {
    id: string;
    chatName: string;
    currentMode: string;
  };
};

export const sendPushNotification = async ({
  to,
  sound = 'default',
  title,
  body,
  data,
}: MessageContent) => {
  const message: MessageContent = {
    to: to,
    sound: sound,
    title: title,
    body: body,
    data: data,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
};
