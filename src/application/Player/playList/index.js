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
        <div className='list_wrapper' ref={listWrapperRef} onClick={e => e.stopPropagation()}>
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={handleShowClear}>&#xe63d;</span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll>
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