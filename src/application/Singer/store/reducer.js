import { fromJS } from 'immutable';
import { CHANGE_ARTIST, CHANGE_SONGS_OF_ARTIST, CHANGE_ENTER_LOADING } from './constants';

const initState = fromJS({
  artist: {},
  songOfArtist: [],
  loading: true
})

const reducer = (state = initState, action) => {
  switch(action.type) {
    case CHANGE_ARTIST:
      return state.set('artist', action.data);
    case CHANGE_SONGS_OF_ARTIST:
      return state.set('songOfArtist', action.data);
    case CHANGE_ENTER_LOADING:
      return state.set('loading', action.data);
    default:
      return state;
  }
};

export default reducer;