const UploadReducer = (state, action) => {
  if (state === undefined) return {data: {}, loading: false};

  switch (action.type) {
    case 'UPLOAD':
      return {
        ...state,
        loading: true,
      };
    case 'UPLOAD_FAIL':
      return {...state, loading: false, error: action.message};
    case 'UPLOAD_SUCCESS':
      return {
        data: action.data.groups,
        total_objects: action.data.meta.total_objects,
        error: false,
        loading: false,
      };
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
    case 'REMOVE':
      return {...state, error: null};
    case 'REMOVE_FAIL':
      return {...state};
    case 'REMOVE_SUCCESS':
      let remove;
      let add;
      action.data.delete_ids.forEach (function (id) {
        remove = state.data
          .map (function (i) {
            return i.id;
          })
          .indexOf (id);
        if (remove !== -1) {
          state.data.splice (remove, 1);
          state.total_objects = action.data.meta.total_objects;
        }
      });
      action.data.groups.forEach (group => {
        add = state.data
          .map (function (i) {
            return i.id;
          })
          .indexOf (group.id);
        if (add === -1) {
          state.data.push (group);
        }
      });
      return {
        ...state,
        error: false,
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
    case 'SHOW_CACHE':
      return {...state, id: action.payload};
    case 'EDIT':
      return state;
    case 'EDIT_FAIL':
      return {...state, error: action.error.response.data.error};
    case 'EDIT_SUCCESS':
      state.data.forEach (function (i) {
        if (i.id === action.data.id) {
          i.name = action.data.name;
        }
      });
      return {...state, error: false};
    case 'EDIT_SHOW':
      return {...state, error: null};
    case 'NEW':
      return {...state, error: null};
    case 'NEW_FAIL':
      return {...state, error: action.error.response.data.error};
    case 'NEW_SUCCESS':
      return {
        data: action.data.groups,
        total_objects: action.data.meta.total_objects,
        error: false,
      };
    case 'NEW_SHOW':
      return {...state, error: null};
    default:
      return state;
  }
};
export default UploadReducer;
