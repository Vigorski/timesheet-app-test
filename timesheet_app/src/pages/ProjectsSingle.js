import React, { useState, useEffect, useMemo } from 'react';
import axios from '../apis/projects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClock } from '@fortawesome/free-regular-svg-icons';

import ReactModal from '../components/ReactModal';
import ProjectForm from '../components/ProjectForm';

const ProjectsSingle = props => {
  const [data, setData] = useState({});
  const [time, setTime] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      const { id } = props.match.params;
      const responseData = await axios.get(`/projects/${id}`);
      
      setData(responseData.data);
    }
    
    fetchData();
  }, [props.match.params]);

  useEffect(() => {
    async function fetchTime() {
      const { id } = props.match.params;
      const responseTime = await axios.get(`/times?projectId=${id}`);
      
      setTime(responseTime.data);
    }
    
    fetchTime();
  }, [props.match.params]);

  const totalTime = useMemo(() => {
    return time.reduce((total, current) => {
      return total + current.amount;
    }, 0);
  }, [time]);

  //////////////////////////////////
  // ACTIONS

  const createTime = async (values, { setSubmitting }) => {
    const response =  await axios.post('/times', {...values, projectId: data.id});

    setSubmitting(false);
    setTime([...time, response.data]);
    closeModal();
  }

  const deleteTime = async id => {
    await axios.delete(`/times/${id}`);

    const newTime = time.filter(item => {
      return item.id !== id;
    });

    setTime(newTime);
    closeModal();
  }

  // END ACTIONS
  //////////////////////////////////

  //////////////////////////////////
  // MODAL

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const openModal = () => {
    setIsOpen(true);
  }
 
  const closeModal = () => {
    setIsOpen(false);
    setModalContent({})
  }

  const addTimeModal = () => {
    setModalContent({
      title: 'Add time',
      body: <ProjectForm
              onSubmitAction={ (values, actions) => createTime(values, actions) }
              initialValues={{ description: '', amount: 0 }}
              fields={[
                { type: 'text', name: 'description', label: 'Description of timeslice' },
                { type: 'number', name: 'amount', label: 'Amount of time' }
              ]}
              action={{ className: 'btn-primary', label: 'Create new timeslice' }}
            />
    });

    openModal();
  }

  const deleteTimetModal = id => {
    setModalContent({
      title: 'Remove time!',
      body: <p>Are you sure you want to remove this entry?</p>,
      actions: [
        {
          label: 'Delete!',
          className: "btn-primary",
          onClick: () => deleteTime(id)
        }
      ]
    });

    openModal();
  }

  // END MODAL
  //////////////////////////////////

  const renderTableList = () => {
    return time?.map(time => {
      return (
        <tr key={time.id}>
          <td className="text-bold">{time.description}</td>
          <td>{time.amount}h</td>
          <td className="actions">
            <div className="actions-wrapper">
              <button className="btn-stripped" onClick={() => {deleteTimetModal(time.id)}}><FontAwesomeIcon icon={faTrashAlt} /></button>
            </div>
          </td>
        </tr>
      );
    })
  }
  
  return (
    <section className="project-single">
      <div className="section-header">
        <h1>Project's time slices</h1>
        <button className="btn-primary" onClick={addTimeModal}><FontAwesomeIcon icon={faClock} /> Add new timeline</button>
      </div>
      <div className="project-single-body">
        <aside className="project-single-body-aside">
          <h3>Project info</h3>
          <div className="project-single-body-aside-total">
            <span>Total:</span>
            <b>{totalTime} h</b>
          </div>
          <div className="project-single-body-aside-info">
            <h4>{data.projectName}</h4>
            <p>{data.projectDesc}</p>
          </div>
        </aside>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th className="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {renderTableList()}
            </tbody>
          </table>
        </div>
      </div>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        title= {modalContent.title}
        actions={ modalContent.actions}
      >
        {modalContent.body}
      </ReactModal>

    </section>
  );
}

export default ProjectsSingle;