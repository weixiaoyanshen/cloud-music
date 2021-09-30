import React, { memo, useState, useRef, useEffect } from 'react';
import { useSelector ,useDispatch } from 'react-redux';
import { getSongUrl, isEmptyObject } from '../../api/utils';
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
  const currentSong = useSelector(state => state.getIn(['player', 'currentSong'])).toJS();
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

//   const playList = [
//     {
//       ftype: 0,
//       djId: 0,
//       a: null,
//       cd: '01',
//       crbt: null,
//       no: 1,
//       st: 0,
//       rt: '',
//       cf: '',
//       alia: [
//         '手游《梦幻花园》苏州园林版推广曲'
//       ],
//       rtUrls: [],
//       fee: 0,
//       s_id: 0,
//       copyright: 0,
//       h: {
//         br: 320000,
//         fid: 0,
//         size: 9400365,
//         vd: -45814
//       },
//       mv: 0,
//       al: {
//         id: 84991301,
//         name: '拾梦纪',
//         picUrl: 'http://p1.music.126.net/M19SOoRMkcHmJvmGflXjXQ==/109951164627180052.jpg',
//         tns: [],
//         pic_str: '109951164627180052',
//         pic: 109951164627180050
//       },
//       name: '拾梦纪',
//       l: {
//         br: 128000,
//         fid: 0,
//         size: 3760173,
//         vd: -41672
//       },
//       rtype: 0,
//       m: {
//         br: 192000,
//         fid: 0,
//         size: 5640237,
//         vd: -43277
//       },
//       cp: 1416668,
//       mark: 0,
//       rtUrl: null,
//       mst: 9,
//       dt: 234947,
//       ar: [
//         {
//           id: 12084589,
//           name: '妖扬',
//           tns: [],
//           alias: []
//         },
//         {
//           id: 12578371,
//           name: '金天',
//           tns: [],
//           alias: []
//         }
//       ],
//       pop: 5,
//       pst: 0,
//       t: 0,
//       v: 3,
//       id: 1416767593,
//       publishTime: 0,
//       rurl: null
//     }
// ];

  const audioRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(currentSong)
    if(!currentSong) { 
      return
    };
    audioRef.current.src = getSongUrl(currentSong.id);
    // dispatch(changePlayingState(true)); // 播放状态
    // setCurrentTime(0); //从头开始播放
    // setDuration((currentSong.dt / 1000) | 0); // 时长
  }, [currentSong])

  useEffect(() => {
    console.log(playing)
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
            clickPlaying={clickPlaying}
            toggleFullScreen={toggleFullScreen}
          />
        )
      }
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
      ></audio>
    </div>
  )
}

export default memo(Player);
