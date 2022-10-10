import { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Divider,
  FormHelperText,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Pizza } from '../types';
import { v4 } from 'uuid';
import {
  DataGrid,
  GridColumns,
  GridRowId,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import axios, { AxiosRequestConfig } from 'axios';
import { getToken } from '../utils';

type PizzaPendingOrder = Omit<Pizza, 'Timestamp' | 'Order_ID'> & {
  UUID: string;
  Quantity: number;
};
type PizzaPost = Pick<Pizza, 'Crust' | 'Flavor' | 'Size' | 'Table_No'>;

export const Order = () => {
  const [flavor, setFlavor] = useState('');
  const [crust, setCrust] = useState('');
  const [size, setSize] = useState('');
  const [table, setTable] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isValidOrder, setIsValidOrder] = useState(false);
  const [hasPressedAddToOrder, setHasPressedAddToOrder] = useState(false);
  const [order, setOrder] = useState<PizzaPendingOrder[]>([]);
  const [isSendingOrder, setIsSendingOrder] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState('');

  const handleFlavorChange = (event: SelectChangeEvent) =>
    setFlavor(event?.target.value);
  const handleCrustChange = (event: SelectChangeEvent) =>
    setCrust(event?.target.value);
  const handleSizeChange = (event: SelectChangeEvent) =>
    setSize(event?.target.value);
  const handleTableChange = (event: any) => {
    let value = +event.target.value;
    if (value < 0) value = 0;
    setTable(value);
  };
  const handleQuantityChange = (event: any) => {
    let value = +event.target.value;
    if (value < 1 || value > 1) value = 1;
    setQuantity(value);
  };
  const handleDeleteClick = (id: GridRowId) => {
    setOrder(order.filter((x) => x.UUID !== id));
  };

  const addToOrder = () => {
    setHasPressedAddToOrder(true);
    if (!isValidOrder) return;
    const pizzas: PizzaPendingOrder = {
      Crust: crust,
      Flavor: flavor,
      Size: size,
      Table_No: table,
      Quantity: quantity,
      UUID: v4(),
    };
    setOrder((curr) => [...curr, pizzas]);
  };

  const submitOrder = async () => {
    try {
      setIsSendingOrder(true);
      const token = await getToken();
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      for (const orderItem of order) {
        for (let i = 0; i < orderItem.Quantity; i++) {
          const postBody: PizzaPost = {
            Crust: orderItem.Crust,
            Flavor: orderItem.Flavor,
            Size: orderItem.Size,
            Table_No: orderItem.Table_No,
          };
          console.log('Posting order: ', postBody);
          await axios.post(
            'https://order-pizza-api.herokuapp.com/api/orders',
            postBody,
            config
          );
        }
      }
      setOpenSuccessSnackbar(true);
      setOrder([]);
    } catch (err: any) {
      setOpenErrorSnackbar(true);
      setErrorSnackbarMessage(err.message);
      console.log(err.message);
    } finally {
      setIsSendingOrder(false);
    }
  };

  const validateOrder = () => {
    const isValid =
      flavor.length > 0 &&
      crust.length > 0 &&
      size.length > 0 &&
      table > 0 &&
      quantity > 0;
    setIsValidOrder(isValid);
  };

  const closeSuccessSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccessSnackbar(false);
  };

  const closeErrorSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenErrorSnackbar(false);
    setErrorSnackbarMessage('');
  };

  useEffect(() => {
    validateOrder();
  });

  const columns: GridColumns = [
    { field: 'Flavor', headerName: 'Flavor', width: 300 },
    { field: 'Crust', headerName: 'Crust', width: 150 },
    { field: 'Size', headerName: 'Size' },
    { field: 'Table_No', headerName: 'Table', type: 'number' },
    { field: 'Quantity', headerName: 'Quantity', type: 'number' },
    {
      field: 'Delete',
      type: 'actions',
      headerName: 'Delete?',
      width: 100,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label='Delete'
          onClick={() => handleDeleteClick(id)}
          color='error'
        />,
      ],
    },
  ];

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>New Order</h1>
      <div style={{ textAlign: 'center' }}>
        <FormControl style={{ margin: '0px 10px 10px 10px' }}>
          <InputLabel>Flavor</InputLabel>
          <Select
            style={{ width: '200px' }}
            label='Flavor'
            value={flavor}
            onChange={handleFlavorChange}
            error={hasPressedAddToOrder && !flavor.length}
          >
            <MenuItem value='Cheese'>Cheese</MenuItem>
            <MenuItem value='Pepperoni'>Pepperoni</MenuItem>
            <MenuItem value='Veggie'>Veggie</MenuItem>
          </Select>
          <FormHelperText error={hasPressedAddToOrder && !flavor.length}>
            {hasPressedAddToOrder && !flavor.length ? 'Required' : ''}
          </FormHelperText>
        </FormControl>
        <FormControl style={{ margin: '0px 10px 10px 10px' }}>
          <InputLabel>Crust</InputLabel>
          <Select
            style={{ width: '200px' }}
            label='Crust'
            value={crust}
            onChange={handleCrustChange}
            error={hasPressedAddToOrder && !crust.length}
          >
            <MenuItem value='Thin'>Thin</MenuItem>
            <MenuItem value='Regular'>Regular</MenuItem>
            <MenuItem value='Deep Dish'>Deep Dish</MenuItem>
          </Select>
          <FormHelperText error={hasPressedAddToOrder && !crust.length}>
            {hasPressedAddToOrder && !crust.length ? 'Required' : ''}
          </FormHelperText>
        </FormControl>
        <FormControl style={{ margin: '0px 10px 10px 10px' }}>
          <InputLabel>Size</InputLabel>
          <Select
            style={{ width: '200px' }}
            label='Size'
            value={size}
            onChange={handleSizeChange}
            error={hasPressedAddToOrder && !size.length}
          >
            <MenuItem value='S'>S</MenuItem>
            <MenuItem value='M'>M</MenuItem>
            <MenuItem value='L'>L</MenuItem>
          </Select>
          <FormHelperText error={hasPressedAddToOrder && !size.length}>
            {hasPressedAddToOrder && !size.length ? 'Required' : ''}
          </FormHelperText>
        </FormControl>
        <TextField
          style={{ margin: '0px 10px 10px 10px', width: '100px' }}
          label='Table'
          variant='outlined'
          type={'number'}
          value={table}
          onChange={handleTableChange}
          error={hasPressedAddToOrder && table === 0}
          helperText={hasPressedAddToOrder && table === 0 ? 'Required' : ''}
        />
        <TextField
          style={{ margin: '0px 10px 10px 10px', width: '100px' }}
          label='Quantity'
          variant='outlined'
          type={'number'}
          value={quantity}
          onChange={handleQuantityChange}
          error={hasPressedAddToOrder && quantity === 0}
          helperText={hasPressedAddToOrder && quantity === 0 ? 'Required' : ''}
        />
      </div>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Button
          variant='outlined'
          size='large'
          color='secondary'
          onClick={addToOrder}
        >
          Add To Order
        </Button>
      </div>
      <Divider style={{ marginTop: '25px' }} />
      <h3 style={{ textAlign: 'center' }}>Order Details</h3>
      <div style={{ height: 400, width: '100%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              columns={columns}
              rows={order}
              getRowId={(row) => row.UUID}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              disableColumnSelector
              disableDensitySelector
            />
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button
          variant='contained'
          size='large'
          color='secondary'
          disabled={order.length === 0 || isSendingOrder}
          onClick={submitOrder}
        >
          Submit Order
        </Button>
      </div>
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={5000}
        onClose={closeSuccessSnackbar}
      >
        <Alert
          onClose={closeSuccessSnackbar}
          severity='success'
          sx={{ width: '100%' }}
        >
          Order Placed!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={5000}
        onClose={closeErrorSnackbar}
        message={errorSnackbarMessage}
      >
        <Alert
          onClose={closeErrorSnackbar}
          severity='error'
          sx={{ width: '100%' }}
        >
          {errorSnackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
