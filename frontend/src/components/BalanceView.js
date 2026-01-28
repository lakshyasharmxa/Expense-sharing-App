import React, { useState, useEffect } from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { getBalances, getSettlementSuggestions } from '../services/api';

const BalanceView = ({ groupId }) => {
  const [balances, setBalances] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalances();
    loadSuggestions();
  }, [groupId]);

  const loadBalances = async () => {
    try {
      const response = await getBalances(groupId);
      setBalances(response.data);
    } catch (error) {
      console.error('Error loading balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await getSettlementSuggestions(groupId);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  if (loading) {
    return <div>Loading balances...</div>;
  }

  return (
    <>
      <Card className="mb-4">
        <Card.Header>
          <h5>Balances</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Member</th>
                <th>Total Paid</th>
                <th>Total Owed</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((balance,index) => (
                <tr key={balance.user.id || index}>
                  <td>{balance.user.name}</td>
                  <td>${balance.totalPaid.toFixed(2)}</td>
                  <td>${balance.totalOwed.toFixed(2)}</td>
                  <td>
                    <Badge bg={balance.balance >= 0 ? 'success' : 'danger'}>
                      ${balance.balance.toFixed(2)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {suggestions.length > 0 && (
        <Card className="mb-4">
          <Card.Header>
            <h5>Settlement Suggestions</h5>
          </Card.Header>
          <Card.Body>
            <ul className="list-group">
              {suggestions.map((suggestion, idx) => (
                <li key={idx} className="list-group-item">
                  <strong>{suggestion.from.name}</strong> should pay{' '}
                  <strong>${suggestion.amount.toFixed(2)}</strong> to{' '}
                  <strong>{suggestion.to.name}</strong>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default BalanceView;