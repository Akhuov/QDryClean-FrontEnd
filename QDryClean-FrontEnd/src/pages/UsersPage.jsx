import React from "react";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  AppBar,
  Toolbar,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Dashboard,
  ShoppingCart,
  People,
  Build,
  Settings,
  Search,
} from "@mui/icons-material";

const drawerWidth = 240;

const customers = [
  {
    name: "Sophia Clark",
    phone: "(555) 123-4567",
    email: "sophia.clark@email.com",
    address: "123 Maple Street, Anytown",
    orders: 5,
  },
  {
    name: "Ethan Bennett",
    phone: "(555) 987-6543",
    email: "ethan.bennett@email.com",
    address: "456 Oak Avenue, Anytown",
    orders: 3,
  },
  {
    name: "Olivia Carter",
    phone: "(555) 246-8013",
    email: "olivia.carter@email.com",
    address: "789 Pine Lane, Anytown",
    orders: 7,
  },
  {
    name: "Liam Davis",
    phone: "(555) 369-1215",
    email: "liam.davis@email.com",
    address: "321 Cedar Road, Anytown",
    orders: 2,
  },
  {
    name: "Ava Foster",
    phone: "(555) 482-5679",
    email: "ava.foster@email.com",
    address: "654 Birch Court, Anytown",
    orders: 4,
  },
];

export default function CustomersPage() {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "background.paper",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Cleanly
          </Typography>
        </Box>
        <List>
          {[
            { text: "Dashboard", icon: <Dashboard /> },
            { text: "Orders", icon: <ShoppingCart /> },
            { text: "Customers", icon: <People />, selected: true },
            { text: "Services", icon: <Build /> },
            { text: "Settings", icon: <Settings /> },
          ].map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton selected={item.selected}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ p: 2 }}>
          <Button variant="contained" fullWidth>
            New Order
          </Button>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{ mb: 3 }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h4" fontWeight="bold">
              Customers
            </Typography>
            <Button variant="contained">New Customer</Button>
          </Toolbar>
        </AppBar>

        {/* Search */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search customers"
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
            }}
          />
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="right">Orders</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell align="right">{row.orders}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
