import React, { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import LazyLoad, {forceCheck} from 'react-lazyload';
import Horizon from '../../baseUI/horizon-item';
import { categoryTypes, alphaTypes } from '../../api/config';
import { NavContainer, ListContainer, List, ListItem } from './style';
import Scroll from '../../baseUI/scroll';
import Loading from '../../baseUI/loading';
import {
  changeAlpha,
  changeCategory,
  getHotSingerList,
  refreshMoreHotSingerList,
  getSingerList,
  refreshMoreSingerList,
  changePullUpLoading,
  changePullDownLoading,
  changeListOffset,
} from './store/actionCreators';

function Singers(props) {
  const singerList = useSelector(state => state.getIn(['singers', 'singerList']));
  const category = useSelector(state => state.getIn(['singers', 'category']));
  const alpha = useSelector(state => state.getIn(['singers', 'alpha']));
  const enterLoading = useSelector(state => state.getIn(['singers', 'enterLoading']));
  const pullUpLoading = useSelector(state => state.getIn(['singers', 'pullUpLoading']));
  const pullDownLoading = useSelector(state => state.getIn(['singers', 'pullDownLoading']));
  const singerListJS = singerList ? singerList.toJS() : [];
  const dispatch = useDispatch();

  useEffect(() => {
    if(!singerList.size) {
      dispatch(getHotSingerList());
    }
  }, [singerList, dispatch])

  const handleUpdateCategory = val => {
    if(val === category) return;
    dispatch(changeCategory(val));
    dispatch(getSingerList())
  }

  const handleUpdateAlpha = val => {
    if(val === alpha) return;
    dispatch(changeAlpha(val));
    dispatch(getSingerList())
  }

  const handlePullUp = () => {
    dispatch(changePullUpLoading(true));
    if(!alpha && !category) {
      dispatch(refreshMoreHotSingerList());
    } else {
      dispatch(refreshMoreSingerList());
    }
  }

  const handlePullDown = () => {
    dispatch(changePullDownLoading(true));
    dispatch(changeListOffset(0));
    if(!alpha && !category) {
      dispatch(getHotSingerList());
    } else {
      dispatch(getSingerList());
    }
  }

  const enterDetail = id => {
    props.history.push (`/singers/${id}`);
  }

  const renderSingerList = () => (
    <List>
      {
        singerListJS.map((item) => (
          <ListItem key={item.id} onClick={() => enterDetail(item.id)}>
            <div className="img_wrapper">
              <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png').default} alt="music"/>}>
                <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
              </LazyLoad>
            </div>
            <span className="name">{item.name}</span>
          </ListItem>
        ))
      }
    </List>
  )

  return (
    <div>
      <NavContainer>
        <Horizon
          list={categoryTypes}
          title="?????? (????????????):"
          oldVal={category}
          handleClick={handleUpdateCategory}
        />
        <Horizon 
          list={alphaTypes} 
          title="?????????:"
          oldVal={alpha}
          handleClick={handleUpdateAlpha}
        />
      </NavContainer>
      <ListContainer>
        <Scroll
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
          onScroll={forceCheck}
        >
          {renderSingerList()}
        </Scroll>
        <Loading show={enterLoading}></Loading>
      </ListContainer>
      {renderRoutes(props.route.routes)}
    </div>
  )
}

export default memo(Singers);
