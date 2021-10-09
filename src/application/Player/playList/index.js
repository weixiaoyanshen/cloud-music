import { memo, useCallback, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { ListContent, ListHeader, PlayListWrapper, ScrollWrapper } from './style';
import {
  changeCurrentIndex,
  changeCurrentSong,
  changePlayingState,
  changePlayList,
  changePlayMode,
  changeSequecePlayList,
  changeShowPlayList,
  deleteSong
} from '../store/actionCreators'
import { findIndex, getName, prefixStyle, shuffle } from '../../../api/utils';
import { playMode } from '../../../api/config';
import Scroll from '../../../baseUI/scroll';
import Confirm from '../../../baseUI/confirm';

function PlayList(props) {
  const showPlayList = useSelector(state => state.getIn(['player', 'showPlayList']));
  const mode = useSelector(state => state.getIn(['player', 'mode']));
  const playList = useSelector(state => state.getIn(['player', 'playList'])).toJS();
  const sequecePlayList = useSelector(state => state.getIn(['player', 'sequecePlayList'])).toJS();
  const currentSong = useSelector(state => state.getIn(['player', 'currentSong']));
  const currentIndex = useSelector(state => state.getIn(['player', 'currentIndex']));
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(false);
  const playListRef = useRef();
  const listWrapperRef = useRef();
  const confirmRef = useRef();

  const [canTouch, setCanTouch] = useState(true);
  const listContentRef = useRef();

  //touchStart 后记录 y 值
  const [startY, setStartY] = useState(0);
  //touchStart 事件是否已经被触发
  const [initialed, setInitialed] = useState(0);
  // 用户下滑的距离
  const [distance, setDistance] = useState(0);

  const transform = prefixStyle('transform');

  const onEnterCB = useCallback(() => {
    setIsShow(true);
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform])

  const onEnteringCB = useCallback(() => {
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
    listWrapperRef.current.style.transition = 'all .3s';
  }, [transform])

  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
    listWrapperRef.current.style.transition = 'all .3s';
  }, [transform])

  const onExitedCB = useCallback(() => {
    setIsShow(false);
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform])

  const getCurrentIcon = (item) => {
    // 是不是当前正在播放的歌曲
    const current = currentSong.id === item.id;
    const className = current ? 'icon-play' : '';
    const content = current ? '&#xe6e3;': '';
    return (
      <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{__html:content}}></i>
    )
  };

  const getPlayMode = () => {
    let content, text;
    if (mode === playMode.sequence) {
      content = '&#xe625;';
      text = '顺序播放';
    } else if (mode === playMode.loop) {
      content = '&#xe653;';
      text = '单曲循环';
    } else {
      content = '&#xe61b;';
      text = '随机播放';
    }
    return (
      <div>
        <i className="iconfont" onClick={(e) => changeMode(e)}  dangerouslySetInnerHTML={{__html: content}}></i>
        <span className="text" onClick={(e) => changeMode(e)}>{text}</span>
      </div>
    )
  };

  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      // 顺序模式
      dispatch(changePlayList(sequecePlayList));
      let index = findIndex(currentSong, sequecePlayList);
      dispatch(changeCurrentIndex(index));
    } else if (newMode === 1) {
      // 单曲循环
      dispatch(changePlayList(sequecePlayList));
    } else if (newMode === 2) {
      // 随机播放
      let newList = shuffle(sequecePlayList);
      let index = findIndex(currentSong, newList);
      dispatch(changePlayList(newList));
      dispatch(changeCurrentIndex(index));
    }
    dispatch(changePlayMode(newMode));
  };

  const handleChangeCurrentIndex = index => {
    if(currentIndex === index) {
      return;
    }
    dispatch(changeCurrentIndex(index));
  }

  const handleDeleteSong = (e, song) => {
    dispatch(deleteSong(song));
    e.stopPropagation();
  };

  const handleShowClear = () => {
    confirmRef.current.show ();
  }

  const handleConfirmClear = () => {
    dispatch(changePlayList([]));
    dispatch(changeSequecePlayList([]));
    dispatch(changeCurrentIndex(-1));
    dispatch(changeShowPlayList(false));
    dispatch(changeCurrentSong({}));
    dispatch(changePlayingState(false));
  }

  const handleTouchStart = (e) => {
    if(!canTouch || initialed) {
      return;
    }
    listWrapperRef.current.style.transition = '';
    setStartY(e.nativeEvent.touches[0].pageY); // 记录Y值
    setInitialed(true);
  };
  const handleTouchMove = (e) => {
    if(!canTouch || !initialed) return;
    const distance = e.nativeEvent.touches[0].pageY - startY;
    if(distance < 0) return;
    setDistance(distance); // 记录下滑距离
    listWrapperRef.current.style.transform = `translate3d(0, ${distance}px, 0)`;
  };
  const handleTouchEnd = (e) => {
    setInitialed(false);
    // 这里设置阈值为 150px
    if(distance >= 150) {
      // 大于等于150则关闭playList
      dispatch(changeShowPlayList(false));
    } else {
      // 否则弹回去
      listWrapperRef.current.style.transform = `translate3d(0, 0, 0)`;
      listWrapperRef.current.style.transition = 'all .3s';
    }
    setDistance(0)
  };

  const handleScroll = (pos) => {
    // 只有当内容偏移量为 0 的时候才能下滑关闭 PlayList。否则一边内容在移动，一边列表在移动，出现 bug
    let state = pos.y === 0;
    setCanTouch(state);
  }

  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlayListWrapper
        ref={playListRef}
        style={{ display: isShow ? 'block' : 'none' }}
        onClick={() => dispatch(changeShowPlayList(false))}
      >
        <div 
          className='list_wrapper' 
          ref={listWrapperRef} 
          onClick={e => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={handleShowClear}>&#xe63d;</span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll
              ref={listContentRef}
              onScroll={pos => handleScroll(pos)}
              bounceTop={false}
            >
              <ListContent>
                {
                  playList.map((item, index) => (
                    <li className="item" key={item.id} onClick={() => handleChangeCurrentIndex(index)}>
                      {getCurrentIcon(item)}
                      <span className="text">{item.name} - {getName(item.ar)}</span>
                      <span className="like">
                        <i className="iconfont">&#xe601;</i>
                      </span>
                      <span className="delete" onClick={e => handleDeleteSong(e, item)}>
                        <i className="iconfont">&#xe63d;</i>
                      </span>
                    </li>
                  ))
                }
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
        <Confirm 
          ref={confirmRef}
          text="是否删除全部？"
          cancelBtnText="取消"
          confirmBtnText="确定"
          handleConfirm={handleConfirmClear}
        />
      </PlayListWrapper>
    </CSSTransition>
  )
}

export default memo(PlayList);