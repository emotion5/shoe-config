import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import * as THREE from 'three'
import Scene from './components/Scene'
import MaterialList from './components/MaterialList'
import DownloadController from './components/DownloadController'
import downloadIcon from './assets/icons/download.svg'
import styles from './App.module.css'

interface Config {
  models: { name: string, path: string }[]
  selectedModel: number
  modelScale: number
  modelPosition: [number, number, number]
  cameraPosition: [number, number, number]
  backgroundColor: string
}

function App() {
  const [config, setConfig] = useState<Config | null>(null)
  const [selectedModelIndex, setSelectedModelIndex] = useState<number>(0)
  const [materials, setMaterials] = useState<Record<string, THREE.Material>>({})

  useEffect(() => {
    // config.json 로드
    fetch('/config.json')
      .then(res => res.json())
      .then(data => {
        console.log('Config loaded:', data)
        setConfig(data)
        setSelectedModelIndex(data.selectedModel || 0)
      })
      .catch(err => console.error('Failed to load config:', err))
  }, [])

  const handleMaterialsFound = (foundMaterials: Record<string, THREE.Material>) => {
    console.log('Materials found in App:', Object.keys(foundMaterials))
    setMaterials(foundMaterials)
  }

  const handleModelChange = (index: number) => {
    setSelectedModelIndex(index)
    setMaterials({}) // 새 모델로 변경할 때 머티리얼 리스트 초기화
  }

  if (!config) {
    return <div className={styles.loading}>설정 파일 로딩 중...</div>
  }

  const currentModel = config.models[selectedModelIndex]

  const handleDownload = () => {
    // Canvas 내부의 DownloadController에 이벤트 전달
    window.dispatchEvent(new CustomEvent('capture-3d-scene'))
  }

  return (
    <div className={styles.container}>
      <div className={styles.canvasWrapper}>
        <Canvas 
          camera={{ position: config.cameraPosition, fov: 50 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            outputColorSpace: THREE.SRGBColorSpace,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
            preserveDrawingBuffer: true // 이미지 캡처를 위해 필요
          }}
          resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        >
          <Suspense fallback={null}>
            <Scene 
              modelPath={currentModel.path}
              modelScale={config.modelScale}
              modelPosition={config.modelPosition}
              onMaterialsFound={handleMaterialsFound}
            />
            <DownloadController />
          </Suspense>
        </Canvas>
        <button 
          className={styles.downloadButton}
          onClick={handleDownload}
          title="이미지 다운로드"
          aria-label="3D 모델 이미지 다운로드"
        >
          <img 
            src={downloadIcon} 
            alt="Download" 
            width="24" 
            height="24"
          />
        </button>
      </div>
      <div className={styles.logo}>
        <h1 className={styles.logoText}>Uable Configurator</h1>
      </div>
      <div className={styles.controls}>
        {config.models.length > 1 && (
          <div className={styles.modelSelector}>
            <label className={styles.selectorLabel}>모델 선택:</label>
            <select 
              value={selectedModelIndex}
              onChange={(e) => handleModelChange(Number(e.target.value))}
              className={styles.modelSelect}
            >
              {config.models.map((model, index) => (
                <option key={index} value={index}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <MaterialList materials={materials} />
        <button className={styles.contactButton}>문의하기</button>
      </div>
    </div>
  )
}

export default App
