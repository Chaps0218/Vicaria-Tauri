import React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { blueGrey } from '@mui/material/colors';
import { red } from '@mui/material/colors';

const CustomIconButton = styled(IconButton)(({ theme }) => ({
    color: red[900],
    '&:hover': {
        color: red[500],
    },
}));

const CustomEditIcon = styled(EditIcon)(({ theme }) => ({
    color: red[900],
    '&:hover': {
        color: red[500],
    },
}));

function Inicio({ handleOpenPopupCert, confirmado }) {
    return (
        <IconButton
            aria-label="Report"
            onClick={() => handleOpenPopupCert(confirmado)}
        >
            <CustomEditIcon>edit</CustomEditIcon> {/* Cambia 'report' por el nombre del ícono que estés usando */}
        </IconButton>
    );
}

export default Inicio;