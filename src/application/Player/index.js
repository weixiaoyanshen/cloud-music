import React, { memo, useState, useRef, useEffect } from 'react';
import { useSelector ,useDispatch } from 'react-redux';
import { playMode } from '../../api/config';
import { findIndex, getSongUrl, isEmptyObject, shuffle } from '../../api/utils';
import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer';
import {
  changeCurrentSong,
  changeFullScreen,
  changePlayingState,
  changeSequecePlayList,
  changePlayList,
  changePlayMode,
  changeCurrentIndex,
  changeShowPlayList
} from './store/actionCreators'

function Player(props) {
  const fullScreen = useSelector(state => state.getIn(['player', 'fullScreen']));
  const currentSong = useSelector(state => state.getIn(['player', 'currentSong']));
  const playing = useSelector(state => state.getIn(['player', 'playing']));
  const sequecePlayList = useSelector(state => state.getIn(['player', 'sequecePlayList']));
  const playList = useSelector(state => state.getIn(['player', 'playList'])).toJS();
  const mode = useSelector(state => state.getIn(['player', 'mode']));
  const currentIndex = useSelector(state => state.getIn(['player', 'currentIndex']));
  const showPlayList = useSelector(state => state.getIn(['player', 'showPlayList']));
  //目前播放时间
  const [currentTime, setCurrentTime] = useState(0);
  //歌曲总时长
  const [duration, setDuration] = useState(0);
  //歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  //记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
  const [preSong, setPreSong] = useState({});

  const audioRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if(!playList.length || 
      currentIndex === -1 || 
      !playList[currentIndex] ||
       playList[currentIndex].id === preSong.id
    ) { 
      return;
    };
    let current = playList[currentIndex];
    dispatch(changeCurrentSong(current));
    setPreSong(current);
    audioRef.current.src = getSongUrl(current.id);
    audioRef.current.play();
    dispatch(changePlayingState(true)); // 播放状态
    setCurrentTime(0); //从头开始播放
    setDuration((current.dt / 1000) | 0); // 时长
  }, [playList, currentIndex, preSong.id, dispatch])

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  const toggleFullScreen = (status) => {
    dispatch(changeFullScreen(status))
  }

  const clickPlaying = (e, status) => {
    e.stopPropagation();
    dispatch(changePlayingState(status));
  }

  const updateTime = e => {
    setCurrentTime(e.target.currentTime);
  };

  const onProgressChange = percent => {
    const time = percent * duration;
    setCurrentTime(time);
    audioRef.current.currentTime = time;
    if(!playing) {
      dispatch(changePlayingState(true));
    }
  };

  // 单曲循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    dispatch(changePlayingState(true));
    audioRef.current.play();
  }

  const handlePrev = () => {
    if(playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if(index < 0) {
      index = playList.length - 1;
    }
    if(!playing) {
      dispatch(changePlayingState(true));
    }
    dispatch(changeCurrentIndex(index));
  }

  const handleNext = () => {
    if(playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if(index === playList.length) {
      index = 0;
    }
    if(!playing) {
      dispatch(changePlayingState(true));
    }
    dispatch(changeCurrentIndex(index));
  }

  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if(newMode === 0) {
      // 顺序模式
      dispatch(changeSequecePlayList(sequecePlayList));
      let index = findIndex(currentSong, sequecePlayList);
      dispatch(changeCurrentIndex(index));
    } else if(newMode === 1) {
      // 单曲循环
      dispatch(changePlayList(sequecePlayList));
    } else if(newMode === 2) {
      // 随机播放
      let newList = shuffle(sequecePlayList);
      let index = findIndex(currentSong, sequecePlayList);
      dispatch(changePlayList(newList));
      dispatch(changeCurrentIndex(index));
    }
    dispatch(changePlayMode(newMode));
  }

  const handleEnd = () => {
    if(mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  }

  return (
    <div>
      {
        isEmptyObject(currentSong) ? null : (
          <MiniPlayer
            song={currentSong}
            fullScreen={fullScreen}
            playing={playing}
            percent={percent}
            clickPlaying={clickPlaying}
            toggleFullScreen={toggleFullScreen}
          />
        )
      }
      {
        isEmptyObject(currentSong) ? null : (
          <NormalPlayer
            song={currentSong}
            fullScreen={fullScreen}
            playing={playing}
            duration={duration}
            currentTime={currentTime}
            percent={percent}
            mode={mode}
            changeMode={changeMode}
            clickPlaying={clickPlaying}
            toggleFullScreen={toggleFullScreen}
            onProgressChange={onProgressChange}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        )
      }
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
      ></audio>
    </div>
  )
}

export default memo(Player);
