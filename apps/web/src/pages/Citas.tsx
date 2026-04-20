import { useEffect, useState } from 'react'
import {
  Table, Button, Modal, Form, Select, Space,
  Popconfirm, Tag, Typography, message, Input, Row, Col,
} from 'antd'
import { PlusOutlined, DeleteOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import { getCitas, createCita, updateEstadoCita, deleteCita } from '../api/citas'
import { getPacientes } from '../api/pacientes'
import { getMedicos } from '../api/medicos'
import type { Cita, Paciente, Medico } from '../types'

const { Title } = Typography

const ESTADO_COLORS: Record<string, string> = {
  PROGRAMADA: 'blue',
  EN_CURSO:   'orange',
  COMPLETADA: 'green',
  CANCELADA:  'red',
}

export default function Citas() {
  const [citas, setCitas]         = useState<Cita[]>([])
  const [filtradas, setFiltradas] = useState<Cita[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [medicos, setMedicos]     = useState<Medico[]>([])
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS')
  const [form] = Form.useForm()

  const cargar = async () => {
    setLoading(true)
    try {
      const [c, p, m] = await Promise.all([
        getCitas(), getPacientes(), getMedicos(),
      ])
      setCitas(c)
      setFiltradas(c)
      setPacientes(p)
      setMedicos(m)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  useEffect(() => {
    setFiltradas(
      filtroEstado === 'TODOS'
        ? citas
        : citas.filter((c) => c.estado === filtroEstado)
    )
  }, [filtroEstado, citas])

  const handleCrear = async () => {
    try {
      const values = await form.validateFields()
      await createCita(values)
      message.success('Cita creada')
      setModalOpen(false)
      form.resetFields()
      cargar()
    } catch {
      message.error('Error al crear cita')
    }
  }

  const handleEstado = async (id: number, estado: Cita['estado']) => {
    try {
      await updateEstadoCita(id, estado)
      message.success('Estado actualizado')
      cargar()
    } catch {
      message.error('Error al actualizar estado')
    }
  }

  const handleEliminar = async (id: number) => {
    try {
      await deleteCita(id)
      message.success('Cita eliminada')
      cargar()
    } catch {
      message.error('Error al eliminar')
    }
  }

  const columnas = [
    {
      title: 'Paciente',
      render: (_: any, r: Cita) =>
        r.paciente ? `${r.paciente.nombre} ${r.paciente.apellido}` : '—',
    },
    {
      title: 'Médico',
      render: (_: any, r: Cita) =>
        r.medico ? `Dr. ${r.medico.apellido} — ${r.medico.especialidad}` : '—',
    },
    {
      title: 'Fecha y hora',
      dataIndex: 'fechaHora',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY HH:mm'),
      sorter: (a: Cita, b: Cita) =>
        dayjs(a.fechaHora).unix() - dayjs(b.fechaHora).unix(),
    },
    {
      title: 'Motivo',
      dataIndex: 'motivo',
      render: (v: string) => v || '—',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      render: (v: Cita['estado'], r: Cita) => (
        <Select
          value={v}
          size="small"
          style={{ width: 130 }}
          onChange={(val) => handleEstado(r.id, val)}
        >
          {Object.keys(ESTADO_COLORS).map((e) => (
            <Select.Option key={e} value={e}>
              <Tag color={ESTADO_COLORS[e]}>{e}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Acciones',
      render: (_: any, r: Cita) => (
        <Popconfirm
          title="¿Eliminar cita?"
          onConfirm={() => handleEliminar(r.id)}
          okText="Sí" cancelText="No"
        >
          <Button icon={<DeleteOutlined />} size="small" danger />
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Citas</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Nueva cita
        </Button>
      </div>

      {/* Filtro por estado */}
      <Space style={{ marginBottom: 16 }}>
        <span>Filtrar por estado:</span>
        {['TODOS', 'PROGRAMADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA'].map((e) => (
          <Button
            key={e}
            size="small"
            type={filtroEstado === e ? 'primary' : 'default'}
            onClick={() => setFiltroEstado(e)}
          >
            {e}
          </Button>
        ))}
      </Space>

      <Table
        dataSource={filtradas}
        columns={columnas}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Nueva cita"
        open={modalOpen}
        onOk={handleCrear}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        okText="Crear" cancelText="Cancelar"
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="pacienteId" label="Paciente"
            rules={[{ required: true, message: 'Selecciona un paciente' }]}>
            <Select
              showSearch placeholder="Buscar paciente"
              filterOption={(input, option) =>
                String(option?.children).toLowerCase().includes(input.toLowerCase())
              }
            >
              {pacientes.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.nombre} {p.apellido}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="medicoId" label="Médico"
            rules={[{ required: true, message: 'Selecciona un médico' }]}>
            <Select
              showSearch placeholder="Buscar médico"
              filterOption={(input, option) =>
                String(option?.children).toLowerCase().includes(input.toLowerCase())
              }
            >
              {medicos.filter((m) => m.activo).map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  Dr. {m.nombre} {m.apellido} — {m.especialidad}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="fechaHora" label="Fecha y hora"
                rules={[{ required: true, message: 'Requerido' }]}>
                <Input type="datetime-local" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="motivo" label="Motivo">
            <Input.TextArea rows={3} placeholder="Motivo de la consulta..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}