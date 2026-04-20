import { useEffect, useState } from 'react'
import {
  Row, Col, Card, Statistic, Table, Tag, Typography,
  Spin, Empty
} from 'antd'
import {
  TeamOutlined, MedicineBoxOutlined,
  CalendarOutlined, ClockCircleOutlined,
} from '@ant-design/icons'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import dayjs from 'dayjs'
import { getCitas } from '../api/citas'
import { getPacientes } from '../api/pacientes'
import { getMedicos } from '../api/medicos'
import type { Cita, Paciente, Medico } from '../types'

const { Title } = Typography

const ESTADO_COLORS: Record<string, string> = {
  PROGRAMADA: '#1890ff',
  EN_CURSO:   '#faad14',
  COMPLETADA: '#52c41a',
  CANCELADA:  '#ff4d4f',
}

export default function Dashboard() {
  const [citas, setCitas]       = useState<Cita[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [medicos, setMedicos]   = useState<Medico[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [c, p, m] = await Promise.all([
          getCitas(), getPacientes(), getMedicos(),
        ])
        setCitas(c)
        setPacientes(p)
        setMedicos(m)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Estadísticas derivadas
  const hoy = dayjs().format('YYYY-MM-DD')
  const citasHoy = citas.filter((c) =>
    dayjs(c.fechaHora).format('YYYY-MM-DD') === hoy
  ).length

  const citasPendientes = citas.filter(
    (c) => c.estado === 'PROGRAMADA' || c.estado === 'EN_CURSO'
  ).length

  // Citas por estado para PieChart
  const citasPorEstado = Object.entries(
    citas.reduce((acc, c) => {
      acc[c.estado] = (acc[c.estado] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([estado, value]) => ({ name: estado, value }))

  // Citas últimos 7 días para BarChart
  const ultimos7 = Array.from({ length: 7 }, (_, i) => {
    const fecha = dayjs().subtract(6 - i, 'day')
    return {
      fecha: fecha.format('DD/MM'),
      cantidad: citas.filter((c) =>
        dayjs(c.fechaHora).format('YYYY-MM-DD') === fecha.format('YYYY-MM-DD')
      ).length,
    }
  })

  // Próximas citas para tabla
  const proximasCitas = citas
    .filter((c) => c.estado === 'PROGRAMADA' && dayjs(c.fechaHora).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.fechaHora).unix() - dayjs(b.fechaHora).unix())
    .slice(0, 5)

  const columnasCitas = [
    {
      title: 'Paciente',
      dataIndex: ['paciente'],
      render: (_: any, r: Cita) =>
        r.paciente ? `${r.paciente.nombre} ${r.paciente.apellido}` : '—',
    },
    {
      title: 'Médico',
      dataIndex: ['medico'],
      render: (_: any, r: Cita) =>
        r.medico ? `Dr. ${r.medico.apellido}` : '—',
    },
    {
      title: 'Fecha y hora',
      dataIndex: 'fechaHora',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      render: (v: string) => (
        <Tag color={ESTADO_COLORS[v]}>{v}</Tag>
      ),
    },
  ]

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <Spin size="large" />
    </div>
  )

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Dashboard</Title>

      {/* Tarjetas de estadísticas */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title="Total Pacientes"
              value={pacientes.length}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title="Médicos Activos"
              value={medicos.filter((m) => m.activo).length}
              prefix={<MedicineBoxOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title="Citas Hoy"
              value={citasHoy}
              prefix={<CalendarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title="Citas Pendientes"
              value={citasPendientes}
              prefix={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Gráficas */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card title="Citas últimos 7 días">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ultimos7}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#1890ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Citas por estado">
            {citasPorEstado.length === 0 ? (
              <Empty description="Sin datos" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={citasPorEstado}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    dataKey="value" nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {citasPorEstado.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={ESTADO_COLORS[entry.name] || '#8884d8'}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      {/* Próximas citas */}
      <Card title="Próximas citas">
        <Table
          dataSource={proximasCitas}
          columns={columnasCitas}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'No hay citas próximas' }}
        />
      </Card>
    </div>
  )
}