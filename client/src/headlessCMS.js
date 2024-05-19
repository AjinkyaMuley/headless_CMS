import React, { useState, useRef, useEffect } from 'react';
import EntityForm from './EntityForm';
import EntityDataForm from './EntityDataForm';
import EditDataModal from './EditDataModal';
import './styles.css';

const HeadlessCMS = () => {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityData, setEntityData] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [dataToEdit, setDataToEdit] = useState(null);
  const dataContainerRef = useRef(null);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    const response = await fetch('http://localhost:4000/entities');
    const data = await response.json();
    setEntities(data);
  }

  const handleCreateEntity = async (entity) => {
    try {
      const response = await fetch('http://localhost:4000/addentity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entity)
      })
      const newEntity = await response.json();
      setEntities([...entities, newEntity]);
    } catch (error) {
      console.log('error in creating new entity', error)
    }
  };

  const handleDeleteEntity = async (index) => {
    try {
      const entityToDelete = entities[index];
      
      await fetch(`http://localhost:4000/deleteEntities/${entityToDelete.name}`,{
        method : 'DELETE'
      })
      const newEntities = entities.filter((_, i) => i !== index);
      setEntities(newEntities);
      if (selectedEntity && selectedEntity.name === entityToDelete.name) {
        setSelectedEntity(null);
      }
    } catch (error) {
      console.error('Error deleting entity:', error);
    }
  };

  const handleSelectEntity = async (entity) => {
    setSelectedEntity(entity);
    if (!entityData[entity.name]) {
      try {
        const response = await fetch(`http://localhost:4000/data/${entity.name}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const dataFromTable = await response.json();
        setEntityData({ ...entityData, [entity.name]: dataFromTable });
      } catch (error) {
        console.error('Error fetching data from entity:', error);
      }
    }
  };
  

  const handleAddData = async (data) => {

      setEntityData({
        ...entityData,
        [selectedEntity.name]: [...entityData[selectedEntity.name], data]
      });
    
  };

  const handleEditData = (data) => {
    const updatedData = entityData[selectedEntity.name].map(entry =>
      entry === dataToEdit ? data : entry
    );
    setEntityData({ ...entityData, [selectedEntity.name]: updatedData });
    setEditModalVisible(false);
  };

  const handleDeleteData = async(index) => {
    try {
      const dataToDelete = entityData[selectedEntity.name][index];
      await fetch(`http://localhost:4000/delete/${selectedEntity.name}/${dataToDelete.id}`,{
        method: 'DELETE',
      })
      const updatedData = entityData[selectedEntity.name].filter((_, i) => i !== index);
      setEntityData({ ...entityData, [selectedEntity.name]: updatedData });
    } catch (error) {
      console.log("Error deleting the table data",error)
    }
  };

  useEffect(() => {
    if (dataContainerRef.current) {
      dataContainerRef.current.scrollTop = dataContainerRef.current.scrollHeight;
    }
  }, [entityData]);

  return (
    <div className="container">
      <h2>Headless CMS</h2>
      <EntityForm onCreateEntity={handleCreateEntity} />
      <hr />
      <h3>Entities</h3>
      {entities.map((entity, index) => (
        <div className="entity" key={index}>
          <h4>{entity.name}</h4>
          <ul>
            {entity.attributes.map((attr, i) => (
              <li key={i}>{`${attr.name} (${attr.type})`}</li>
            ))}
          </ul>
          <button className="btn btn-primary" onClick={() => handleSelectEntity(entity)}>Select Entity</button>
          <button className="btn btn-danger" onClick={() => handleDeleteEntity(index)}>Delete Entity</button>
        </div>
      ))}
      <hr />
      {selectedEntity && (
        <>
          <EntityDataForm entity={selectedEntity} onAddData={handleAddData} />
          <h3>Data Entries for {selectedEntity.name}</h3>
          <div className="data-container" ref={dataContainerRef}>
            {entityData[selectedEntity.name] && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    {selectedEntity.attributes.map((attr, index) => (
                      <th key={index}>{attr.name}</th>
                    ))}
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {entityData[selectedEntity.name].map((dataEntry, index) => (
                    <tr key={index}>
                      {selectedEntity.attributes.map((attr, i) => (
                        <td key={i}>{dataEntry[attr.name]}</td>
                      ))}
                      <td>
                        <button className="btn btn-success" onClick={() => { setEditModalVisible(true); setDataToEdit(dataEntry); }}>Edit</button>
                      </td>
                      <td>
                        <button className="btn btn-danger" onClick={() => handleDeleteData(index)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {editModalVisible && (
            <EditDataModal
              entity={selectedEntity}
              dataEntry={dataToEdit}
              onUpdateData={handleEditData}
              onClose={() => setEditModalVisible(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HeadlessCMS;
