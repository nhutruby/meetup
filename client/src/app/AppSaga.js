import {call, put, take, fork} from "redux-saga/effects";
import axios, {post} from "axios";

function upload(file) {
  const url = "/groups/import";
  const formData = new FormData();
  formData.append("file", file);
  const config = {
    headers: {
      "content-type": "multipart/form-data"
    }
  };
  return post(url, formData, config);
}

function* workerUpload() {
  while (true) {
    try {
      const request = yield take("UPLOAD");
      const file = request.payload;
      const response = yield call(upload, file);
      const data = response.data;
      yield put({type: "UPLOAD_SUCCESS", data});
    } catch (error) {
      yield put({type: "UPLOAD_FAIL", error});
    }
  }
}

function list(params) {
  return axios.get("/groups", {params: params});
}

function* workerList() {
  while (true) {
    try {
      const request = yield take("LIST");
      const params = request.payload;
      const response = yield call(list, params);
      const data = response.data;
      yield put({type: "LIST_SUCCESS", data});
    } catch (error) {
      yield put({type: "LIST_FAIL", error});
    }
  }
}
export default function* root() {
  yield fork(workerList);
  yield fork(workerUpload);
}
