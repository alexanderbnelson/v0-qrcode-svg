'use client'

import { useState } from 'react'
import QRCode from 'qrcode-svg'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from 'lucide-react'

export function QrCodeGenerator() {
  const [input, setInput] = useState('')
  const [qrCode, setQRCode] = useState('')
  const [error, setError] = useState('')

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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">QR Code Generator</CardTitle>
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
          <Button onClick={generateQRCode} className="w-full">
            Generate QR Code
          </Button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {qrCode && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div dangerouslySetInnerHTML={{ __html: qrCode }} />
              </div>
              <Button onClick={downloadQRCode} className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download SVG
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}