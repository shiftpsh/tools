import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
} from '@mui/material'
import {
  IconChevronLeft,
  IconHome,
  IconMenu,
  IconQrcode,
} from '@tabler/icons-react'
import { createLink } from '@tanstack/react-router'
import { useState } from 'react'

const TOOLS = [
  {
    icon: <IconHome />,
    url: '/',
    label: 'Home',
  },
  {
    icon: <IconQrcode />,
    url: '/qr',
    label: 'QR Code',
  },
]

const RouterListItem = createLink(ListItem)

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <IconMenu />
          </IconButton>
          Tools by shiftpsh
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
        <DrawerHeader>
          <IconButton onClick={() => setIsOpen(false)}>
            <IconChevronLeft />
          </IconButton>
        </DrawerHeader>
        <List sx={{ width: 240, maxWidth: '100%' }}>
          {TOOLS.map((tool) => (
            <RouterListItem
              key={tool.url}
              to={tool.url}
              onClick={() => setIsOpen(false)}
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>{tool.icon}</ListItemIcon>
                <ListItemText primary={tool.label} />
              </ListItemButton>
            </RouterListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}
