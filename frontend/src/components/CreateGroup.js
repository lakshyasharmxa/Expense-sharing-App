import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createGroup } from '../services/api';

const CreateGroup = ({ show, onHide, onGroupCreated }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await createGroup(formData);
      setFormData({ name: '', description: '' });
      onGroupCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Group</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form.Group className="mb-3">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">Create Group</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateGroup;