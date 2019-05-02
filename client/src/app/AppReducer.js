const UploadReducer = (state, action) => {
  if (state === undefined) 
    return {data: {}, uploading: false};
  
  switch (action.type) {
    case "UPLOAD":
      return {
        ...state,
        uploading: true
      };
    case "UPLOAD_FAIL":
      return {
        ...state,
        uploading: false,
        error: action.message
      };
    case "UPLOAD_SUCCESS":
      state = action.data;
      return {
        ...state,
        uploading: false
      };
    case "LIST":
      return state;
    case "LIST_FAIL":
      return {data: state, error: action.message};
    case "LIST_SUCCESS":
      state = action.data.groups;
      console.log(action.data.groups);
      return {data: state, total_objects: action.data.meta.total_objects};
    default:
      return state;
  }
};
export default UploadReducer;
