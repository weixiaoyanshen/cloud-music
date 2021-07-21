import React, { useState, memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Horizon from '../../baseUI/horizon-item';
import { categoryTypes, alphaTypes } from '../../api/config';
import { NavContainer, ListContainer, List, ListItem } from './style';
import Scroll from '../../baseUI/scroll';
import {
  changeListOffset,
  getHotSingerList,
  refreshMoreHotSingerList,
  getSingerList,
  refreshMoreSingerList,
} from './store/actionCreators';

function Singers() {
  const [category, setCategory] = useState('');
  const [alpha, setAlpha] = useState('');
  const singerList = useSelector(state => state.getIn(['singers', 'singerList']));
  const singerListJS = singerList ? singerList.toJS() : [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHotSingerList());
  }, [dispatch])

  const handleUpdateCategory = val => {
    setCategory(val)
  }

  const handleUpdateAlpha = val => {
    setAlpha(val)
  }

  const handlePullUp = () => {
    dispatch(refreshMoreHotSingerList());
  }

  const renderSingerList = () => (
    <List>
      {
        singerListJS.map((item) => (
          <ListItem key={item.id}>
            <div className="img_wrapper">
              <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
            </div>
            <span className="name">{item.name}</span>
          </ListItem>
        ))
      }
    </List>
  )

  return (
    <NavContainer>
      <Horizon
        list={categoryTypes}
        title="分类 (默认热门):"
        oldVal={category}
        handleClick={handleUpdateCategory}
      />
      <Horizon 
        list={alphaTypes} 
        title="首字母:"
        oldVal={alpha}
        handleClick={handleUpdateAlpha}
      />
      <ListContainer>
        <Scroll
          pullUp={handlePullUp}
          // pullDown = { handlePullDown }
        >
          {renderSingerList()}
        </Scroll>
      </ListContainer>
    </NavContainer>
  )
}

export default memo(Singers);
