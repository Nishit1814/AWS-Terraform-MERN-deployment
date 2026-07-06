import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = ({ trip, persons, txnId, passengers, contact }) => {
    if (!trip || !passengers || !contact) return;
    const doc = new jsPDF();
    const totalAmount = trip.price * persons;

    // Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 50, 'F');

    // Watermark in PDF
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    doc.text('InEx-Trip', 105, 150, { align: 'center', angle: 45 });
    doc.text('InEx-Trip', 105, 250, { align: 'center', angle: 45 });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('InEx-Trip', 20, 30);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('THE FUTURE OF EXPLORATION', 20, 38);
    doc.text(`INVOICE NO: ${txnId}`, 140, 30);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 140, 38);

    // Trip Info
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ADVENTURE DETAILS', 20, 70);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, 75, 190, 75);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Destination:`, 20, 85);
    doc.setFont('helvetica', 'bold');
    doc.text(`${trip.to}`, 50, 85);

    doc.setFont('helvetica', 'normal');
    doc.text(`Origin:`, 20, 93);
    doc.setFont('helvetica', 'bold');
    doc.text(`${trip.from}`, 50, 93);

    doc.setFont('helvetica', 'normal');
    doc.text(`Duration:`, 120, 85);
    doc.setFont('helvetica', 'bold');
    doc.text(`${trip.dayPlan.length} Days`, 150, 85);

    doc.setFont('helvetica', 'normal');
    doc.text(`Transport:`, 120, 93);
    doc.setFont('helvetica', 'bold');
    doc.text(`${trip.transportMode}`, 150, 93);

    // Contact Info
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTACT INFORMATION', 20, 115);
    doc.line(20, 120, 190, 120);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Email: ${contact.email}`, 20, 130);
    doc.text(`Mobile: ${contact.mobile}`, 20, 138);
    doc.text(`Emergency: ${contact.emergencyName} (${contact.emergencyPhone})`, 100, 130);

    // Passenger Info
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PASSENGER MANIFEST', 20, 160);
    doc.line(20, 165, 190, 165);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('NO.', 20, 175);
    doc.text('NAME', 40, 175);
    doc.text('AGE', 100, 175);
    doc.text('GENDER', 130, 175);
    doc.text('MOBILE', 160, 175);

    doc.setFont('helvetica', 'normal');

    autoTable(doc, {
        startY: 170,

        head: [['NO.', 'NAME', 'AGE', 'GENDER', 'MOBILE']],

        body: passengers.map((p, i) => [
            i + 1,
            p.name,
            p.age,
            p.gender,
            p.mobile
        ]),

        theme: 'grid',

        styles: {
            fontSize: 10,
        },

        headStyles: {
            fillColor: [15, 23, 42],
            textColor: 255,
            halign: 'center'
        }
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY || 170;

    let summaryY = finalY + 10;

    if (summaryY > 240) {
        doc.addPage();
        summaryY = 30;
    }

    doc.setFillColor(248, 250, 252);
    doc.rect(20, summaryY, 170, 55, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT SUMMARY', 30, summaryY + 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Base Package Rate:`, 30, summaryY + 25);
    doc.text(`INR ${trip.price.toLocaleString()}`, 140, summaryY + 25);
    doc.text(`Total Travelers:`, 30, summaryY + 32);
    doc.text(`x ${persons}`, 140, summaryY + 32);

    doc.setDrawColor(226, 232, 240);
    doc.line(30, summaryY + 38, 180, summaryY + 38);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL AMOUNT PAID:`, 30, summaryY + 48);
    doc.text(`INR ${totalAmount.toLocaleString()}`, 140, summaryY + 48);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a computer-generated e-invoice for your InEx-Trip booking.', 20, 280);
    doc.text('For support, contact support@inextrip.ai | Project Exhibition 2026', 20, 285);

    doc.save(`InExTrip_${txnId}.pdf`);
};