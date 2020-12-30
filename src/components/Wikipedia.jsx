import React, { useState, useEffect } from 'react';
import wiki from 'wikijs';
import Modal from 'react-modal';

export default (props) => {
  const [wikiInfo, setWikiInfo] = useState([{title: 'Loading ...'}])

  useEffect(() => {
    Modal.setAppElement('#root');
  }, [])

  const afterOpenModal = () => {
    console.log('PROPS NAME', props.latinName)

    const wikipedia = wiki({
      apiUrl: 'https://en.wikipedia.org/w/api.php',
      origin: '*'
    });

    wikipedia.search(props.latinName, 1)
      .then(res => wiki().page(res.results[0]))
      .then(page => page.content())
      .then(content => setWikiInfo(content))
      .catch(() => setWikiInfo([{title: 'Not found'}]))
  }

  const closeModal = () => {
    props.setModalIsOpen(false);
  }

  const modalStyles = {
    content : {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '75%',
      maxHeight: '75%',
      overflow: 'auto'
    },
    overlay: {
      zIndex: 999999,
    }
  };

  return (
    <div>
      <Modal
        isOpen = {props.modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Wikipedia information about this tree"
      >
        <button onClick = {closeModal}>x</button>
        <h2>About {props.latinName.toLowerCase()} from Wikipedia</h2>
        {wikiInfo.map((content) => {
          return (
            <div>
              <h4>{content.title}</h4>
              <p>{content.content}</p>
            </div>
          )
        })}
      </Modal>
    </div>
  )

};
