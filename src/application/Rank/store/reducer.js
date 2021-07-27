import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const initState = fromJS({
  rankList: [],
  loading: true
})

const reducer = (state = initState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_RANK_LIST:
      return state.set('rankList', action.data);
    case actionTypes.CHANGE_LOADING:
      return state.set('loading', action.data);
    default:
      return state;
  }
}

export default reducer;