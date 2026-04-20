import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuthStore } from '../store/authStore'

const { Title, Text } = Typography

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form] = Form.useForm()

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const { token, usuario } = await login(values.email, values.password)
      setAuth(token, usuario)
      message.success(`Bienvenido, ${usuario.nombre}`)
      navigate('/dashboard')
    } catch {
      message.error('Credenciales incorrectas')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
    }}>
      <Card style={{ width: 400, borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#1890ff', margin: 0 }}>NexoSalud</Title>
          <Text type="secondary">Sistema de Gestión Hospitalaria</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item name="email" label="Correo electrónico"
            rules={[{ required: true, type: 'email', message: 'Ingresa un email válido' }]}>
            <Input prefix={<UserOutlined />} placeholder="admin@hospital.com" size="large" />
          </Form.Item>

          <Form.Item name="password" label="Contraseña"
            rules={[{ required: true, message: 'Ingresa tu contraseña' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}