import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Filter, Eye, Edit, Truck, Clock, CheckCircle, AlertCircle, XCircle, RotateCcw, Package } from 'lucide-react';
import api from '../../api';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip,
    IconButton, TextField, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, Select, InputLabel, FormControl
} from '@mui/material';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Order Detail Dialog
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);

    // Status Update Dialog
    const [openStatusUpdate, setOpenStatusUpdate] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/orders/admin/all');
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await api.put(`/orders/admin/${selectedOrder._id}`, {
                status: newStatus,
                message: statusMessage
            });
            setOpenStatusUpdate(false);
            setNewStatus('');
            setStatusMessage('');
            fetchOrders(); // Refresh
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            pending: { color: 'warning', label: 'Pending' },
            processing: { color: 'info', label: 'Processing' },
            shipped: { color: 'primary', label: 'Shipped' },
            reached_store: { color: 'secondary', label: 'Reached Store' },
            out_for_delivery: { color: 'info', label: 'Out for Delivery' },
            delivered: { color: 'success', label: 'Delivered' },
            cancelled: { color: 'error', label: 'Cancelled' },
            backorder: { color: 'error', label: 'Backorder' }
        };
        const config = statusConfig[status] || { color: 'default', label: status };
        return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 600 }} />;
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ShoppingBag size={32} className="text-green-600" />
                    Order Management
                </Typography>
                <Button variant="contained" startIcon={<RotateCcw />} onClick={fetchOrders} sx={{ bgcolor: '#0A7A2F', '&:hover': { bgcolor: '#086325' } }}>
                    Refresh
                </Button>
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2, alignItems: 'center', borderRadius: '12px' }}>
                <TextField
                    placeholder="Search by Order ID or User..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                        startAdornment: <Search size={18} className="text-gray-400 mr-2" />
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="all">All Orders</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="reached_store">Reached Store</MenuItem>
                        <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                        <MenuItem value="backorder">Backorder</MenuItem>
                    </Select>
                </FormControl>
            </Paper>

            <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow key={order._id} hover>
                                <TableCell sx={{ fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</TableCell>
                                <TableCell>{order.user?.name || 'Customer'}</TableCell>
                                <TableCell>{order.product?.name || 'Product'}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#0A7A2F' }}>₹{order.total?.toFixed(2)}</TableCell>
                                <TableCell>{getStatusChip(order.status)}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" color="primary" onClick={() => { setSelectedOrder(order); setOpenDetail(true); }}>
                                        <Eye size={18} />
                                    </IconButton>
                                    <IconButton size="small" color="secondary" onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setOpenStatusUpdate(true); }}>
                                        <Edit size={18} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Order Details Dialog */}
            <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
                    Order Details - #{selectedOrder?._id?.slice(-8).toUpperCase()}
                </DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Box sx={{ py: 2 }}>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>Customer Info</Typography>
                                    <Typography variant="body2"><strong>Name:</strong> {selectedOrder.user?.name}</Typography>
                                    <Typography variant="body2"><strong>Email:</strong> {selectedOrder.user?.email}</Typography>
                                    <Typography variant="body2"><strong>Phone:</strong> {selectedOrder.shippingInfo?.phone}</Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>Shipping Info</Typography>
                                    <Typography variant="body2">{selectedOrder.shippingInfo?.address}</Typography>
                                    <Typography variant="body2">{selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.state} - {selectedOrder.shippingInfo?.pincode}</Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>Payment Info</Typography>
                                    <Typography variant="body2"><strong>Method:</strong> <span className="uppercase">{selectedOrder.paymentMethod}</span></Typography>
                                    <Typography variant="body2"><strong>Status:</strong> {getStatusChip(selectedOrder.status)}</Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>Order Info</Typography>
                                    <Typography variant="body2"><strong>Total:</strong> ₹{selectedOrder.total?.toFixed(2)}</Typography>
                                    <Typography variant="body2"><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</Typography>
                                </div>
                            </div>

                            <Box sx={{ mt: 4 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Tracking History</Typography>
                                <div className="space-y-3">
                                    {selectedOrder.tracking?.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-start p-3 bg-gray-50 rounded-lg">
                                            <div className="p-2 bg-green-100 rounded-full">
                                                <Clock size={16} className="text-green-700" />
                                            </div>
                                            <div>
                                                <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>{item.status.replace('_', ' ')}</Typography>
                                                <Typography variant="caption" color="textSecondary">{new Date(item.timestamp).toLocaleString()}</Typography>
                                                <Typography variant="body2" sx={{ mt: 0.5 }}>{item.message}</Typography>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetail(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Status Update Dialog */}
            <Dialog 
                open={openStatusUpdate} 
                onClose={() => setOpenStatusUpdate(false)}
                PaperProps={{
                    sx: { borderRadius: '24px', p: 1, minWidth: 450 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 900, textTransform: 'uppercase', tracking: '0.05em', pb: 1 }}>
                    Update Order Status
                </DialogTitle>
                <DialogContent>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 3, display: 'block', textTransform: 'uppercase', tracking: '0.1em' }}>
                        Transition order to a new phase
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="status-select-label">New Status</InputLabel>
                            <Select
                                labelId="status-select-label"
                                value={newStatus}
                                label="New Status"
                                onChange={(e) => setNewStatus(e.target.value)}
                                sx={{ borderRadius: '14px', fontWeight: 600 }}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="shipped">Shipped</MenuItem>
                                <MenuItem value="reached_store">Reached Store</MenuItem>
                                <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                                <MenuItem value="delivered">Delivered</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                                <MenuItem value="backorder">Backorder</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Tracking Message (Optional)"
                            multiline
                            rows={3}
                            fullWidth
                            value={statusMessage}
                            onChange={(e) => setStatusMessage(e.target.value)}
                            placeholder="e.g., Package has arrived at local hub..."
                            InputProps={{
                                sx: { borderRadius: '14px' }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button 
                        onClick={() => setOpenStatusUpdate(false)}
                        sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', px: 3 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleUpdateStatus} 
                        variant="contained" 
                        sx={{ 
                            bgcolor: '#0A7A2F', 
                            borderRadius: '12px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            px: 4,
                            '&:hover': { bgcolor: '#086325' },
                            boxShadow: '0 4px 14px 0 rgba(10, 122, 47, 0.39)'
                        }}
                    >
                        Update Phase
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminOrders;
