import { memo, useRef } from 'react';
import { MiniPlayerContainer } from './style';
import { getName } from '../../../api/utils';
import { CSSTransition } from 'react-transition-group';

function MiniPlayer(props) {
  const { song, fullScreen, toggleFullScreen } = props;
  const miniPlayerRef = useRef();

  return (
    <CSSTransition
      classNames="mini"
      in={!fullScreen}
      timeout={400}
      onEnter={() => {
        miniPlayerRef.current.style.display = 'flex';
      }}
      onExited={() => {
        miniPlayerRef.current.style.display = 'none';
      }}
    >
      <MiniPlayerContainer ref={miniPlayerRef} onClick={() => toggleFullScreen(true)}>
        <div className="icon">
          <div className="imgWrapper">
            <img src={song.al.picUrl} alt="img" className="play" width="40" height="40" />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <i className="iconfont">&#xe650;</i>
        </div>
        <div className="control">
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  )
}

export default memo(MiniPlayer);
