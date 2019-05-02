import {call, put, take, fork} from 'redux-saga/effects';
import {post} from 'axios';

function upload (file) {
  const url = '/groups/import';
  const formData = new FormData ();
  formData.append ('file', file);
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  return post (url, formData, config);
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
      console.log (error);
      yield put ({type: 'UPLOAD_FAIL', error});
    }
  }
}
export default function* watcherUpload () {
  yield fork (workerUpload);
}
