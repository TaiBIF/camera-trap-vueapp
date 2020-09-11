export const acceptDef = {
  image: 'image/jpeg,image/pjpeg,image/png',
  csv: 'text/csv,text/plain',
  excel:
    'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip,application/x-zip-compressed',
  video:
    'video/mp4,application/x-troff-msvideo,video/avi,video/msvideo,video/x-msvideo,video/quicktime,video/mpeg',
};

export default Object.values(acceptDef).join(',');
