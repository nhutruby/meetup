const UploadReducer = (state, action) => {
  if (state === undefined) return {data: {}, loading: false};

  switch (action.type) {
    case 'UPLOAD':
      return {
        ...state,
        loading: true,
      };
    case 'UPLOAD_FAIL':
      return {data: state, loading: false, error: action.message};
    case 'UPLOAD_SUCCESS':
      return {loading: false, upload_status: true};
    case 'LIST':
      return state;
    case 'LIST_FAIL':
      return {data: state, error: action.message};
    case 'LIST_SUCCESS':
      let groups = action.data.groups;
      groups.push.apply (groups, state.data);
      return {data: groups, total_objects: action.data.meta.total_objects};
    case 'CHANGE_ROWS_PER_PAGE':
      return state;
    case 'CHANGE_ROWS_PER_PAGE_FAIL':
      return {data: state, error: action.message};
    case 'CHANGE_ROWS_PER_PAGE_SUCCESS':
      return {
        data: action.data.groups,
        total_objects: action.data.meta.total_objects,
      };
    case 'DELETE':
      return state;
    case 'DELETE_FAIL':
      return {data: state, error: action.message};
    case 'DELETE_SUCCESS':
      let id = null;
      if (action.data.delete_id) {
        id = action.data.delete_id;
      } else {
        id = action.data.id;
      }
      const remove = state.data
        .map (function (i) {
          return i.id;
        })
        .indexOf (id);
      if (remove !== -1) {
        state.data.splice (remove, 1);
      }
      if (action.data.delete_id) {
        const delete_index = state.data
          .map (function (i) {
            return i.id;
          })
          .indexOf (action.data.id);
        if (delete_index === -1) {
          state.data.push (action.data);
        }
      }
      return {
        ...state,
        data: state.data,
        total_objects: state.total_objects - 1,
      };
    case 'SHOW':
      return state;
    case 'SHOW_FAIL':
      return {data: state, error: action.message};
    case 'SHOW_SUCCESS':
      state.data.forEach (function (i) {
        if (i.id === action.data.id) {
          i.meets = action.data.meets;
          i.name = action.data.name;
        }
      });
      return {...state, id: action.data.id};
    case 'EDIT':
      return state;
    case 'EDIT_FAIL':
      console.log (action.error.response.data.error);
      console.log ('fail');
      return {...state, error: action.error.response.data.error};
    case 'EDIT_SUCCESS':
      state.data.forEach (function (i) {
        if (i.id === action.data.id) {
          i.name = action.data.name;
        }
      });
      return {...state, error: null};
    default:
      return state;
  }
};
export default UploadReducer;
