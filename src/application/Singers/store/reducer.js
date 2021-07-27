import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const initState = fromJS({
  singerList: [],
  alpha: '',
  category: '',
  enterLoading: true,
  pullUpLoading: false, // 控制上拉加载动画
  pullDownLoading: false, // 控制下拉加载动画
  listOffset: 0, // 这里是当前页数，我们即将实现分页功能
})

const reducer = (state = initState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_SINGER_LIST:
      return state.set('singerList', action.data);
    case actionTypes.CHANGE_LIST_OFFSET:
      return state.set('listOffset', action.data);
    case actionTypes.CHANGE_ALPHA:
      return state.set('alpha', action.data);
    case actionTypes.CHANGE_CATEGORY:
      return state.set('category', action.data);
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    case actionTypes.CHANGE_PULL_UP_LOADING:
      return state.set('pullUpLoading', action.data);
    case actionTypes.CHANGE_PULL_DOWN_LOADING:
      return state.set('pullDownLoading', action.data);
    default:
      return state;
  }
}

export default reducer;