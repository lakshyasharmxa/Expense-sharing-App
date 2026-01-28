import React, { useState, useEffect } from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { getGroupExpenses } from '../services/api';

const ExpenseList = ({ groupId }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, [groupId]);

  const loadExpenses = async () => {
    try {
      const response = await getGroupExpenses(groupId);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading expenses...</div>;
  }

  return (
    <Card className="mt-4">
      <Card.Header>
        <h5>Expense History</h5>
      </Card.Header>
      <Card.Body>
        {expenses.length === 0 ? (
          <p>No expenses yet. Add your first expense!</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Paid By</th>
                <th>Date</th>
                <th>Split Among</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.title}</td>
                  <td>${expense.amount.toFixed(2)}</td>
                  <td>{expense.payer.name}</td>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>
                    {expense.splitAmong.map((split, idx) => (
                      <Badge key={idx} bg="secondary" className="me-1">
                        {split.user.name}: ${split.amount.toFixed(2)}
                      </Badge>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default ExpenseList;