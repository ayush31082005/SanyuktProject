import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Grid, 
    Paper, 
    Card, 
    CardContent,
    CircularProgress,
    Divider,
    Alert
} from '@mui/material';
import { 
    Zap, 
    Award, 
    BarChart, 
    RefreshCw,
    Shield,
    TrendingUp
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

const MLMManagement = () => {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());

    const fetchOverallStats = async () => {
        try {
            // This would ideally be a new admin API for overall stats
            // For now, let's use the users count or placeholder
            const res = await api.get('admin/users');
            const users = res.data.users || [];
            setStats({
                totalUsers: users.length || 0,
                activeUsers: users.filter(u => u.status === 'active').length || 0,
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOverallStats();
    }, []);

    const handleRunBinaryMatching = async () => {
        setLoading(true);
        try {
            await api.post('mlm/admin/calculate-binary');
            toast.success("Binary matching calculated successfully for all users!");
            setLastUpdated(new Date().toLocaleString());
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to run binary matching");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRanks = async () => {
        setLoading(true);
        try {
            await api.post('mlm/admin/update-ranks');
            toast.success("All user ranks updated successfully!");
            setLastUpdated(new Date().toLocaleString());
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update ranks");
        } finally {
            setLoading(false);
        }
    };

    const ActionCard = ({ title, description, icon: Icon, action, color, buttonText }) => (
        <Card sx={{ height: '100%', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '12px', 
                    bgcolor: `${color}15`, 
                    color: color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 3
                }}>
                    <Icon size={24} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{title}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 4, flex: 1 }}>{description}</Typography>
                <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={action}
                    disabled={loading}
                    sx={{ 
                        bgcolor: color, 
                        '&:hover': { bgcolor: color, filter: 'brightness(0.9)' },
                        borderRadius: '10px',
                        py: 1.5,
                        fontWeight: 700,
                        textTransform: 'none'
                    }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : buttonText}
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ 
            maxWidth: '1200px', 
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 4 }
        }}>
            <Box sx={{ 
                mb: { xs: 3, md: 5 }, 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2
            }}>
                <div>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 900, 
                        mb: 1, 
                        letterSpacing: '-0.02em',
                        fontSize: { xs: '1.75rem', md: '2.125rem' }
                    }}>
                        MLM System Management
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                        System-wide controls for income calculation and business logic.
                    </Typography>
                </div>
                <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase' }}>
                        Last System Update
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{lastUpdated}</Typography>
                </Box>
            </Box>

            <Alert 
                icon={<Shield size={20} />} 
                severity="info" 
                sx={{ 
                    mb: 4, 
                    borderRadius: '16px', 
                    bgcolor: 'rgba(10, 122, 47, 0.05)', 
                    color: '#0A7A2F', 
                    border: '1px solid rgba(10, 122, 47, 0.1)',
                    '& .MuiAlert-message': { fontWeight: 500 }
                }}
            >
                Income calculations are typically run once daily. Use "Run Binary Matching" only when you want to trigger manual calculation for the current cycle.
            </Alert>

            <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 5 }}>
                <Grid item xs={12} md={6}>
                    <ActionCard 
                        title="Run Binary Matching"
                        description="Calculate matching bonus for all users based on their left and right side PV. This will process capping and update wallet balances."
                        icon={Zap}
                        action={handleRunBinaryMatching}
                        color="#0A7A2F"
                        buttonText="Calculate Daily Income"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ActionCard 
                        title="Update All Ranks"
                        description="Process all users and update their ranks based on their total matched PV. This ensures everyone has the correct rank and rewards."
                        icon={Award}
                        action={handleUpdateRanks}
                        color="#ff9800"
                        buttonText="Force Rank Update"
                    />
                </Grid>
            </Grid>

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>System Performance Overview</Typography>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: 'none', border: '1px solid #eee', textAlign: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0A7A2F' }}>{stats?.totalUsers || '-'}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase' }}>Total Network</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: 'none', border: '1px solid #eee', textAlign: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#2196F3' }}>{stats?.activeUsers || '-'}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase' }}>Active ID's</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: 'none', border: '1px solid #eee', textAlign: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#ff9800' }}>₹0</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase' }}>Daily Payout (Est.)</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: 'none', border: '1px solid #eee', textAlign: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#9c27b0' }}>₹0</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase' }}>Company Profit Sharing</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MLMManagement;
