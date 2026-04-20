import { Menu, Typography } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Text } = Typography

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/pacientes', icon: <TeamOutlined />,       label: 'Pacientes' },
  { key: '/citas',     icon: <CalendarOutlined />,   label: 'Citas'     },
  { key: '/medicos',   icon: <MedicineBoxOutlined />, label: 'Médicos'  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      {/* Logo */}
      <div style={{
        padding: '20px 16px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        marginBottom: 8,
      }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>
          🏥 Hospital
        </Text>
        <br />
        <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
          Sistema de Gestión
        </Text>
      </div>

      {/* Menú */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ borderRight: 0 }}
      />
    </>
  )
}