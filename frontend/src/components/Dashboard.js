import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import GroupList from './GroupList';
import CreateGroup from './CreateGroup';
import JoinGroup from './JoinGroup';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import BalanceView from './BalanceView';
import TransactionHistory from './TransactionHistory';

const Dashboard = ({ user, onLogout }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const { getUserGroups } = await import('../services/api');
      const response = await getUserGroups();
      setGroups(response.data);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const handleGroupCreated = () => {
    setShowCreateGroup(false);
    loadGroups();
  };

  const handleGroupJoined = () => {
    setShowJoinGroup(false);
    loadGroups();
  };

  const handleExpenseCreated = () => {
    setShowExpenseForm(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Group Expense Tracker</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => setShowCreateGroup(true)}>Create Group</Nav.Link>
              <Nav.Link onClick={() => setShowJoinGroup(true)}>Join Group</Nav.Link>
            </Nav>
            <Nav>
              <Navbar.Text className="me-3">Welcome, {user.name}</Navbar.Text>
              <Button variant="outline-light" onClick={onLogout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <div className="row">
          <div className="col-md-4">
            <GroupList
              groups={groups}
              selectedGroup={selectedGroup}
              onSelectGroup={setSelectedGroup}
            />
          </div>
          <div className="col-md-8">
            {selectedGroup ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3>{selectedGroup.name}</h3>
                  <Button onClick={() => setShowExpenseForm(true)}>Add Expense</Button>
                </div>
                <BalanceView groupId={selectedGroup._id} key={refreshKey} />
                <TransactionHistory groupId={selectedGroup._id} key={refreshKey} />
                <ExpenseList groupId={selectedGroup._id} key={refreshKey} />
              </>
            ) : (
              <div className="text-center mt-5">
                <p>Select a group to view expenses and balances</p>
              </div>
            )}
          </div>
        </div>
      </Container>

      <CreateGroup
        show={showCreateGroup}
        onHide={() => setShowCreateGroup(false)}
        onGroupCreated={handleGroupCreated}
      />

      <JoinGroup
        show={showJoinGroup}
        onHide={() => setShowJoinGroup(false)}
        onGroupJoined={handleGroupJoined}
      />

      {selectedGroup && (
        <ExpenseForm
          show={showExpenseForm}
          onHide={() => setShowExpenseForm(false)}
          group={selectedGroup}
          onExpenseCreated={handleExpenseCreated}
        />
      )}
    </>
  );
};

export default Dashboard;