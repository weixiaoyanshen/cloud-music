import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const initState = fromJS({
  currentAlbum: {},
  enterLoading: false
});

const reducer = (state = initState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_CURRENT_ALBUM:
      return state.set('currentAlbum', action.data);
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    default:
      return state;
  }
}

export default reducer;