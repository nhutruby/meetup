export const upload = file => {
  return {type: 'UPLOAD', payload: file};
};
export const uploadSuccess = () => {
  return {type: 'UPLOAD_SUCCESS'};
};
export const uploadFail = error => {
  return {type: 'UPLOAD_FAIL', error: error};
};
