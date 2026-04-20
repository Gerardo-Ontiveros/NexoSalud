import { useState } from 'react'
import { Button, Drawer, Switch, Radio, Space, Typography, Divider, Tooltip } from 'antd'
import { useAccessibilityStore } from '../../store/a11yStore'

const { Title, Text } = Typography

export default function AccessibilityButton() {
  const [open, setOpen] = useState(false)
  const { fontSize, highContrast, reducedMotion,
    setFontSize, toggleHighContrast, toggleReducedMotion, reset } =
    useAccessibilityStore()

  return (
    <>
<Tooltip title="Opciones de accesibilidad" placement="left">
        <Button
          type="primary" // Le da color azul (o tu color principal) para que resalte
          shape="circle" // Lo hace perfectamente redondo
          style={{ 
            width: '60px',    // Ancho del botón
            height: '60px',   // Alto del botón
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)' // Sombra para que parezca flotar sobre el contenido
          }}
          icon={
            <span style={{ fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined">
                accessibility
              </span>
            </span>
          }
          onClick={() => setOpen(true)}
          aria-label="Abrir opciones de accesibilidad"
        />
      </Tooltip>
      <Drawer
        title="⚙️ Accesibilidad"
        open={open}
        onClose={() => setOpen(false)}
        width={320}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>

          <div>
            <Title level={5}>Tamaño de texto</Title>
            <Radio.Group value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
              <Radio.Button value="normal">Normal</Radio.Button>
              <Radio.Button value="large">Grande</Radio.Button>
              <Radio.Button value="xlarge">Extra grande</Radio.Button>
            </Radio.Group>
          </div>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>Alto contraste</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>Mejora la visibilidad</Text>
            </div>
            <Switch checked={highContrast} onChange={toggleHighContrast} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>Reducir animaciones</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>Para sensibilidad al movimiento</Text>
            </div>
            <Switch checked={reducedMotion} onChange={toggleReducedMotion} />
          </div>

          <Divider />

          <Button block onClick={reset}>Restablecer valores</Button>
        </Space>
      </Drawer>
    </>
  )
}