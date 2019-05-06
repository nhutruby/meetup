export const upload = params => {
  return {type: 'UPLOAD', payload: params};
};
export const uploadSuccess = () => {
  return {type: 'UPLOAD_SUCCESS'};
};
export const uploadFail = error => {
  return {type: 'UPLOAD_FAIL', error: error};
};
export const list = params => {
  return {type: 'LIST', payload: params};
};
export const listSuccess = () => {
  return {type: 'LIST_SUCCESS'};
};
export const listFail = error => {
  return {type: 'LIST_FAIL', error: error};
};
export const changeRowsPerPage = params => {
  return {type: 'CHANGE_ROWS_PER_PAGE', payload: params};
};
export const changeRowsPerPageSuccess = () => {
  return {type: 'CHANGE_ROWS_PER_PAGE_SUCCESS'};
};
export const changeRowsPerPageFail = error => {
  return {type: 'CHANGE_ROWS_PER_PAGE_FAIL', error: error};
};
export const remove = params => {
  return {type: 'REMOVE', payload: params};
};
export const removeSuccess = () => {
  return {type: 'REMOVE_SUCCESS'};
};
export const removeFail = error => {
  return {type: 'REMOVE_FAIL', error: error};
};
export const show = id => {
  return {type: 'SHOW', payload: id};
};
export const showSuccess = () => {
  return {type: 'SHOW_SUCCESS'};
};
export const showFail = error => {
  return {type: 'SHOW_FAIL', error: error};
};
export const showCache = id => {
  return {type: 'SHOW_CACHE', payload: id};
};
export const edit = params => {
  return {type: 'EDIT', payload: params};
};
export const editSuccess = () => {
  return {type: 'EDIT_SUCCESS'};
};
export const editFail = error => {
  return {type: 'EDIT_FAIL', error: error};
};
export const editShow = error => {
  return {type: 'EDIT_SHOW'};
};
export const newGroup = params => {
  return {type: 'NEW', payload: params};
};
export const newGroupSuccess = () => {
  return {type: 'NEW_SUCCESS'};
};
export const newGroupFail = error => {
  return {type: 'NEW_FAIL', error: error};
};
export const newShow = error => {
  return {type: 'NEW_SHOW'};
};
