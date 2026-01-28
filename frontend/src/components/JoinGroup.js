import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { joinGroup } from '../services/api';

const JoinGroup = ({ show, onHide, onGroupJoined }) => {
  const [invitationCode, setInvitationCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await joinGroup(invitationCode.toUpperCase());
      setInvitationCode('');
      onGroupJoined();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join group');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Join Group</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form.Group className="mb-3">
            <Form.Label>Invitation Code</Form.Label>
            <Form.Control
              type="text"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
              placeholder="Enter invitation code"
              required
              maxLength={6}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">Join Group</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default JoinGroup;