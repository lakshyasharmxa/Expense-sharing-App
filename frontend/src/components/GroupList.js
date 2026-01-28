import React from 'react';
import { ListGroup, Card } from 'react-bootstrap';

const GroupList = ({ groups, selectedGroup, onSelectGroup }) => {
  return (
    <Card>
      <Card.Header>
        <h5>My Groups</h5>
      </Card.Header>
      <ListGroup variant="flush">
        {groups.length === 0 ? (
          <ListGroup.Item>No groups yet. Create or join a group!</ListGroup.Item>
        ) : (
          groups.map((group) => (
            <ListGroup.Item
              key={group._id}
              action
              active={selectedGroup?._id === group._id}
              onClick={() => onSelectGroup(group)}
            >
              <div>
                <strong>{group.name}</strong>
                <br />
                <small className="text-muted">
                  Code: {group.invitationCode} | Members: {group.members.length}
                </small>
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Card>
  );
};

export default GroupList;