import { useNavigate } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export const SidebarItems = () => {
  const navigate = useNavigate();
  return (
    <>
      <ListItemButton onClick={() => navigate('/order')}>
        <ListItemIcon>
          <LocalPizzaIcon />
        </ListItemIcon>
        <ListItemText primary='New Order' />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/history')}>
        <ListItemIcon>
          <ReceiptLongIcon />
        </ListItemIcon>
        <ListItemText primary='Order History' />
      </ListItemButton>
    </>
  );
};
