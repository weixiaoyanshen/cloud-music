import React, { memo } from 'react';
import { useSelector ,useDispatch } from 'react-redux';
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
  // const currentSong = useSelector(state => state.getIn(['player', 'currentSong']));
  const playing = useSelector(state => state.getIn(['player', 'playing']));
  const sequecePlayList = useSelector(state => state.getIn(['player', 'sequecePlayList']));
  const playList = useSelector(state => state.getIn(['player', 'playList']));
  const mode = useSelector(state => state.getIn(['player', 'mode']));
  const currentIndex = useSelector(state => state.getIn(['player', 'currentIndex']));
  const showPlayList = useSelector(state => state.getIn(['player', 'showPlayList']));
  const dispatch = useDispatch();

  const currentSong = {
    al: { picUrl: "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg" },
    name: "木偶人",
    ar: [{name: "薛之谦"}]
  }

  const toggleFullScreen = (status) => {
    dispatch(changeFullScreen(status))
  }
  
  return (
    <div>
      <MiniPlayer
        song={currentSong}
        fullScreen={fullScreen}
        toggleFullScreen={toggleFullScreen}
      />
      <NormalPlayer
        song={currentSong}
        fullScreen={fullScreen}
        toggleFullScreen={toggleFullScreen}
      />
    </div>
  )
}

export default memo(Player);
