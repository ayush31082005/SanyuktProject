import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ArrowLeft, Construction, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPlaceholder = ({ title = "Under Development", message = "We're working hard to bring this feature to you soon!" }) => {
    const navigate = useNavigate();

    return (
        <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                p: 3
            }}
        >
            <Paper 
                elevation={0}
                sx={{ 
                    p: { xs: 4, md: 8 }, 
                    textAlign: 'center', 
                    borderRadius: '24px',
                    border: '1px solid rgba(10, 122, 47, 0.1)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
                    maxWidth: '600px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
                }}
            >
                <Box 
                    sx={{ 
                        width: 80, 
                        height: 80, 
                        bgcolor: 'rgba(10, 122, 47, 0.1)', 
                        borderRadius: '20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 4,
                        color: '#0A7A2F'
                    }}
                >
                    <Construction size={40} />
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 2, letterSpacing: '-0.02em' }}>
                    {title}
                </Typography>
                
                <Typography sx={{ color: '#666', mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
                    {message}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, bgcolor: '#f0f0f0', borderRadius: '10px' }}>
                        <Clock size={16} className="text-[#0A7A2F]" />
                        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Estimated: Q2 2024
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<ArrowLeft size={18} />}
                    onClick={() => navigate(-1)}
                    sx={{
                        bgcolor: '#0A7A2F',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 10px 20px rgba(10, 122, 47, 0.2)',
                        '&:hover': {
                            bgcolor: '#086326',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 15px 30px rgba(10, 122, 47, 0.3)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                >
                    Go Back
                </Button>
            </Paper>
        </Box>
    );
};

export default DashboardPlaceholder;
