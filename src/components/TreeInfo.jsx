import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faWikipediaW } from '@fortawesome/free-brands-svg-icons';

import '../TreeInfo.css';

export default (props) => {
  return (
    <TreeInfo style={{ display: props.hidden ? 'none' : 'flex' }}>
      <Detail>
        <DetailHeader>Common name: </DetailHeader>
        <DetailContent>{props.commonName || 'None'}</DetailContent>
      </Detail>

      <Detail>
        <DetailHeader>Latin name: </DetailHeader>
        <DetailContent>{props.latinName || 'None'}</DetailContent>
      </Detail>

      <Detail>
        <DetailHeader className="detail-header">Health: </DetailHeader>
        <DetailContent>{props.health || 'None'}</DetailContent>
      </Detail>
      <IconContainer className="fa-stack">
        <FontAwesomeIcon icon={faCircle} className="fa-stack-2x" />
        <WikipediaIcon className="fa-stack-1x" />
      </IconContainer>
    </TreeInfo>
  )
}

const TreeInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: flex-start;
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 12px;
  background-color: white;
  color: #404040;
  z-index: 1;
  padding: 6px;
  width: auto;
  border: 1.5px solid #404040;
  border-radius: 0.2em;
  opacity: 0.8;
  transition: 0.5s opacity;
  font-size: 0.8em;
  width: 15em;

  &:hover {
    opacity: 1;
    transition: 0.5s opacity;
  }
`;

const Detail = styled.div`
  display: flex;
  margin: 0.5em;
  flex-direction: column;
  padding: 0;
  text-align: left;
  margin-bottom: 0;
`;

const DetailHeader = styled.p`
  font-weight: bold;
  margin: 0;
`;

const DetailContent = styled.p`
  margin: 0;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 1em;
  &:hover {
    cursor: pointer;
  }
`;

const WikipediaIcon = styled(FontAwesomeIcon).attrs({ icon: faWikipediaW })`
  border-radius: 100%;
  color: white;
`;
