import { AlignVerticalCenter, FormatAlignJustify } from '@mui/icons-material'
import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const LoadingDiv = ({ size = 60, color = 'info' }) => {
    return (
        <div className='flex flex-col h-full items-center justify-center'>
            <Box sx={{
                display: 'flex',
                alignitems: 'center',
                justifyContent: 'center'
            }}>
                <CircularProgress size={size} color={color} />
            </Box>
        </div>
    )
}

export default LoadingDiv