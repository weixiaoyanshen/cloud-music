import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { BgLayer, CollectButton, Container, ImgWrapper, SongListWrapper } from './style';
import { getSingerInfo, changeEnterLoading } from './store/actionCreators';
import Header from '../../baseUI/header';
import Scroll from '../../baseUI/scroll';
import Loading from '../../baseUI/loading';
import SongsList from '../SongList';
import { HEADER_HEIGHT } from '../../api/config';

function Singer(props) {
  const artist = useSelector(state => state.getIn(['singer', 'artist']));
  const songOfArtist = useSelector(state => state.getIn(['singer', 'songOfArtist'])).toJS();
  const loading = useSelector(state => state.getIn(['singer', 'loading']));
  const dispatch = useDispatch();
  const [showStatus, setShowStatus] = useState (true);

  const collectButton = useRef();
  const imageWrapper = useRef();
  const songScrollWrapper = useRef();
  const songScroll = useRef();
  const header = useRef();
  const layer = useRef();
  // 图片初始高度
  const initialHeight = useRef(0);
  // 往上偏移的尺寸，露出圆角
  const OFFSET = 5;

  useEffect(() => {
    const h = imageWrapper.current.offsetHeight;
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;
    initialHeight.current = h;
    // 把遮罩先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h - OFFSET}px`;
    songScroll.current.refresh();
  }, [])

  useEffect(() => {
    dispatch(changeEnterLoading(true));
    dispatch(getSingerInfo(props.match.params.id));
  }, [dispatch, props.match.params.id])
  
  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, [])

  const handleScroll = useCallback(pos => {
    let height = initialHeight.current;
    const newY = pos.y;
    const imageDom = imageWrapper.current;
    const buttonDom = collectButton.current;
    const headerDom = header.current;
    const layerDom = layer.current;
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;
    // 指的是滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height);
    if(newY > 0) {
      // 处理往下拉的情况，效果：图片放大，按钮跟着偏移
      imageDom.style.transform = `scale(${1 + percent})`;
      buttonDom.style.transform = `translate3d(0, ${newY}px, 0)`;
      layerDom.style.top = `${height - OFFSET + newY}px`;
    } else if(newY >= minScrollY) {
      // 往上滑动，但是遮罩还没超过Header部分
      layerDom.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      // 这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
      layerDom.style.zIndex = 1;
      imageDom.style.paddingTop = '75%';
      imageDom.style.height = 0;
      imageDom.style.zIndex = -1;
      // 按钮跟着移动且渐渐变透明
      buttonDom.style.transform = `translate3d(0, ${newY}px, 0)`;
      buttonDom.style.opacity = `${1 - percent * 2}`;
    } else if(newY < minScrollY) {
      // 往上滑动，但是遮罩超过 Header 部分
      layerDom.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      layerDom.style.zIndex = 1;
      // 防止溢出的歌单内容遮住 Header
      headerDom.style.zIndex = 100;
      // 此时图片高度与 Header 一致
      imageDom.style.height = `${HEADER_HEIGHT}px`;
      imageDom.style.paddingTop = 0;
      imageDom.style.zIndex = 99;
    }
  }, [])

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container>
        <Header ref={header} title={'头部'} handleClick={handleBack}></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"/>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={layer} />
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll ref={songScroll} onScroll={handleScroll}>
            <SongsList
              songs={songOfArtist}
              showCollect={false}
            ></SongsList>
          </Scroll>
        </SongListWrapper>
        <Loading show={loading}></Loading>
      </Container>
    </CSSTransition>
  )
}

export default Singer;