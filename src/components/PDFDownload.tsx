'use client'

import { Button } from '@/components/ui/button'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface PDFDownloadProps {
  resumeData: {
    fullName: string
    email: string
    phone: string
    location: string
    summary: string
  }
}

export function PDFDownload({ resumeData }: PDFDownloadProps) {
  const downloadPDF = async () => {
    const element = document.getElementById('resume-preview')
    if (!element) {
      console.error('Resume preview element not found')
      return
    }

    try {
      // Create a temporary container with proper A4 dimensions
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.top = '0'
      tempContainer.style.width = '794px' // A4 width in pixels at 96 DPI
      tempContainer.style.backgroundColor = '#ffffff'
      tempContainer.style.fontFamily = 'Calibri, Arial, sans-serif'

      // Clone the resume content
      const clonedElement = element.cloneNode(true) as HTMLElement
      clonedElement.style.width = '794px' // A4 width in pixels
      clonedElement.style.minHeight = '1123px' // A4 height in pixels
      clonedElement.style.padding = '60px' // Proper padding
      clonedElement.style.fontSize = '11pt'
      clonedElement.style.lineHeight = '1.4'
      clonedElement.style.transform = 'none'
      clonedElement.style.margin = '0'
      clonedElement.style.boxSizing = 'border-box'

      // Ensure all text elements maintain proper sizing
      const allTextElements = clonedElement.querySelectorAll('*')
      for (const el of allTextElements) {
        const element = el as HTMLElement
        if (element.style.fontSize?.includes('pt')) {
          // Keep existing pt sizes
        } else {
          // Set relative font sizes for proper PDF scaling
          const computedStyle = window.getComputedStyle(element)
          const fontSize = computedStyle.fontSize
          if (fontSize) {
            const sizeInPx = Number.parseFloat(fontSize)
            const sizeInPt = (sizeInPx * 0.75).toFixed(1) // Convert px to pt
            element.style.fontSize = `${sizeInPt}pt`
          }
        }
        element.style.fontFamily = 'Calibri, Arial, sans-serif'
      }

      tempContainer.appendChild(clonedElement)
      document.body.appendChild(tempContainer)

      // Create canvas from the temporary container
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels
        height: Math.max(1123, tempContainer.scrollHeight) // A4 height or content height
      })

      // Remove temporary container
      document.body.removeChild(tempContainer)

      // Calculate dimensions for A4
      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF('p', 'mm', 'a4')

      // A4 dimensions in mm
      const pdfWidth = 210
      const pdfHeight = 297

      // Calculate the height of the image in mm based on A4 width
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      // Add pages as needed
      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pdfHeight))
      heightLeft -= pdfHeight

      // Add additional pages if needed
      while (heightLeft > 0) {
        position -= pdfHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight
      }

      // Download the PDF
      pdf.save(`${resumeData.fullName.replace(/\s+/g, '_')}_Resume.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  return (
    <Button
      onClick={downloadPDF}
      size="sm"
      className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
    >
      📄 Download PDF
    </Button>
  )
}
