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
    url: '/api/v1/me/notifications',
    method: 'GET',
  });
  return items || [];
};
