import * as actionTypes from './constants';
import { fromJS } from 'immutable';
import { getRankListRequest } from '../../../api/request';

export const changeRankList = data => ({
  type: actionTypes.CHANGE_RANK_LIST,
  data: fromJS(data)
});

export const changeLoading = (data) => ({
  type: actionTypes.CHANGE_LOADING,
  data
});

export const getRankList = () => {
  return (dispatch) => {
    getRankListRequest().then(data => {
      dispatch(changeRankList(data.list));
      dispatch(changeLoading(false))
    })
  }
};
