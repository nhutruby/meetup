const UploadReducer = (state, action) => {
  if (state === undefined) 
    return {uploading: false};
  
  switch (action.type) {
    case "UPLOAD":
      return {
        ...state,
        uploading: true
      };
    case "UPLOAD_FAIL":
      return {
        ...state,
        uploading: false
      };
    case "UPLOAD_SUCCESS":
      console.log(action);
      state = action.data;
      return {
        ...state,
        uploading: false
      };
    default:
      return state;
  }
};
export default UploadReducer;
