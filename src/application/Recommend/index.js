import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import Slider from '../../components/slider';
import Loading from '../../baseUI/loading';
import RecommendList from '../../components/list';
import * as actionTypes from './store/actionCreators';
import Scroll from '../../baseUI/scroll';
import { Content } from './style';
import { forceCheck } from 'react-lazyload';

function Recommend(props) {
  const bannerList = useSelector(state => state.getIn(['recommend', 'bannerList']));
  const recommendList = useSelector(state => state.getIn(['recommend', 'recommendList']));
  const enterLoading = useSelector(state => state.getIn(['recommend', 'enterLoading']));
  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];
  const songsCount = useSelector(state => state.getIn(['player', 'playList']).size);

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
    <Content style={{bottom: songsCount > 0 ? '60px' : '0'}}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
          <Loading show={enterLoading}></Loading>
      </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Content>
  )
}

export default React.memo(Recommend);
