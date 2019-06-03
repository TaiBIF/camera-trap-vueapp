export const acceptDef = {
  image: 'image/jpeg,image/pjpeg,image/png',
  csv: 'text/csv',
  zip: 'application/zip',
  video:
    'video/mp4,application/x-troff-msvideo,video/avi,video/msvideo,video/x-msvideo,video/quicktime,video/mpeg',
};

export default Object.values(acceptDef).join(',');
