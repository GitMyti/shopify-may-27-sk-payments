
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RapidDeliveryReport } from '../csv/types';
import { formatCurrency } from '../csv/utils';
import { format } from 'date-fns';

/**
 * Exports rapid delivery report data to a PDF file
 */
export async function exportRapidDeliveryToPDF(
  report: RapidDeliveryReport, 
  userDateRange?: { start: Date | undefined; end: Date | undefined }
): Promise<void> {
  try {
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Set title
    const title = "Myti Rapid Delivery Report";
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    
    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on ${format(new Date(), 'MMM dd, yyyy')}`, 14, 30);
    
    // Add summary section
    doc.setFontSize(14);
    doc.text('Summary', 14, 40);
    
    // Summary table
    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: [
        ['Total Deliveries', `${report.summary.totalDeliveries}`],
        ['Total Charges', formatCurrency(report.summary.totalCharges)]
      ],
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [0, 89, 70], // Myti Green
      },
    });
    
    // Order details
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Delivery Details', 14, finalY);
    
    // Format dates for readability
    const formatDateStr = (dateStr: string) => {
      try {
        return format(new Date(dateStr), 'MMM d, yyyy');
      } catch (e) {
        return dateStr;
      }
    };
    
    // Delivery details table
    autoTable(doc, {
      startY: finalY + 5,
      head: [['Order #', 'Date', 'Billing Name', 'Delivery Name', 'Charge']],
      body: report.orders.map(order => [
        order.orderNumber,
        formatDateStr(order.orderDate),
        order.billingName,
        order.deliveryName,
        formatCurrency(order.deliveryCharge),
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak', // Enable text wrapping
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [0, 89, 70], // Myti Green
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: 20 },  // Order #
        1: { cellWidth: 20 },  // Date
        2: { cellWidth: 45 },  // Billing Name
        3: { cellWidth: 45 },  // Delivery Name
        4: { cellWidth: 20 },  // Charge
      },
    });
    
    // Add timestamp at the bottom
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generated on ${format(new Date(), 'MMM dd, yyyy h:mm a')}`, 
      14, 
      pageHeight - 10
    );
    
    // Save the PDF
    const filename = `Myti_Rapid_Delivery_Report.pdf`;
    doc.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw new Error('Failed to generate PDF report');
  }
}
