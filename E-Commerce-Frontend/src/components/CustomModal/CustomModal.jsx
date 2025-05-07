// components/GenericModal.jsx
import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
import {Button} from "reactstrap";

const defaultStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: '70vw',
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'white',
    boxShadow: 24,
    borderRadius: '10px',
    p: 4,
};

// const CustomModal = ({ triggerButton, children, sx }) => {
//     const [open, setOpen] = useState(false);
//     const handleOpen = (e) => {
//         e?.stopPropagation();
//         setOpen(true);
//     };
//     const handleClose = () => setOpen(false);
//
//     // Clone the trigger and inject onClick
//     const TriggerWithHandler = React.cloneElement(triggerButton, {
//         onClick: handleOpen,
//     });
//
//     return (
//         <>
//             {TriggerWithHandler}
//             <Modal
//                 open={open}
//                 onClose={handleClose}
//                 aria-labelledby="modal"
//                 aria-describedby="modal-content"
//             >
//                 <ModalBody sx={{ ...defaultStyle, ...sx }}>
//                     <Button
//                         className="border-0 fw-bold m-3 text-danger bg-transparent"
//                         style={{ position: "absolute", top: 0, right: 0, padding: '10px 15px' }}
//                         onClick={() => handleClose()}
//                     >
//                         ×
//                     </Button>
//                     {React.cloneElement(children, { onClose: handleClose })}
//                 </ModalBody>
//             </Modal>
//         </>
//     );
// };

const CustomModal = ({ open, onClose, children, sx }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal"
            aria-describedby="modal-content"
        >
            <Box sx={{ ...defaultStyle, ...sx }}>
                <Button
                    className="border-0 fw-bold m-2 text-danger bg-transparent fs-2"
                    style={{ position: "absolute", top: 0, right: 0 }}
                    onClick={onClose}
                >
                    ×
                </Button>
                {React.cloneElement(children, { onClose })}
            </Box>
        </Modal>
    );
};

export default CustomModal;
