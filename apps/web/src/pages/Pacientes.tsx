import { useEffect, useState } from 'react'
import {
  Table, Button, Modal, Form, Input, Select,
  Space, Popconfirm, Tag, Typography, message, Row, Col,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  getPacientes, createPaciente,
  updatePaciente, deletePaciente,
} from '../api/pacientes'
import type { Paciente } from '../types'
import { useAuthStore } from '../store/authStore'

const { Title } = Typography

const TIPOS_SANGRE = ['A+','A-','B+','B-','AB+','AB-','O+','O-']

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [filtrados, setFiltrados] = useState<Paciente[]>([])
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando]   = useState<Paciente | null>(null)
  const [busqueda, setBusqueda]   = useState('')
  const [form] = Form.useForm()
  const { usuario } = useAuthStore()

  const cargar = async () => {
    setLoading(true)
    try {
      const data = await getPacientes()
      setPacientes(data)
      setFiltrados(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  // Filtro de búsqueda
  useEffect(() => {
    const q = busqueda.toLowerCase()
    setFiltrados(
      pacientes.filter((p) =>
        `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.telefono?.includes(q)
      )
    )
  }, [busqueda, pacientes])

  const abrirCrear = () => {
    setEditando(null)
    form.resetFields()
    setModalOpen(true)
  }

  const abrirEditar = (paciente: Paciente) => {
    setEditando(paciente)
    form.setFieldsValue({
      ...paciente,
      fechaNacimiento: paciente.fechaNacimiento?.split('T')[0],
    })
    setModalOpen(true)
  }

  const handleGuardar = async () => {
    try {
      const values = await form.validateFields()
      if (editando) {
        await updatePaciente(editando.id, values)
        message.success('Paciente actualizado')
      } else {
        await createPaciente(values)
        message.success('Paciente creado')
      }
      setModalOpen(false)
      cargar()
    } catch {
      message.error('Error al guardar')
    }
  }

  const handleEliminar = async (id: number) => {
    try {
      await deletePaciente(id)
      message.success('Paciente eliminado')
      cargar()
    } catch {
      message.error('Error al eliminar')
    }
  }

  const columnas = [
    {
      title: 'Nombre',
      render: (_: any, r: Paciente) => `${r.nombre} ${r.apellido}`,
      sorter: (a: Paciente, b: Paciente) =>
        a.apellido.localeCompare(b.apellido),
    },
    {
      title: 'Fecha Nac.',
      dataIndex: 'fechaNacimiento',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
    },
    { title: 'Teléfono', dataIndex: 'telefono', render: (v: string) => v || '—' },
    { title: 'Email',    dataIndex: 'email',    render: (v: string) => v || '—' },
    {
      title: 'Tipo Sangre',
      dataIndex: 'tipoSangre',
      render: (v: string) => v
        ? <Tag color="red">{v}</Tag>
        : '—',
    },
    {
      title: 'Acciones',
      render: (_: any, r: Paciente) => (
        <Space>
          <Button
            icon={<EditOutlined />} size="small"
            onClick={() => abrirEditar(r)}
          />
          {usuario?.rol === 'ADMIN' && (
            <Popconfirm
              title="¿Eliminar paciente?"
              onConfirm={() => handleEliminar(r.id)}
              okText="Sí" cancelText="No"
            >
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Pacientes</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={abrirCrear}>
          Nuevo paciente
        </Button>
      </div>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Buscar por nombre, email o teléfono..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 400 }}
      />

      <Table
        dataSource={filtrados}
        columns={columnas}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editando ? 'Editar paciente' : 'Nuevo paciente'}
        open={modalOpen}
        onOk={handleGuardar}
        onCancel={() => setModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="nombre" label="Nombre"
                rules={[{ required: true, message: 'Requerido' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="apellido" label="Apellido"
                rules={[{ required: true, message: 'Requerido' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="fechaNacimiento" label="Fecha de nacimiento"
                rules={[{ required: true, message: 'Requerido' }]}>
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="genero" label="Género">
                <Select placeholder="Selecciona">
                  <Select.Option value="masculino">Masculino</Select.Option>
                  <Select.Option value="femenino">Femenino</Select.Option>
                  <Select.Option value="otro">Otro</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email"
                rules={[{ type: 'email', message: 'Email inválido' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="telefono" label="Teléfono">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="tipoSangre" label="Tipo de sangre">
                <Select placeholder="Selecciona">
                  {TIPOS_SANGRE.map((t) => (
                    <Select.Option key={t} value={t}>{t}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="direccion" label="Dirección">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}