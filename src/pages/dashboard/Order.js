import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { useEffect, useState, useCallback } from 'react';
import { IntlProvider, FormattedNumber } from 'react-intl';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import {
  getAllOrdersByStaffId,
  getAllOrdersByStore,
  confirmOrder,
} from '../../api';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  Collapse,
  Grid,
  Box,
  Pagination,
  Chip,
} from '@mui/material';
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaUserAlt, FaFirstOrder, FaBook } from 'react-icons/fa';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatDateTime } from '../../utils/helper';
const Order = (props) => {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [orders, setOrders] = useState([]);
  const [stores, setStore] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [phone, setPhone] = useState('');
  //const [orderStoreId, setOrderStoreId] = useState(0);
  const [orderStoreId, setOrderStoreId] = useState(uuidv4());
  const [OrderTime, setOrderTime] = useState('');
  const [desc, setDesc] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile) {
      getAllOrdersByStaffId(profile.id).then((res) => {
        setOrders(res);
      });
    }
  }, []);
  const handleClose = () => {
    setOpenAdd(false);
  };

  const handleConfirmOrder = (orderId) => {
    var confirmOrderPromise = confirmOrder(orderId)
      .then((res) => {
        setOrders(
          orders.map((order) => {
            if (order.orderStoreId === orderId) {
              return {
                ...order,
                orderStatus: 2,
              };
            }
            return order;
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
    toast.promise(confirmOrderPromise, {
      loading: 'Confirming',
      success: `Order ${orderId} confirmed`,
      error: `Order ${orderId} error`,
    });
  };

  const handleDetailOrder = useCallback(async (id) => {
    setOpenAdd(true);
    try {
      const orderDetail = await getAllOrdersByStore(id);
      setOrderDetail(orderDetail);
      setStore(stores);
      setTotal(orderDetail.total);
      setAddress(orderDetail.address);
      setTime(orderDetail.time);
      setName(orderDetail.store.name);
      setEmail(orderDetail.store.email);
      setImage(orderDetail.store.image);
      setAddress(orderDetail.store.address);
      setPhone(orderDetail.store.phone);
      setOrderStoreId(orderDetail.orderTracks.id);
      setOrderTime(orderDetail.orderTracks.time);
      setDesc(orderDetail.orderTracks.desc);
      setOrderStoreId(uuidv4());
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const paginatedOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const [open, setOpen] = React.useState(true);
  return (
    <IntlProvider locale='en'>
      <Wrapper>
        <form className='form'>
          <div className='container' style={{ width: '1500px' }}>
            <Table>
              <TableHead>
                <TableRow className='table-header image-header'>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                    <FaUserAlt /> Customer Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                    <FaFirstOrder />
                    Total Order
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                    <FaBook />
                    Order Address
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                    Status
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell width='20%'>{order.customerName}</TableCell>
                    <TableCell width='20%'>
                      <FormattedNumber
                        value={order.totalOrder}
                        displayType={'text'}
                        thousandSeparator={true}
                      />
                    </TableCell>
                    <TableCell width='50%'>{order.orderAddress}</TableCell>
                    <TableCell>
                      {order.orderStatus === 0 ? (
                        <Chip label='Cancelled' color='error' />
                      ) : order.orderStatus === 1 ? (
                        <Chip label='Processing' color='info' />
                      ) : (
                        <Chip label='Done' color='success' />
                      )}
                    </TableCell>
                    <TableCell>
                      {order.orderStatus > 0 && order.orderStatus < 2 ? (
                        <Button
                          variant='contained'
                          color='info'
                          onClick={() => handleConfirmOrder(order.orderStoreId)}
                        >
                          Confirm
                        </Button>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        color='info'
                        onClick={() => handleDetailOrder(order.orderStoreId)}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              count={Math.ceil(orders.length / itemsPerPage)}
              page={currentPage}
              onChange={handleChangePage}
              color='primary'
              className='pagination'
            />
          </div>
        </form>
        <Dialog open={openAdd} onClose={handleClose} maxWidth='md'>
          <DialogTitle
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '30px',
            }}
          >
            Order Detail
          </DialogTitle>
          <Grid container spacing={1}>
            <Grid item xs={11}>
              <Button
                onClick={handleClose}
                variant='contained'
                className='custom-close-button'
              >
                Close
              </Button>
            </Grid>
          </Grid>
          <DialogContent>
            {orderDetail?.status === 0 && (
              <Typography color='red' variant='subtitle1' textAlign='center'>
                Order is cancelled by customer
              </Typography>
            )}
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
              <TableCell>
                {orderDetail ? (
                  <form className='product-form'>
                    <div className='product-details'>
                      <div className='left-details'>
                        <div>
                          <label htmlFor='Total'>Total:</label>
                          <input
                            type='number'
                            id='total'
                            name='total'
                            value={total}
                            onChange={(e) => setTotal(e.target.value)}
                            disabled
                          />
                        </div>
                        <div>
                          <label htmlFor='address'>address:</label>
                          <input
                            type='text'
                            id='address'
                            name='address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled
                          />
                        </div>
                        <div>
                          <label htmlFor='time'>time:</label>
                          <input
                            type='text'
                            id='time'
                            name='time'
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            disabled
                          />
                        </div>
                        <div>
                          <label htmlFor='store Name'>Store Name</label>
                          <input
                            type='text'
                            id='storeName'
                            name='storeName'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled
                          />
                        </div>
                        <div>
                          <label htmlFor='email'>Email Store</label>
                          <input
                            type='text'
                            id='email'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled
                          />
                        </div>
                        <div>
                          <label htmlFor='address'>Address</label>
                          <input
                            type='text'
                            id='address'
                            name='address'
                            value={address}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled
                          />
                        </div>
                        <div>
                          <label htmlFor='phone'>Phone</label>
                          <input
                            type='text'
                            id='phone'
                            name='phone'
                            value={phone}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div>No Order selected</div>
                )}
                <IconButton aria-label='expand row' size='small'>
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                <TableRow style={{ width: '100%' }}>
                  <TableCell
                    style={{
                      paddingBottom: 0,
                      paddingTop: 0,
                      backgroundColor: '#e6f7ff',
                    }}
                    colSpan={6}
                  >
                    <Collapse
                      in={open}
                      timeout='auto'
                      unmountOnExit
                      disabled={true}
                    >
                      <Box sx={{ margin: 1 }}>
                        <Typography
                          variant='h6'
                          gutterBottom
                          component='div'
                          style={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                          Order History Tracks
                        </Typography>
                        <Table size='small' aria-label='purchases'>
                          <TableHead>
                            <TableRow>
                              <TableCell>Time Order</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          {orderDetail ? (
                            <TableBody>
                              {orderDetail.orderTracks.map(
                                (orderTrack, _id) => (
                                  <TableRow key={orderTrack._id}>
                                    <TableCell>
                                      {formatDateTime(orderTrack.time)}
                                    </TableCell>
                                    <TableCell>{orderTrack.desc}</TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          ) : (
                            <div>No Order selected</div>
                          )}
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>

                <TableCell
                  style={{
                    paddingBottom: 0,
                    paddingTop: 0,
                    backgroundColor: '#FFFF99',
                  }}
                  colSpan={6}
                >
                  <Collapse in={open} timeout='auto' unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                      <Typography
                        variant='h6'
                        gutterBottom
                        component='div'
                        style={{ textAlign: 'center', fontWeight: 'bold' }}
                      >
                        List Product Order
                      </Typography>
                      <Table size='small' aria-label='purchases'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                          </TableRow>
                        </TableHead>
                        {orderDetail ? (
                          <TableBody>
                            {orderDetail.products.map((product, _id) => (
                              <TableRow key={product.id}>
                                <TableCell component='th' scope='row'>
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className='product-image'
                                    style={{
                                      maxWidth: '50px',
                                      maxHeight: '50px',
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>
                                  <FormattedNumber
                                    value={product.price}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                  />
                                </TableCell>
                                <TableCell>{product.quantity}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        ) : (
                          <div>No Order selected</div>
                        )}
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableCell>
            </TableRow>
          </DialogContent>
        </Dialog>
      </Wrapper>
    </IntlProvider>
  );
};
export default Order;
