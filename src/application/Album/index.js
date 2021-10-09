import React, { useState, memo, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Container, TopDesc, Menu } from './style';
import Header from '../../baseUI/header';
import Scroll from '../../baseUI/scroll';
import Loading from '../../baseUI/loading';
import { getAlbumDetail, changeEnterLoading } from './store/actionCreators';
import { isEmptyObject } from '../../api/utils';
import style from '../../assets/global-style';
import SongsList from '../SongList';
import MusicNote from '../../baseUI/MusicNote';

export const HEADER_HEIGHT = 45;

function Album(props) {
  const currentAlbumIm = useSelector(state => state.getIn(['album', 'currentAlbum']));
  const currentAlbum = currentAlbumIm.toJS();
  const enterLoading = useSelector(state => state.getIn(['album', 'enterLoading']));
  const [showStatus, setShowStatus] = useState(true);
  const [title, setTitle] = useState('歌单');
  const [isMarquee, setIsMarquee] = useState(false);
  const headerEl = useRef();
  const dispatch = useDispatch();

  const musicNoteRef = useRef();

  useEffect(() => {
    dispatch(changeEnterLoading(true));
    dispatch(getAlbumDetail(props.match.params.id))
  }, [dispatch, props.match.params.id])

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, [])

  const hanlderScroll = useCallback((pos) => {
    let minScrollY = -HEADER_HEIGHT;
    let percent = Math.abs(pos.y / minScrollY);
    let headerDom = headerEl.current;
    // 滑过顶部的高度开始变化
    if(pos.y < minScrollY) {
      headerDom.style.backgroundColor = style['theme-color'];
      headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
      setTitle(currentAlbum.name);
      setIsMarquee(true);
    } else {
      headerDom.style.backgroundColor = '';
      headerDom.style.opacity = 1;
      setTitle('歌单');
      setIsMarquee(false);
    }
  }, [currentAlbum])

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y})
  }

  const renderTopDesc = () => (
    <TopDesc background={currentAlbum.coverImgUrl}>
      <div className="background">
        <div className="filter"></div>
      </div>
      <div className="img_wrapper">
        <div className="decorate"></div>
        <img src={currentAlbum.coverImgUrl} alt="" />
        <div className="play_count">
          <i className="iconfont play">&#xe885;</i>
          <span className="count">{Math.floor(currentAlbum.subscribedCount / 1000) / 10} 万 </span>
        </div>
      </div>
      <div className="desc_wrapper">
        <div className="title">{currentAlbum.name}</div>
        <div className="person">
          <div className="avatar">
            <img src={currentAlbum.creator.avatarUrl} alt=""/>
          </div>
          <div className="name">{currentAlbum.creator.nickname}</div>
        </div>
      </div>
    </TopDesc>
  )

  const renderMenu = () => (
    <Menu>
      <div>
        <i className="iconfont">&#xe6ad;</i>
        评论
      </div>
      <div>
        <i className="iconfont">&#xe86f;</i>
        点赞
      </div>
      <div>
        <i className="iconfont">&#xe62d;</i>
        收藏
      </div>
      <div>
        <i className="iconfont">&#xe606;</i>
        更多
      </div>
    </Menu>
  )

  const renderSongList = () => (
    <SongsList
      showCollect={true}
      showBackground={true}
      collectCount={currentAlbum.subscribedCount}
      songs={currentAlbum.tracks}
      musicAnimation={musicAnimation}
    ></SongsList>
  )

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>
        <Header
          ref={headerEl}
          title={title}
          isMarquee={isMarquee}
          handleClick={handleBack}
        ></Header>
        {
          !isEmptyObject(currentAlbum) 
            ? (
              <Scroll bounceTop={false} onScroll={hanlderScroll}>
                <div>
                  {renderTopDesc()}
                  {renderMenu()}
                  {renderSongList()}
                </div>
              </Scroll>
            )
            : null
        }
        <Loading show={enterLoading}></Loading>
        <MusicNote ref={musicNoteRef} />
      </Container>
    </CSSTransition>
  )
}

export default memo(Album);