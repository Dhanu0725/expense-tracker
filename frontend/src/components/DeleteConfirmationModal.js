// src/components/DeleteConfirmationModal.js

import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ onClose, onConfirm }) => {
    return (
        <div className="modal-overlay">
            <div className="delete-modal-content">
                <h2>Confirm</h2>
                <p>Are you sure you want to delete this expense?</p>
                <button onClick={onConfirm} className="confirm-button">Confirm</button>
                <button onClick={onClose} className="cancel-button">Cancel</button>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
