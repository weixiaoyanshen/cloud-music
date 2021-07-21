import React, { memo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Scroll from '../scroll';
import style from '../../assets/global-style';

const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  >span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: grey;
    font-size: ${style['font-size-m']};
  }
`;

const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style["font-size-m"]};
  padding: 5px 8px;
  border-radius: 10px;
  &.selected {
    color: ${style["theme-color"]};
    border: 1px solid ${style["theme-color"]};
    opacity: 0.8;
  }
`;

function Horizon(props) {
  const { title, list, oldVal, handleClick } = props;
  const category = useRef(null);

  useEffect(() => {
    let categoryDom = category.current;
    let spanEls = categoryDom.querySelectorAll('span');
    let totalWidth = 0;
    Array.from(spanEls).forEach(el => {
      totalWidth += el.offsetWidth;
    });
    categoryDom.style.width = `${totalWidth}px`
  }, [])

  return (
    <Scroll direction="horizontal">
      <div ref={category}>
        <List>
          <span>{title}</span>
          {
            list.map(item => (
              <ListItem
                key={item.key}
                className={`${oldVal === item.key ? 'selected' : ''}`}
                onClick={() => handleClick(item.key)}
              >
                {item.name}
              </ListItem>
            ))
          }
        </List>
      </div>
    </Scroll>
  )
}

export default memo(Horizon);
