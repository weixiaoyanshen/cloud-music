import * as actionTypes from './constants';
import { fromJS } from 'immutable';
import { getHotSingerListRequest, getSingerListRequest } from '../../../api/request';

export const changeSingerList = data => ({
  type: actionTypes.CHANGE_SINGER_LIST,
  data: fromJS(data)
})

export const changeListOffset = (data) => ({
  type: actionTypes.CHANGE_LIST_OFFSET,
  data
});

//进场loading
export const changeEnterLoading = data => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
});

//滑动最底部loading
export const changePullUpLoading = data => ({
  type: actionTypes.CHANGE_PULL_UP_LOADING,
  data
});

//顶部下拉刷新loading
export const changePullDownLoading = data => ({
  type: actionTypes.CHANGE_PULL_DOWN_LOADING,
  data
});

// 第一次加载热门歌手
export const getHotSingerList = () => dispatch => {
  getHotSingerListRequest(0).then(res => {
    dispatch(changeSingerList(res.artists));
    dispatch(changeEnterLoading(false));
    dispatch(changePullDownLoading(false));
    dispatch(changeListOffset(res.artists.length));
  })
}

// 加载更多热门歌手
export const refreshMoreHotSingerList = () => (dispatch, getState) => {
  const listOffset = getState().getIn(['singers', 'listOffset']);
  const singerList = getState().getIn(['singers', 'singerList']).toJS();
  getHotSingerListRequest(listOffset).then(res => {
    const data = [...singerList, ...res.artists]
    dispatch(changeSingerList(data));
    dispatch(changeEnterLoading(false));
    dispatch(changePullUpLoading(false));
    dispatch(changeListOffset(data.length));
  })
}

//第一次加载对应类别的歌手
export const getSingerList = (category, alpha) => dispatch => {
  getSingerListRequest(category, alpha, 0).then(res => {
    dispatch(changeSingerList(res.artists));
    dispatch(changeEnterLoading(false));
    dispatch(changePullDownLoading(false));
  }).catch(() => {
    console.log('歌手数据获取失败');
  });
}

// 加载更多歌手
export const refreshMoreSingerList = (category, alpha) => (dispatch, getState) => {
  const pageCount = getState().getIn(['singers', 'pageCount']);
  const singerList = getState().getIn(['singers', 'singerList']).toJS();
  getSingerListRequest(category, alpha, pageCount).then(res => {
    dispatch(changeSingerList([...singerList, res.artists]));
    dispatch(changeEnterLoading(false));
    dispatch(changePullUpLoading(false));
  })
}
