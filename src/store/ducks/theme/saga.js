import { put, takeLatest } from 'redux-saga/effects'
import * as actions from 'store/ducks/theme/actions'
import * as constants from 'store/ducks/theme/constants'
import axios from 'axios'

/**
 *
 */
function* handleThemeFetchRequest() {
  const data = yield axios.get('https://d3dclx0mrf3ube.cloudfront.net/themes.json')
  return data.data
}

/**
 * 
 */
function* themeFetchRequest() {
  try {
    const data = yield handleThemeFetchRequest()
    yield put(actions.themeFetchSuccess({ data }))
  } catch (error) {
    yield put(actions.themeFetchFailure({ message: error.message }))
  }
}

/**
 * 
 */
function* themePreviewRequest(req) {
  try {
    yield put(actions.themePreviewSuccess({ data: req.payload }))
  } catch (error) {
    yield put(actions.themePreviewFailure({ message: error.message }))
  }
}

export default () => [
  takeLatest(constants.THEME_FETCH_REQUEST, themeFetchRequest),
  takeLatest(constants.THEME_PREVIEW_REQUEST, themePreviewRequest),
]