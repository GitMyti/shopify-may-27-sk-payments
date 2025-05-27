
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ShopReport } from '../csv/types';
import { formatCurrency } from '../csv/utils';
import { format } from 'date-fns';
import { normalizeShopNameForComparison } from '../csv/processor';
import { RapidDeliveryOrder, RapidDeliveryReport } from '../csv/types';

/**
 * Formats a date string to a more readable format
 */
const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (e) {
    return dateString;
  }
};

/**
 * Get date range from orders in the report or from user-selected filter
 */
const getDateRange = (report: ShopReport, userDateRange?: { start: Date | undefined; end: Date | undefined }): string => {
  // If user has selected a specific date range, use that
  if (userDateRange && userDateRange.start && userDateRange.end) {
    return `${format(userDateRange.start, 'MMM dd, yyyy')} - ${format(userDateRange.end, 'MMM dd, yyyy')}`;
  }
  
  // Otherwise, calculate from order data
  if (!report.orders || report.orders.length === 0) {
    return format(new Date(), 'yyyy-MM-dd');
  }
  
  // Parse dates from orders - use paidAt date if available
  const dates = report.orders.map(order => {
    const dateString = order.paidAt || order.orderDate;
    return new Date(dateString);
  });
  
  // Find min and max dates
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
  // Format dates for display
  const startDate = format(minDate, 'MMM dd, yyyy');
  const endDate = format(maxDate, 'MMM dd, yyyy');
  
  // If same date, return single date, otherwise return range
  return startDate === endDate ? startDate : `${startDate} - ${endDate}`;
};

/**
 * Exports shop report data to a PDF file
 * Optional rapidDeliveryReport can be provided to include rapid delivery data in the same PDF
 */
export async function exportToPDF(
  report: ShopReport, 
  userDateRange?: { start: Date | undefined; end: Date | undefined },
  rapidDeliveryReport?: RapidDeliveryReport
): Promise<void> {
  try {
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Set title
    const title = `${report.shopName} - Shop Report`;
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    
    // Add date range
    const dateRange = getDateRange(report, userDateRange);
    doc.setFontSize(10);
    doc.text(`Date Range: ${dateRange}`, 14, 30);
    
    // Add summary section
    doc.setFontSize(14);
    doc.text('Summary', 14, 40);
    
    // Calculate Rapid Delivery charges - check for delivery charges in orders
    const rapidDeliveryOrders = report.orders.filter(order => order.isDeliveryCharge);
    const rapidDeliveryCharges = rapidDeliveryOrders.reduce((sum, order) => sum + Math.abs(order.totalPayment), 0);
    
    // Calculate net payment (total payment minus rapid delivery charges)
    const netPayment = report.summary.totalPayment - rapidDeliveryCharges;
    
    // Summary table
    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: [
        ['Total Orders', `${report.summary.totalOrders}`],
        ['Total Quantity', `${report.summary.totalQuantity}`],
        ['Gross Sales', formatCurrency(report.summary.totalGrossSales)],
        ['Returns', formatCurrency(report.summary.totalReturns)],
        ['Net Sales', formatCurrency(report.summary.totalNetSales)],
        ['Commission', formatCurrency(report.summary.totalCommission)],
        ['Rapid Delivery Charges', formatCurrency(rapidDeliveryCharges)],
        ['Total Payment', formatCurrency(report.summary.totalPayment)],
        ['Net Payment (after delivery charges)', formatCurrency(netPayment)],
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
    doc.text('Order Details', 14, finalY);
    
    // Order details table with Returns column and cell wrapping
    autoTable(doc, {
      startY: finalY + 5,
      head: [['Order #', 'Date', 'Product', 'Qty', 'Gross Sales', 'Returns', 'Net Sales', 'Commission', 'Payment']],
      body: report.orders.map(order => [
        order.orderNumber,
        formatDate(order.orderDate),
        order.productTitle,
        order.quantity.toString(),
        formatCurrency(order.grossSales),
        order.returns > 0 ? formatCurrency(order.returns) : '-',
        formatCurrency(order.netSales),
        `${order.commissionPercentage}%`,
        formatCurrency(order.totalPayment),
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
        0: { cellWidth: 18 },  // Order #
        1: { cellWidth: 20 },  // Date
        2: { cellWidth: 50, overflow: 'linebreak' }, // Product with text wrapping
        3: { cellWidth: 8 },   // Qty
        4: { cellWidth: 18 },  // Gross Sales
        5: { cellWidth: 18 },  // Returns
        6: { cellWidth: 18 },  // Net Sales
        7: { cellWidth: 18 },  // Commission
        8: { cellWidth: 18 },  // Payment
      },
      didParseCell: function(data) {
        // Set text color for Returns column to Myti pink
        if (data.column.index === 5 && data.cell.text.toString() !== '-') {
          data.cell.styles.textColor = [255, 128, 132]; // Myti pink
        }
      },
    });
    
    // Check if rapid delivery report exists and has matching orders
    if (rapidDeliveryReport && rapidDeliveryReport.orders.length > 0) {
      // Filter for orders belonging to this shop using normalized comparison
      const normalizedShopName = normalizeShopNameForComparison(report.shopName);
      const shopRapidDeliveryOrders = rapidDeliveryReport.orders.filter(order => 
        normalizeShopNameForComparison(order.shopName) === normalizedShopName
      );
      
      // Only add rapid delivery section if this shop has delivery orders
      if (shopRapidDeliveryOrders.length > 0) {
        // Add a new page for rapid delivery details
        doc.addPage();
        
        // Add Rapid Delivery header
        doc.setFontSize(18);
        doc.text(`${report.shopName} - Rapid Delivery Details`, 14, 20);
        
        // Add date range
        doc.setFontSize(10);
        doc.text(`Date Range: ${dateRange}`, 14, 30);
        
        // Add rapid delivery table
        doc.setFontSize(14);
        doc.text('Delivery Details', 14, 40);
        
        // Calculate total charges for this shop
        const totalShopCharges = shopRapidDeliveryOrders.reduce(
          (sum, order) => sum + order.deliveryCharge, 0
        );
        
        // Add rapid delivery summary
        autoTable(doc, {
          startY: 45,
          head: [['Metric', 'Value']],
          body: [
            ['Total Deliveries', `${shopRapidDeliveryOrders.length}`],
            ['Total Delivery Charges', formatCurrency(totalShopCharges)]
          ],
          styles: {
            fontSize: 10,
          },
          headStyles: {
            fillColor: [0, 89, 70], // Myti Green
          },
        });
        
        // Format dates for readability
        const formatDateStr = (dateStr: string) => {
          try {
            return format(new Date(dateStr), 'MMM d, yyyy');
          } catch (e) {
            return dateStr;
          }
        };
        
        // Delivery details table
        const rapidDeliveryTableY = (doc as any).lastAutoTable.finalY + 10;
        autoTable(doc, {
          startY: rapidDeliveryTableY,
          head: [['Order #', 'Date', 'Billing Name', 'Delivery Name', 'Charge']],
          body: shopRapidDeliveryOrders.map(order => [
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
          foot: [['TOTAL', '', '', '', formatCurrency(totalShopCharges)]],
          footStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
          }
        });
      }
    }
    
    // Add timestamp at the bottom of the main report
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generated on ${format(new Date(), 'MMM dd, yyyy h:mm a')}`, 
      14, 
      pageHeight - 10
    );
    
    // Generate safe filename
    const safeShopName = report.shopName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `Myti_${safeShopName}_Report.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw new Error('Failed to generate PDF report');
  }
}
