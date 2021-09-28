import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { getRankList } from './store/actionCreators';
import { filterIndex } from '../../api/utils';
import { Container, List, ListItem, SongList, EnterLoading } from './style';
import Scroll from '../../baseUI/scroll';
import Loading from '../../baseUI/loading';

function Rank(props) {
  const rankList = useSelector(state => state.getIn(['rank', 'rankList']));
  const rankListJS = rankList.size ? rankList.toJS() : [];
  const loading = useSelector(state => state.getIn(['rank', 'loading']));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRankList())
  }, [dispatch])

  let globalStartIndex = filterIndex(rankListJS);
  let officialList = rankListJS.slice(0, globalStartIndex);
  let globalList = rankListJS.slice(globalStartIndex);

  const enterDetail = (detail) => {
    props.history.push(`/rank/${detail.id}`)
  }

  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {
          list.map((item) => {
            return(
              <ListItem key={item.id} tracks={item.tracks} onClick={() => enterDetail(item)}>
                <div className="img_wrapper">
                  <img src={item.coverImgUrl} alt=""/>
                  <div className="decorate"></div>
                  <span className="update_frequency">{item.updateFrequency}</span>
                </div>
                { renderSongList(item.tracks)  }
              </ListItem>
            )
          })
        } 
      </List>
    )
  }

  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {
          list.map((item, index) => {
            return <li key={index}>{index+1}. {item.first} - {item.second}</li>
          })
        }
      </SongList>
    ) : null;
  }

  let displayStyle = loading ? {'display': 'none'}:  {'display': ''};

  return (
    <Container>
      <Scroll>
        <div>
          <h1 className="official" style={displayStyle}>官方榜</h1>
            { renderRankList(officialList) }
          <h1 className="global" style={displayStyle}>全球榜</h1>
            { renderRankList(globalList, true) }
          <EnterLoading>
            <Loading show={loading}></Loading>
          </EnterLoading>
        </div>
      </Scroll> 
      {renderRoutes(props.route.routes)}
    </Container>
  )
}

export default React.memo(Rank)
