import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root')

const ReactModal = props => {
  const modalStyle = {
    overlay : {
        backgroundColor: null
    },
    content : {
        top: null,
        left: null,
        right: null,
        bottom: null,
        border: null,
        background: null,
        borderRadius: null,
        padding: null,
        position: null
    }
  };
  
  return (
    <Modal {...props} style={modalStyle}>
      <div className="react-modal-header">
        <h3>{props.title}</h3>
        <button className="btn-close" onClick={props.onRequestClose}></button>
      </div>
      <div className="react-modal-body">
        {props.children}
      </div>
      {props.actions &&
        <div className="react-modal-footer">
          {props.actions.map( (action, index) => {
            return <button 
                    className={action.className ? action.className : ''}
                    onClick={action.onClick}
                    key={index}>
                      {action.label}
                  </button>;
          })}
        </div>
      }
    </Modal>
  );
}

export default ReactModal;