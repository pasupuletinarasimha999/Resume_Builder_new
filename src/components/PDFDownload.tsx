'use client'

import { Button } from '@/components/ui/button'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface SectionItem {
  id: string
  [key: string]: string | boolean | undefined
}

interface PDFDownloadProps {
  resumeData: {
    fullName: string
    email: string
    phone: string
    location: string
    summary: string
  }
  sections: {
    education: SectionItem[]
    experience: SectionItem[]
    projects: SectionItem[]
    skills: SectionItem[]
  }
}

export function PDFDownload({ resumeData, sections }: PDFDownloadProps) {
  const downloadPDF = async () => {
    const element = document.getElementById('resume-preview')
    if (!element) {
      console.error('Resume preview element not found')
      return
    }

    try {
      // Create canvas from the resume preview
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0
      })

      // Calculate dimensions
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      // A4 dimensions in mm
      const pdfWidth = 210
      const pdfHeight = 297

      // Calculate the height of the image in mm based on A4 width
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // If content fits in one page
      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      } else {
        // If content is longer, we need to split it into pages
        let heightLeft = imgHeight
        let position = 0

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight

        // Add additional pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pdfHeight
        }
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
