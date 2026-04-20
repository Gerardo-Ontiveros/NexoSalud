import { useEffect, useState } from 'react'
import {
  Table, Button, Modal, Form, Input, Space,
  Popconfirm, Tag, Typography, message, Switch, Row, Col, Select 
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { getMedicos, createMedico, updateMedico, deleteMedico } from '../api/medicos'
import type { Medico } from '../types'
import { useAuthStore } from '../store/authStore'

const { Title } = Typography

const ESPECIALIDADES = [
  'Medicina General','Cardiología','Pediatría','Neurología',
  'Ortopedia','Ginecología','Dermatología','Oftalmología',
  'Psiquiatría','Oncología',
]

export default function Medicos() {
  const [medicos, setMedicos]     = useState<Medico[]>([])
  const [filtrados, setFiltrados] = useState<Medico[]>([])
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando]   = useState<Medico | null>(null)
  const [busqueda, setBusqueda]   = useState('')
  const [form] = Form.useForm()
  const { usuario } = useAuthStore()

  const cargar = async () => {
    setLoading(true)
    try {
      const data = await getMedicos()
      setMedicos(data)
      setFiltrados(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  useEffect(() => {
    const q = busqueda.toLowerCase()
    setFiltrados(
      medicos.filter((m) =>
        `${m.nombre} ${m.apellido}`.toLowerCase().includes(q) ||
        m.especialidad.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      )
    )
  }, [busqueda, medicos])

  const abrirCrear = () => {
    setEditando(null)
    form.resetFields()
    setModalOpen(true)
  }

  const abrirEditar = (medico: Medico) => {
    setEditando(medico)
    form.setFieldsValue(medico)
    setModalOpen(true)
  }

  const handleGuardar = async () => {
    try {
      const values = await form.validateFields()
      if (editando) {
        await updateMedico(editando.id, values)
        message.success('Médico actualizado')
      } else {
        await createMedico(values)
        message.success('Médico creado')
      }
      setModalOpen(false)
      cargar()
    } catch {
      message.error('Error al guardar')
    }
  }

  const handleEliminar = async (id: number) => {
    try {
      await deleteMedico(id)
      message.success('Médico eliminado')
      cargar()
    } catch {
      message.error('Error al eliminar')
    }
  }

  const columnas = [
    {
      title: 'Nombre',
      render: (_: any, r: Medico) => `Dr. ${r.nombre} ${r.apellido}`,
      sorter: (a: Medico, b: Medico) => a.apellido.localeCompare(b.apellido),
    },
    { title: 'Especialidad', dataIndex: 'especialidad' },
    { title: 'Email',        dataIndex: 'email'        },
    { title: 'Teléfono',     dataIndex: 'telefono', render: (v: string) => v || '—' },
    {
      title: 'Estado',
      dataIndex: 'activo',
      render: (v: boolean) => (
        <Tag color={v ? 'green' : 'red'}>{v ? 'Activo' : 'Inactivo'}</Tag>
      ),
    },
    {
      title: 'Acciones',
      render: (_: any, r: Medico) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => abrirEditar(r)} />
          {usuario?.rol === 'ADMIN' && (
            <Popconfirm
              title="¿Eliminar médico?"
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
        <Title level={3} style={{ margin: 0 }}>Médicos</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={abrirCrear}>
          Nuevo médico
        </Button>
      </div>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Buscar por nombre, especialidad o email..."
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
        title={editando ? 'Editar médico' : 'Nuevo médico'}
        open={modalOpen}
        onOk={handleGuardar}
        onCancel={() => setModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
        width={560}
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
              <Form.Item name="especialidad" label="Especialidad"
                rules={[{ required: true, message: 'Requerido' }]}>
                <Select placeholder="Selecciona">
                  {ESPECIALIDADES.map((e) => (
                    <Select.Option key={e} value={e}>{e}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="telefono" label="Teléfono">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="email" label="Email"
                rules={[{ required: true, type: 'email', message: 'Email válido requerido' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="activo" label="Activo" valuePropName="checked"
                initialValue={true}>
                <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}