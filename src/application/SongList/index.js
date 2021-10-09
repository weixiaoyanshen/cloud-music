import React from 'react';
import { useDispatch } from 'react-redux';
import { getCount, getName } from '../../api/utils';
import { SongItem, SongList } from './style';
import { 
  changePlayList, changeCurrentIndex, changeSequecePlayList
} from './../../application/Player/store/actionCreators';

const SongsList = React.forwardRef((props, refs) => {
  const { collectCount, showCollect, songs, musicAnimation } = props;
  const totalCount = songs.length;

  const dispatch = useDispatch();

  const selectItem = (e, index) => {
    dispatch(changePlayList(songs));
    dispatch(changeSequecePlayList(songs));
    dispatch(changeCurrentIndex(index));
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
  }

  const songList = list => list.map((item, i) => (
    <li key={item.id} onClick={(e) => selectItem(e, i)}>
      <span className="index">{i + 1}</span>
      <div className="info">
        <span>{item.name}</span>
        <span>
          {item.ar ? getName(item.ar) : getName(item.artist)}
          -
          {item.al ? item.al.name : item.album.name}
        </span>
      </div>
    </li>
  ))

  const collect = count => (
    <div className="add_list">
      <i className="iconfont">&#xe62d;</i>
      <span>收藏({getCount(collectCount)}万)</span>
    </div>
  )

  return (
    <SongList ref={refs} showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span>播放全部<span className="sum">(共{totalCount}首)</span></span>
        </div>
        {showCollect ? collect(collectCount) : null}
      </div>
      <SongItem>
        {songList(songs)}
      </SongItem>
    </SongList>
  )
})

export default React.memo(SongsList);