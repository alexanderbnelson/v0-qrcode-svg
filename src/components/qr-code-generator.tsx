'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import QRCode from 'qrcode-svg'
import { jsPDF } from 'jspdf'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText } from 'lucide-react'

export function QrCodeGenerator() {
  const searchParams = useSearchParams()
  const [input, setInput] = useState('')
  const [qrCode, setQRCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const urlInput = searchParams.get('input')
    if (urlInput) {
      setInput(urlInput)
      // Auto-generate QR code when input is provided via URL
      setTimeout(() => {
        generateQRCodeForInput(urlInput)
      }, 100)
    }
  }, [searchParams])

  const generateQRCodeForInput = (inputText: string) => {
    if (!inputText) return

    try {
      const svg = new QRCode({
        content: inputText,
        padding: 4,
        width: 256,
        height: 256,
        color: "#000000",
        background: "#ffffff",
        ecl: "M"
      }).svg()

      setQRCode(svg)
      setError('')
    } catch (err) {
      console.error(err)
      setError('Failed to generate QR Code')
      setQRCode('')
    }
  }

  const generateQRCode = () => {
    if (!input) {
      setError('Please enter a URL or text')
      setQRCode('')
      return
    }

    try {
      const svg = new QRCode({
        content: input,
        padding: 4,
        width: 256,
        height: 256,
        color: "#000000",
        background: "#ffffff",
        ecl: "M"
      }).svg()
      
      setQRCode(svg)
      setError('')
    } catch (err) {
      console.error(err)
      setError('Failed to generate QR Code')
      setQRCode('')
    }
  }

  const downloadQRCode = () => {
    if (!qrCode) return

    const blob = new Blob([qrCode], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcode.svg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadQRCodeAsPDF = () => {
    if (!qrCode) return

    const pdf = new jsPDF()
    const svgElement = document.createElement('div')
    svgElement.innerHTML = qrCode
    const svg = svgElement.querySelector('svg')

    if (svg) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 256
      canvas.height = 256

      const img = new Image()
      const svgBlob = new Blob([qrCode], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          const dataUrl = canvas.toDataURL('image/png')

          const pdfWidth = pdf.internal.pageSize.getWidth()
          const qrSize = pdfWidth * 0.6
          const x = (pdfWidth - qrSize) / 2
          const y = 20

          pdf.addImage(dataUrl, 'PNG', x, y, qrSize, qrSize)
          pdf.save('qrcode.pdf')
        }
        URL.revokeObjectURL(url)
      }

      img.src = url
    }
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">QR Code Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter URL or text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full"
          />
          <Button onClick={generateQRCode} className="w-fit">
            Generate QR Code
          </Button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {qrCode && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div dangerouslySetInnerHTML={{ __html: qrCode }} />
              </div>
              <div className="flex gap-2">
                <Button onClick={downloadQRCode} className="flex-1" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download SVG
                </Button>
                <Button onClick={downloadQRCodeAsPDF} className="flex-1" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}