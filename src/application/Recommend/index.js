import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Slider from '../../components/slider';
import Loading from '../../baseUI/loading';
import RecommendList from '../../components/list';
import * as actionTypes from './store/actionCreators';

function Recommend() {
  const bannerList = useSelector(state => state.getIn(['recommend', 'bannerList']));
  const recommendList = useSelector(state => state.getIn(['recommend', 'recommendList']));
  const enterLoading = useSelector(state => state.getIn(['recommend', 'enterLoading']));
  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];

  const dispatch = useDispatch();

  useEffect (() => {
    if(!bannerList.size) {
      dispatch(actionTypes.getBannerList());
    }
  }, [bannerList.size, dispatch]);

  useEffect (() => {
    if(!recommendList.size) {
      dispatch(actionTypes.getRecommendList());
    }
  }, [recommendList.size, dispatch]);

  return (
    <div>
      <Slider bannerList={bannerListJS}></Slider>
      <RecommendList recommendList={recommendListJS}></RecommendList>
      { enterLoading ? <Loading></Loading> : null }
    </div>
  )
}

export default React.memo(Recommend);
