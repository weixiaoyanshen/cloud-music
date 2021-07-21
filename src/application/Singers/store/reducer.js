import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const initState = fromJS({
  singerList: [],
  enterLoading: true,
  pullUpLoading: false,   //控制上拉加载动画
  pullDownLoading: false, //控制下拉加载动画
  listOffset: 0            //这里是当前页数，我们即将实现分页功能
})

const reducer = (state = initState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_SINGER_LIST:
      return state.set('singerList', action.data);
    case actionTypes.CHANGE_LIST_OFFSET:
      return state.set('listOffset', action.data);
    default:
      return state;
  }
}

export default reducer;