export const upload = file => {
  return {type: "UPLOAD", payload: file};
};
export const uploadSuccess = () => {
  return {type: "UPLOAD_SUCCESS"};
};
export const uploadFail = error => {
  return {type: "UPLOAD_FAIL", error: error};
};
export const list = params => {
  return {type: "LIST", payload: params};
};
export const listSuccess = () => {
  return {type: "LIST_SUCCESS"};
};
export const listFail = error => {
  return {type: "LIST_FAIL", error: error};
};