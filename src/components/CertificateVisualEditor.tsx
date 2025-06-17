"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Type,
  ImageIcon,
  Square,
  Upload,
  Trash2,
  Copy,
  Eye,
  Download,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react"
import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface CertificateElement {
  id: string
  type: "text" | "image" | "shape"
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  content?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  fontStyle?: string
  textAlign?: "left" | "center" | "right"
  color?: string
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  opacity?: number
  src?: string
  shapeType?: "rectangle" | "circle" | "line"
  textDecoration?: string
}

interface CertificateBackground {
  type: "color" | "gradient" | "image"
  color?: string
  gradientStart?: string
  gradientEnd?: string
  gradientDirection?: string
  imageUrl?: string
  imagePosition?: string
  imageSize?: string
  opacity?: number
}

interface CertificateVisualEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (htmlContent: string) => void
  initialData?: any
}

export function CertificateVisualEditor({ isOpen, onClose, onSave, initialData }: CertificateVisualEditorProps) {
  const [elements, setElements] = useState<CertificateElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [background, setBackground] = useState<CertificateBackground>({
    type: "color",
    color: "#ffffff",
    opacity: 1,
  })
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(0.5)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const backgroundFileInputRef = useRef<HTMLInputElement>(null)

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault()
    setSelectedElement(elementId)
    setIsDragging(true)

    const element = elements.find((el) => el.id === elementId)
    if (element && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const offsetX = e.clientX - rect.left - element.x * zoom
      const offsetY = e.clientY - rect.top - element.y * zoom
      setDragOffset({ x: offsetX, y: offsetY })
    }
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && selectedElement && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - dragOffset.x) / zoom
        const y = (e.clientY - rect.top - dragOffset.y) / zoom

        // Atualizar a posição do elemento
        updateElement(selectedElement, { x: Math.max(0, x), y: Math.max(0, y) })
      }
    },
    [isDragging, selectedElement, dragOffset, zoom],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const addElement = (type: CertificateElement["type"]) => {
    const newElement: CertificateElement = {
      id: `element-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === "text" ? 300 : 150,
      height: type === "text" ? 50 : 150,
      rotation: 0,
      zIndex: elements.length + 1,
      opacity: 1,
      ...(type === "text" && {
        content: "Texto do Certificado",
        fontSize: 24,
        fontFamily: "Inter",
        fontWeight: "normal",
        fontStyle: "normal",
        textAlign: "center",
        color: "#000000",
      }),
      ...(type === "image" && {
        src: "/placeholder.svg?height=150&width=150",
      }),
      ...(type === "shape" && {
        shapeType: "rectangle",
        backgroundColor: "#3b82f6",
        borderColor: "#1e40af",
        borderWidth: 2,
        borderRadius: 8,
      }),
    }

    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  const updateElement = (id: string, updates: Partial<CertificateElement>) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, ...updates } : el)))
  }

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id))
    if (selectedElement === id) {
      setSelectedElement(null)
    }
  }

  const duplicateElement = (id: string) => {
    const element = elements.find((el) => el.id === id)
    if (element) {
      const newElement = {
        ...element,
        id: `element-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20,
        zIndex: elements.length + 1,
      }
      setElements([...elements, newElement])
      setSelectedElement(newElement.id)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        if (selectedElement) {
          updateElement(selectedElement, { src: imageUrl })
        } else {
          const newElement: CertificateElement = {
            id: `element-${Date.now()}`,
            type: "image",
            x: 100,
            y: 100,
            width: 200,
            height: 200,
            rotation: 0,
            zIndex: elements.length + 1,
            opacity: 1,
            src: imageUrl,
          }
          setElements([...elements, newElement])
          setSelectedElement(newElement.id)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setBackground({ ...background, type: "image", imageUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const generateHTML = () => {
    const backgroundStyle = (() => {
      switch (background.type) {
        case "color":
          return `background-color: ${background.color}`
        case "gradient":
          return `background: linear-gradient(${background.gradientDirection || "to right"}, ${
            background.gradientStart
          }, ${background.gradientEnd})`
        case "image":
          return `background-image: url(${background.imageUrl}); background-size: ${
            background.imageSize || "cover"
          }; background-position: ${background.imagePosition || "center"}`
        default:
          return "background-color: #ffffff"
      }
    })()

    const elementsHTML = elements
      .sort((a, b) => a.zIndex - b.zIndex)
      .map((element) => {
        const commonStyles = `
          position: absolute;
          left: ${element.x}px;
          top: ${element.y}px;
          width: ${element.width}px;
          height: ${element.height}px;
          transform: rotate(${element.rotation}deg);
          opacity: ${element.opacity};
          z-index: ${element.zIndex};
        `

        switch (element.type) {
          case "text":
            return `
              <div style="${commonStyles}
                font-size: ${element.fontSize}px;
                font-family: ${element.fontFamily};
                font-weight: ${element.fontWeight};
                font-style: ${element.fontStyle};
                text-align: ${element.textAlign};
                color: ${element.color};
                text-decoration: ${element.textDecoration || "none"};
                display: flex;
                align-items: center;
                justify-content: ${element.textAlign === "left" ? "flex-start" : element.textAlign === "right" ? "flex-end" : "center"};
              ">
                ${element.content}
              </div>
            `
          case "image":
            return `
              <img src="${element.src}" style="${commonStyles}
                object-fit: contain;
              " alt="Certificate Image" />
            `
          case "shape":
            return `
              <div style="${commonStyles}
                background-color: ${element.backgroundColor};
                border: ${element.borderWidth}px solid ${element.borderColor};
                border-radius: ${element.shapeType === "circle" ? "50%" : `${element.borderRadius}px`};
              "></div>
            `
          default:
            return ""
        }
      })
      .join("")

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificado Personalizado</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: #f5f5f5;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        .certificate {
            width: ${canvasSize.width}px;
            height: ${canvasSize.height}px;
            ${backgroundStyle};
            opacity: ${background.opacity};
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
                background: none;
            }
            
            .certificate {
                width: 100%;
                height: 100%;
                box-shadow: none;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="certificate">
        ${elementsHTML}
    </div>
</body>
</html>`
  }

  const selectedEl = elements.find((el) => el.id === selectedElement)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex">
      {/* Painel Lateral */}
      <div className="w-80 bg-white border-r flex flex-col max-h-screen overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Editor de Certificados</h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="elements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="elements">Elementos</TabsTrigger>
              <TabsTrigger value="background">Fundo</TabsTrigger>
              <TabsTrigger value="properties">Propriedades</TabsTrigger>
            </TabsList>

            <TabsContent value="elements" className="p-4 space-y-4">
              <div>
                <Label className="text-sm font-medium">Adicionar Elementos</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addElement("text")}
                    className="flex flex-col gap-1 h-16"
                  >
                    <Type className="h-4 w-4" />
                    <span className="text-xs">Texto</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col gap-1 h-16"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-xs">Imagem</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addElement("shape")}
                    className="flex flex-col gap-1 h-16"
                  >
                    <Square className="h-4 w-4" />
                    <span className="text-xs">Forma</span>
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Camadas ({elements.length})</Label>
                <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                  {elements
                    .sort((a, b) => b.zIndex - a.zIndex)
                    .map((element) => (
                      <div
                        key={element.id}
                        className={cn(
                          "flex items-center justify-between p-2 border rounded cursor-pointer",
                          selectedElement === element.id ? "border-blue-500 bg-blue-50" : "border-gray-200",
                        )}
                        onClick={() => setSelectedElement(element.id)}
                      >
                        <div className="flex items-center gap-2">
                          {element.type === "text" && <Type className="h-4 w-4" />}
                          {element.type === "image" && <ImageIcon className="h-4 w-4" />}
                          {element.type === "shape" && <Square className="h-4 w-4" />}
                          <span className="text-sm">
                            {element.type === "text" ? element.content?.slice(0, 15) + "..." : element.type}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => duplicateElement(element.id)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteElement(element.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="background" className="p-4 space-y-4">
              <div>
                <Label className="text-sm font-medium">Tipo de Fundo</Label>
                <Select
                  value={background.type}
                  onValueChange={(value: "color" | "gradient" | "image") =>
                    setBackground({ ...background, type: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="color">Cor Sólida</SelectItem>
                    <SelectItem value="gradient">Gradiente</SelectItem>
                    <SelectItem value="image">Imagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {background.type === "color" && (
                <div>
                  <Label className="text-sm font-medium">Cor</Label>
                  <Input
                    type="color"
                    value={background.color}
                    onChange={(e) => setBackground({ ...background, color: e.target.value })}
                    className="mt-2"
                  />
                </div>
              )}

              {background.type === "gradient" && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Cor Inicial</Label>
                    <Input
                      type="color"
                      value={background.gradientStart}
                      onChange={(e) => setBackground({ ...background, gradientStart: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Cor Final</Label>
                    <Input
                      type="color"
                      value={background.gradientEnd}
                      onChange={(e) => setBackground({ ...background, gradientEnd: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Direção</Label>
                    <Select
                      value={background.gradientDirection}
                      onValueChange={(value) => setBackground({ ...background, gradientDirection: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecione a direção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="to right">Horizontal →</SelectItem>
                        <SelectItem value="to bottom">Vertical ↓</SelectItem>
                        <SelectItem value="to bottom right">Diagonal ↘</SelectItem>
                        <SelectItem value="45deg">45 graus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {background.type === "image" && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Upload de Imagem</Label>
                    <Button
                      variant="outline"
                      onClick={() => backgroundFileInputRef.current?.click()}
                      className="mt-2 w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Escolher Imagem de Fundo
                    </Button>
                    <input
                      ref={backgroundFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundImageUpload}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">URL da Imagem</Label>
                    <Input
                      value={background.imageUrl || ""}
                      onChange={(e) => setBackground({ ...background, imageUrl: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tamanho</Label>
                    <Select
                      value={background.imageSize}
                      onValueChange={(value) => setBackground({ ...background, imageSize: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cover">Cobrir</SelectItem>
                        <SelectItem value="contain">Conter</SelectItem>
                        <SelectItem value="100% 100%">Esticar</SelectItem>
                        <SelectItem value="repeat">Repetir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Posição</Label>
                    <Select
                      value={background.imagePosition}
                      onValueChange={(value) => setBackground({ ...background, imagePosition: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecione a posição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="top">Topo</SelectItem>
                        <SelectItem value="bottom">Base</SelectItem>
                        <SelectItem value="left">Esquerda</SelectItem>
                        <SelectItem value="right">Direita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div>
                <Label className="text-sm font-medium">Opacidade: {Math.round((background.opacity || 1) * 100)}%</Label>
                <Slider
                  value={[(background.opacity || 1) * 100]}
                  onValueChange={([value]) => setBackground({ ...background, opacity: value / 100 })}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </TabsContent>

            <TabsContent value="properties" className="p-4 space-y-4">
              {selectedEl ? (
                <>
                  <div>
                    <Label className="text-sm font-medium">Elemento Selecionado</Label>
                    <Badge variant="outline" className="mt-2">
                      {selectedEl.type === "text" && <Type className="h-3 w-3 mr-1" />}
                      {selectedEl.type === "image" && <ImageIcon className="h-3 w-3 mr-1" />}
                      {selectedEl.type === "shape" && <Square className="h-3 w-3 mr-1" />}
                      {selectedEl.type}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Propriedades de Posição */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">X</Label>
                      <Input
                        type="number"
                        value={selectedEl.x}
                        onChange={(e) => updateElement(selectedEl.id, { x: Number(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Y</Label>
                      <Input
                        type="number"
                        value={selectedEl.y}
                        onChange={(e) => updateElement(selectedEl.id, { y: Number(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Largura</Label>
                      <Input
                        type="number"
                        value={selectedEl.width}
                        onChange={(e) => updateElement(selectedEl.id, { width: Number(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Altura</Label>
                      <Input
                        type="number"
                        value={selectedEl.height}
                        onChange={(e) => updateElement(selectedEl.id, { height: Number(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Propriedades de Texto */}
                  {selectedEl.type === "text" && (
                    <>
                      <div>
                        <Label className="text-sm font-medium">Conteúdo</Label>
                        <Textarea
                          value={selectedEl.content}
                          onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                          className="mt-2"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Tamanho</Label>
                          <Input
                            type="number"
                            value={selectedEl.fontSize}
                            onChange={(e) => updateElement(selectedEl.id, { fontSize: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Cor</Label>
                          <Input
                            type="color"
                            value={selectedEl.color}
                            onChange={(e) => updateElement(selectedEl.id, { color: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Fonte</Label>
                        <Select
                          value={selectedEl.fontFamily}
                          onValueChange={(value) => updateElement(selectedEl.id, { fontFamily: value })}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                            <SelectItem value="Montserrat">Montserrat</SelectItem>
                            <SelectItem value="Libre Baskerville">Libre Baskerville</SelectItem>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={selectedEl.fontWeight === "bold" ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            updateElement(selectedEl.id, {
                              fontWeight: selectedEl.fontWeight === "bold" ? "normal" : "bold",
                            })
                          }
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={selectedEl.fontStyle === "italic" ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            updateElement(selectedEl.id, {
                              fontStyle: selectedEl.fontStyle === "italic" ? "normal" : "italic",
                            })
                          }
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={selectedEl.textDecoration === "underline" ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            updateElement(selectedEl.id, {
                              textDecoration: selectedEl.textDecoration === "underline" ? "none" : "underline",
                            })
                          }
                        >
                          <Underline className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={selectedEl.textAlign === "left" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateElement(selectedEl.id, { textAlign: "left" })}
                        >
                          <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={selectedEl.textAlign === "center" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateElement(selectedEl.id, { textAlign: "center" })}
                        >
                          <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={selectedEl.textAlign === "right" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateElement(selectedEl.id, { textAlign: "right" })}
                        >
                          <AlignRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Propriedades de Imagem */}
                  {selectedEl.type === "image" && (
                    <div>
                      <Label className="text-sm font-medium">URL da Imagem</Label>
                      <Input
                        value={selectedEl.src}
                        onChange={(e) => updateElement(selectedEl.id, { src: e.target.value })}
                        className="mt-2"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Nova Imagem
                      </Button>
                    </div>
                  )}

                  {/* Propriedades de Forma */}
                  {selectedEl.type === "shape" && (
                    <>
                      <div>
                        <Label className="text-sm font-medium">Tipo de Forma</Label>
                        <Select
                          value={selectedEl.shapeType}
                          onValueChange={(value: "rectangle" | "circle") =>
                            updateElement(selectedEl.id, { shapeType: value })
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rectangle">Retângulo</SelectItem>
                            <SelectItem value="circle">Círculo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Cor de Fundo</Label>
                          <Input
                            type="color"
                            value={selectedEl.backgroundColor}
                            onChange={(e) => updateElement(selectedEl.id, { backgroundColor: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Cor da Borda</Label>
                          <Input
                            type="color"
                            value={selectedEl.borderColor}
                            onChange={(e) => updateElement(selectedEl.id, { borderColor: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Espessura da Borda</Label>
                          <Input
                            type="number"
                            value={selectedEl.borderWidth}
                            onChange={(e) => updateElement(selectedEl.id, { borderWidth: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                        {selectedEl.shapeType === "rectangle" && (
                          <div>
                            <Label className="text-xs">Borda Arredondada</Label>
                            <Input
                              type="number"
                              value={selectedEl.borderRadius}
                              onChange={(e) => updateElement(selectedEl.id, { borderRadius: Number(e.target.value) })}
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Propriedades Gerais */}
                  <div>
                    <Label className="text-sm font-medium">Rotação: {selectedEl.rotation}°</Label>
                    <Slider
                      value={[selectedEl.rotation]}
                      onValueChange={([value]) => updateElement(selectedEl.id, { rotation: value })}
                      min={-180}
                      max={180}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Opacidade: {Math.round(selectedEl.opacity! * 100)}%</Label>
                    <Slider
                      value={[selectedEl.opacity! * 100]}
                      onValueChange={([value]) => updateElement(selectedEl.id, { opacity: value / 100 })}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Camada (Z-Index)</Label>
                    <Input
                      type="number"
                      value={selectedEl.zIndex}
                      onChange={(e) => updateElement(selectedEl.id, { zIndex: Number(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Selecione um elemento para editar suas propriedades</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Botões de Ação */}
        <div className="p-4 border-t space-y-2">
          <Button onClick={() => onSave(generateHTML())} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Salvar Certificado
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => console.log(generateHTML())} className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      {/* Área do Canvas */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Toolbar do Canvas */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Zoom:</Label>
              <Slider
                value={[zoom * 100]}
                onValueChange={([value]) => setZoom(value / 100)}
                min={10}
                max={100}
                step={5}
                className="w-32"
              />
              <span className="text-sm font-mono">{Math.round(zoom * 100)}%</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Label className="text-sm">Tamanho:</Label>
              <Input
                type="number"
                value={canvasSize.width}
                onChange={(e) => setCanvasSize({ ...canvasSize, width: Number(e.target.value) })}
                className="w-20"
              />
              <span className="text-sm">×</span>
              <Input
                type="number"
                value={canvasSize.height}
                onChange={(e) => setCanvasSize({ ...canvasSize, height: Number(e.target.value) })}
                className="w-20"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">Arraste elementos para posicionar • Clique para selecionar</div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
          <div
            ref={canvasRef}
            className="relative border-2 border-gray-300 shadow-lg bg-white"
            style={{
              width: canvasSize.width * zoom,
              height: canvasSize.height * zoom,
              ...(background.type === "color" && { backgroundColor: background.color }),
              ...(background.type === "gradient" && {
                background: `linear-gradient(${background.gradientDirection || "to right"}, ${background.gradientStart}, ${background.gradientEnd})`,
              }),
              ...(background.type === "image" &&
                background.imageUrl && {
                  backgroundImage: `url(${background.imageUrl})`,
                  backgroundSize: background.imageSize || "cover",
                  backgroundPosition: background.imagePosition || "center",
                  backgroundRepeat: background.imageSize === "repeat" ? "repeat" : "no-repeat",
                }),
              opacity: background.opacity,
            }}
          >
            {elements
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((element) => (
                <div
                  key={element.id}
                  className={cn(
                    "absolute cursor-move border-2 border-transparent hover:border-blue-300",
                    selectedElement === element.id && "border-blue-500 border-dashed",
                  )}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    transform: `rotate(${element.rotation}deg)`,
                    opacity: element.opacity,
                    zIndex: element.zIndex,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleMouseDown(e, element.id)
                  }}
                >
                  {element.type === "text" && (
                    <div
                      className="w-full h-full flex items-center"
                      style={{
                        fontSize: element.fontSize,
                        fontFamily: element.fontFamily,
                        fontWeight: element.fontWeight,
                        fontStyle: element.fontStyle,
                        textAlign: element.textAlign,
                        color: element.color,
                        textDecoration: element.textDecoration,
                        justifyContent:
                          element.textAlign === "left"
                            ? "flex-start"
                            : element.textAlign === "right"
                              ? "flex-end"
                              : "center",
                      }}
                    >
                      {element.content}
                    </div>
                  )}

                  {element.type === "image" && (
                    <img
                      src={element.src || "/placeholder.svg"}
                      alt="Certificate Element"
                      className="w-full h-full object-contain pointer-events-none"
                      draggable={false}
                    />
                  )}

                  {element.type === "shape" && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: element.backgroundColor,
                        border: `${element.borderWidth}px solid ${element.borderColor}`,
                        borderRadius: element.shapeType === "circle" ? "50%" : `${element.borderRadius}px`,
                      }}
                    />
                  )}

                  {/* Handles de redimensionamento */}
                  {selectedElement === element.id && (
                    <>
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-nw-resize" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-ne-resize" />
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-sw-resize" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-se-resize" />
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
