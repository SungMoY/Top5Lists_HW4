import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Modal from '@mui/material/Modal';
import { useContext } from 'react';
import GlobalStoreContext from "../store";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';


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

export default function DeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = ""
    let openBool = false

    if (store.listMarkedForDeletion !== null) {
        openBool = true
        name = store.listMarkedForDeletion.name
    }
    //console.log("IS A LIST MARKED FOR DELETION", openBool)

    function handleDeleteList(event) {
        store.deleteMarkedList();
    }
    function handleCloseModal(event) {
        store.unmarkListForDeletion()
    }

    return (
        <div> 
            <Modal
                open={openBool}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
            <Box sx={style} justifyContent="center" alignItems="center" >

                <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                        Delete the {name} Top 5 List?
                </Alert>

                <Stack direction="row" spacing={2} justifyContent = "center" alignItems="center"> 
                    <Button variant="contained" onClick={() => handleDeleteList()}>
                        Confirm
                    </Button>
                    <Button variant="contained" onClick={() => handleCloseModal()}>
                        Cancel
                    </Button>
                </Stack>

            </Box>
            </Modal>
        </div>
    );
}

/*
<Box textAlign = 'center'>
                <Button variant="contained" onClick={() => handleDeleteList()} >
                    Confirm
                    </Button>
                <Button variant="contained" onClick={() => handleCloseModal()} >
                    Cancel
                </Button>
                </Box>
                
                
                
        <Typography id="modal-modal-description" sx={{ mt: 2 }} justifyContent="center" alignItems="center" >
                    Delete the {name} Top 5 List????????
                </Typography>*/