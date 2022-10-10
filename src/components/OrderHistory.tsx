import { useEffect, useState } from 'react';
import { Pizza } from '../types';
import axios, { AxiosRequestConfig } from 'axios';
import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRowId,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { getToken } from '../utils';

export const OrderHistory = () => {
  const [orders, setOrders] = useState<Pizza[]>([]);

  useEffect(() => {
    loadOrderHistory();
  }, []);

  const loadOrderHistory = async () => {
    try {
      const token = await getToken();
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get<Pizza[]>(
        'https://order-pizza-api.herokuapp.com/api/orders',
        config
      );
      setOrders(response.data);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleDeleteClick = async (id: GridRowId) => {
    try {
      await axios.delete(
        `https://order-pizza-api.herokuapp.com/api/orders/${id}`
      );
      setOrders(orders.filter((x) => x.Order_ID !== id));
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const columns: GridColumns = [
    { field: 'Flavor', headerName: 'Flavor', width: 300 },
    { field: 'Crust', headerName: 'Crust', width: 150 },
    { field: 'Size', headerName: 'Size' },
    { field: 'Table_No', headerName: 'Table', type: 'number' },
    {
      field: 'Timestamp',
      headerName: 'Ordered At',
      type: 'dateTime',
      width: 250,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleString('en-US'),
    },
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
      <h1 style={{ textAlign: 'center' }}>Order History</h1>
      <div style={{ height: 400, width: '100%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              columns={columns}
              rows={orders}
              getRowId={(row) => row.Order_ID}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              disableColumnSelector
              disableDensitySelector
            />
          </div>
        </div>
      </div>
    </>
  );
};
