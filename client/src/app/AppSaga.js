import {call, put, take, fork} from 'redux-saga/effects';
import axios, {post} from 'axios';

function upload (params) {
  const url = '/groups/import';
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  return post (url, params, config);
}

function* workerUpload () {
  while (true) {
    try {
      const request = yield take ('UPLOAD');
      const file = request.payload;
      const response = yield call (upload, file);
      const data = response.data;
      yield put ({type: 'UPLOAD_SUCCESS', data});
    } catch (error) {
      yield put ({type: 'UPLOAD_FAIL', error});
    }
  }
}

function list (params) {
  return axios.get ('/groups', {params: params});
}

function* workerList () {
  while (true) {
    try {
      const request = yield take ('LIST');
      const params = request.payload;
      const response = yield call (list, params);
      const data = response.data;
      yield put ({type: 'LIST_SUCCESS', data});
    } catch (error) {
      yield put ({type: 'LIST_FAIL', error});
    }
  }
}

function* workerChangeRowsPerPage () {
  while (true) {
    try {
      const request = yield take ('CHANGE_ROWS_PER_PAGE');
      const params = request.payload;
      const response = yield call (list, params);
      const data = response.data;
      yield put ({type: 'CHANGE_ROWS_PER_PAGE_SUCCESS', data});
    } catch (error) {
      yield put ({type: 'CHANGE_ROWS_PER_PAGE_FAIL', error});
    }
  }
}

function remove (params) {
  return axios.post ('/groups/remove', params);
}

function* workerRemove () {
  while (true) {
    try {
      const request = yield take ('REMOVE');
      const params = request.payload;
      const response = yield call (remove, params);
      const data = response.data;
      yield put ({type: 'REMOVE_SUCCESS', data});
    } catch (error) {
      yield put ({type: 'REMOVE_FAIL', error});
    }
  }
}
function show (id) {
  return axios.get ('/groups/' + id);
}

function* workerShow () {
  while (true) {
    try {
      const request = yield take ('SHOW');
      const id = request.payload;
      const response = yield call (show, id);
      const data = response.data;
      yield put ({type: 'SHOW_SUCCESS', data});
    } catch (error) {
      yield put ({type: 'SHOW_FAIL', error});
    }
  }
}
function edit (params) {
  return axios.put ('/groups/' + params.id, params);
}

function* workerEdit () {
  while (true) {
    try {
      const request = yield take ('EDIT');
      const params = request.payload;
      const response = yield call (edit, params);
      const data = response.data;
      yield put ({type: 'EDIT_SUCCESS', data});
    } catch (error) {
      yield put ({type: 'EDIT_FAIL', error});
    }
  }
}
function newGroup (params) {
  return axios.post ('/groups', params);
}

function* workerNewGroup () {
  while (true) {
    try {
      const request = yield take ('NEW');
      const params = request.payload;
      const response = yield call (newGroup, params);
      const data = response.data;
      yield put ({type: 'NEW_SUCCESS', data});
    } catch (error) {
      yield put ({type: 'NEW_FAIL', error});
    }
  }
}
export default function* root () {
  yield fork (workerList);
  yield fork (workerUpload);
  yield fork (workerChangeRowsPerPage);
  yield fork (workerRemove);
  yield fork (workerShow);
  yield fork (workerEdit);
  yield fork (workerNewGroup);
}
