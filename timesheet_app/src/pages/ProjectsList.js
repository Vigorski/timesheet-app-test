import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt, faCalendarPlus } from '@fortawesome/free-regular-svg-icons';

import ReactModal from '../components/ReactModal';
import axios from '../apis/projects';
import ProjectForm from '../components/ProjectForm';

const ProjectsList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('/projects');
      setData(response.data);
    }

    fetchData();
  }, []);

  //////////////////////////////////
  // ACTIONS

  const createProject = async (values, { setSubmitting }) => {
    const response = await axios.post('/projects', { ...values });
    
    setSubmitting(false);
    setData([...data, response.data]);
    closeModal();
  }

  const deleteProject = async id => {
    await axios.delete(`/projects/${id}`);

    const newData = data.filter(item => {
      return item.id !== id;
    });
    
    setData(newData);
    closeModal();
  }

  const editProject = async (values, { setSubmitting }, id) => {
    const response = await axios.patch(`/projects/${id}`, values);
    const newData = data.map(function(project) {
      return project.id === response.data.id ? response.data : project;
    });

    setData(newData);
    setSubmitting(false);
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

  const createProjectModal = () => {
    setModalContent({
      title: 'Create a new project',
      body: <ProjectForm
              onSubmitAction={ (values, actions) => createProject(values, actions) }
              initialValues={{ projectName: '', projectDesc: '' }}
              fields={[
                { type: 'text', name: 'projectName', label: 'Name of project' },
                { type: 'text', name: 'projectDesc', label: 'Description' }
              ]}
              action={{ className: 'btn-primary', label: 'Create' }}
            />
    });

    openModal();
  }
  
  const editProjectModal = project => {
    setModalContent({
      title: `Edit Project: ${project.projectName}`,
      body: <ProjectForm
              onSubmitAction={ (values, actions) => editProject(values, actions, project.id) }
              initialValues={{ 
                projectName: project.projectName,
                projectDesc: project.projectDesc
              }}
              fields={[
                { type: 'text', name: 'projectName', label: 'Name of project' },
                { type: 'text', name: 'projectDesc', label: 'Description' }
              ]}
              action={{ className: 'btn-primary', label: 'Update project' }}
            />
    });

    openModal();
  }

  const deleteProjectModal = id => {
    setModalContent({
      title: 'Delete Project!',
      body: <p>Are you sure you want to delete this project?</p>,
      actions: [
        {
          label: 'Delete!',
          className: "btn-primary",
          onClick: () => deleteProject(id)
        }
      ]
    });

    openModal();
  }

  // END MODAL
  //////////////////////////////////

  const renderTableList = () => {
    return data.map(project => {
      return (
        <tr key={project.id}>
          <td className="text-bold">{project.projectName}</td>
          <td>{project.projectDesc}</td>
          <td className="actions">
            <div className="actions-wrapper">
              <Link className="btn-stripped" to={`/project/${project.id}`}><FontAwesomeIcon icon={faEye} /></Link>
              <button className="btn-stripped" onClick={() => {editProjectModal(project)}}><FontAwesomeIcon icon={faEdit} /></button>
              <button className="btn-stripped" onClick={() => {deleteProjectModal(project.id)}}><FontAwesomeIcon icon={faTrashAlt} /></button>
            </div>
          </td>
        </tr>
      );
    })
  }

  return (
    <section className="project-list">
      <div className="section-header">
        <h1>Projects</h1>
        <button className="btn-primary" onClick={createProjectModal}><FontAwesomeIcon icon={faCalendarPlus} /> Create a new project</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderTableList()}
          </tbody>
        </table>
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

export default ProjectsList;