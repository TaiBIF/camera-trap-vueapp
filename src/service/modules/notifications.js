import fetchWrap from '@/utils/fetch';

export const getSystemAnnouncements = async () => {
  const { items } = await fetchWrap({
    url: '/api/v1/system-announcements',
    method: 'GET',
  });
  return items || [];
};

export const getNotifications = async () => {
  const { items } = await fetchWrap({
    url: '/api/v1/me/notifications?index=0&size=20',
    method: 'GET',
  });
  return items || [];
};

export const postNotificationsRead = async () => {
  const data = await fetchWrap({
    url: '/api/v1/me/notifications/_read',
    method: 'POST',
  });
  return data;
};
