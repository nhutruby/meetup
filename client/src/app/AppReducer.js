const UploadReducer = (state, action) => {
  if (state === undefined) 
    return {data: {}, loading: false};
  
  switch (action.type) {
    case "UPLOAD":
      return {
        ...state,
        loading: true
      };
    case "UPLOAD_FAIL":
      return {data: state, loading: false, error: action.message};
    case "UPLOAD_SUCCESS":
      return {data: action.data.groups, total_objects: action.data.meta.total_objects, loading: false, upload_status: true};
    case "LIST":
      return state;
    case "LIST_FAIL":
      return {data: state, error: action.message};
    case "LIST_SUCCESS":
      let groups = action.data.groups;
      groups.push.apply(groups, state.data);
      return {data: groups, total_objects: action.data.meta.total_objects};
    case "CHANGE_ROWS_PER_PAGE":
      return state;
    case "CHANGE_ROWS_PER_PAGE_FAIL":
      return {data: state, error: action.message};
    case "CHANGE_ROWS_PER_PAGE_SUCCESS":
      return {data: action.data.groups, total_objects: action.data.meta.total_objects};
    default:
      return state;
  }
};
export default UploadReducer;
