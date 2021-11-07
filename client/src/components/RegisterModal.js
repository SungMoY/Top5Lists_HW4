import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Modal from '@mui/material/Modal';
import AuthContext from '../auth'
import { useContext } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function RegisterModal() {
    const { auth } = useContext(AuthContext);
    let modalDialog = ""
    let openBool = false

    if (auth.registerErrorCode > 0) {
        openBool = true
    }
    //("ERROR CODE", auth.registerErrorCode)

    switch (auth.registerErrorCode) {
        case 1: {
            modalDialog = "Please enter all required fields."
            break
        }
        case 2: {
            modalDialog = "Please enter a password of at least 8 characters."
            break
        }
        case 3: {
            modalDialog = "Please enter the same password twice."
            break
        }
        case 4: {
            modalDialog = "An account with this email address already exists."
            break
        }
        case 5: {
            modalDialog = "Email or password is incorrect."
            break
        }
        default:
            modalDialog = "Error with the error lol"
            break
    }

    return (
        <div> 
            <Modal
                open={openBool}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                {modalDialog}
                </Alert>
                <Box textAlign = 'center'>
                <Button variant="contained" onClick={() => auth.registerCodeReset()} /*disableElevation*/>
                    Ok
                    </Button>
                </Box>
            </Box>
            </Modal>
        </div>
    );
}