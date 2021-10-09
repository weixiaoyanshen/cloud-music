import { fromJS } from 'immutable';
import { cloneDeep } from 'lodash';
import { playMode } from '../../../api/config';
import { findIndex } from '../../../api/utils';
import {
  SET_CURRENT_SONG,
  SET_FULL_SCREEN,
  SET_PLAYING_STATE,
  SET_SEQUECE_PLAYLIST,
  SET_PLAYLIST,
  SET_PLAY_MODE,
  SET_CURRENT_INDEX,
  SET_SHOW_PLAYLIST,
  DELETE_SONG
} from './constants';

const initState = fromJS({
  fullScreen: false, // 播放器是否为全屏模式
  playing: false, // 当前歌曲是否播放
  sequecePlayList: [], // 顺序列表 (因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
  playList: [],
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前歌曲在播放列表的索引位置
  showPlayList: false, // 是否展示播放列表
  currentSong: {}
})

const handleDeleteSong = (state, song) => {
  // 也可用 loadsh 库的 deepClone 方法。这里深拷贝是基于纯函数的考虑，不对参数 state 做修改
  const playList = cloneDeep(state.get('playList'));
  const sequencePlayList = cloneDeep(state.get('sequecePlayList'));
  console.log(playList, sequencePlayList)
  let currentIndex = state.get('currentIndex');
  // 找对应歌曲在播放列表中的索引
  const fpIndex = findIndex(song, playList);
  // 在播放列表中将其删除
  playList.splice(fpIndex, 1);
  // 如果删除的歌曲排在当前播放歌曲前面，那么 currentIndex--，让当前的歌正常播放
  if (fpIndex < currentIndex) {
    currentIndex--;
  }
  // 在 sequencePlayList 中直接删除歌曲即可
  const fsIndex = findIndex(song, sequencePlayList);
  sequencePlayList.splice(fsIndex, 1);

  return state.merge({
    playList,
    sequencePlayList,
    currentIndex,
  });
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_CURRENT_SONG:
      return state.set('currentSong', action.data);
    case SET_FULL_SCREEN:
      return state.set('fullScreen', action.data);
    case SET_PLAYING_STATE:
      return state.set('playing', action.data);
    case SET_SEQUECE_PLAYLIST:
      return state.set('sequecePlayList', action.data);
    case SET_PLAYLIST:
      return state.set('playList', action.data);
    case SET_PLAY_MODE:
      return state.set('mode', action.data);
    case SET_CURRENT_INDEX:
      return state.set('currentIndex', action.data);
    case SET_SHOW_PLAYLIST:
      return state.set('showPlayList', action.data);
    case DELETE_SONG:
      return handleDeleteSong(state, action.data);
    default:
      return state
  }
}

export default reducer;