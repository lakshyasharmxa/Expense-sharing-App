import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createExpense } from '../services/api';

const ExpenseForm = ({ show, onHide, group, onExpenseCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    payer: '',
    splitType: 'equal'
  });
  const [customSplits, setCustomSplits] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (group && group.members.length > 0 && !formData.payer) {
      setFormData(prev => ({ ...prev, payer: group.members[0]._id }));
    }
  }, [group]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    let splitAmounts = null;
    if (formData.splitType === 'custom') {
      const total = Object.values(customSplits).reduce((sum, val) => sum + parseFloat(val || 0), 0);
      if (Math.abs(total - amount) > 0.01) {
        setError('Custom split amounts must equal the total amount');
        return;
      }
      splitAmounts = Object.entries(customSplits).map(([userId, amount]) => ({
        userId,
        amount: parseFloat(amount)
      }));
    }

    try {
      await createExpense({
        ...formData,
        amount,
        groupId: group._id,
        splitAmounts
      });
      setFormData({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        payer: group.members[0]?._id || '',
        splitType: 'equal'
      });
      setCustomSplits({});
      onExpenseCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create expense');
    }
  };

  const handleCustomSplitChange = (userId, value) => {
    setCustomSplits(prev => ({ ...prev, [userId]: value }));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Expense</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Paid By</Form.Label>
            <Form.Select
              value={formData.payer}
              onChange={(e) => setFormData({ ...formData, payer: e.target.value })}
              required
            >
              {group?.members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Split Type</Form.Label>
            <Form.Select
              value={formData.splitType}
              onChange={(e) => setFormData({ ...formData, splitType: e.target.value })}
            >
              <option value="equal">Equal Split</option>
              <option value="custom">Custom Split</option>
            </Form.Select>
          </Form.Group>
          {formData.splitType === 'custom' && (
            <Form.Group className="mb-3">
              <Form.Label>Custom Split Amounts</Form.Label>
              {group?.members.map(member => (
                <div key={member._id} className="mb-2">
                  <Form.Label className="small">{member.name}</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={customSplits[member._id] || ''}
                    onChange={(e) => handleCustomSplitChange(member._id, e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              ))}
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">Add Expense</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ExpenseForm;