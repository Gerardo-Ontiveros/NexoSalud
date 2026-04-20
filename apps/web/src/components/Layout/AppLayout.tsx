import { Layout, Menu, Avatar, Dropdown, Typography } from 'antd'
import {
  DashboardOutlined, TeamOutlined, CalendarOutlined,
  MedicineBoxOutlined, LogoutOutlined, UserOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import AccessibilityButton from '../A11y/A11yButton'

const { Sider, Header, Content } = Layout
const { Text } = Typography

const menuItems = [
  { key: '/dashboard',  icon: <DashboardOutlined />,   label: 'Dashboard'  },
  { key: '/pacientes',  icon: <TeamOutlined />,         label: 'Pacientes'  },
  { key: '/citas',      icon: <CalendarOutlined />,     label: 'Citas'      },
  { key: '/medicos',    icon: <MedicineBoxOutlined />,  label: 'Médicos'    },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { usuario, logout } = useAuthStore()

  const userMenu = {
    items: [
      { key: 'logout', icon: <LogoutOutlined />, label: 'Cerrar sesión', danger: true }
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') { logout(); navigate('/login') }
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" breakpoint="lg" collapsedWidth={0}>
        <div style={{ padding: '20px 16px', textAlign: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>NexoSalud</Text>
        </div>
        <Menu
          theme="dark" mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header style={{
          background: '#fff', padding: '0 24px',
          display: 'flex', justifyContent: 'flex-end',
          alignItems: 'center', gap: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          <Dropdown menu={userMenu} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} style={{ background: '#1890ff' }} />
              <Text>{usuario?.nombre}</Text>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>

        <div style={{
        position: 'fixed',
        bottom: '24px',  
        right: '24px',   
        zIndex: 1000
      }}>
        <AccessibilityButton />
      </div>
      </Layout>
    </Layout>
  )
}