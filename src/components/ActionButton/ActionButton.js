import React from 'react';
import PropTypes from 'prop-types';
import './ActionButton.scss';
import { Dropdown } from 'react-bootstrap';

function ActionButton({ actionItems, onActionLister }) {
  return (
    <div className="action-btn">
      <Dropdown drop="left">
        <Dropdown.Toggle
          variant="link"
          id="dropdown-basic"
          className="action-dots"
        >
          <span className="dots" />
        </Dropdown.Toggle>

        <Dropdown.Menu className="action-list">
          {actionItems.map(actionItem => {
            return (
              <Dropdown.Item
                key={actionItem.id}
                eventKey={actionItem.id}
                href={actionItem.actionLink}
                className="action-item"
                onSelect={onActionLister}
              >
                {actionItem.label}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

ActionButton.defaultProps = {
  onActionLister: () => {},
};

ActionButton.propTypes = {
  actionItems: PropTypes.instanceOf(Array).isRequired,
  onActionLister: PropTypes.func,
};
export default ActionButton;
