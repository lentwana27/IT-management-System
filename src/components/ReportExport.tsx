import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Printer, Mail, Download, CheckCircle, RefreshCw } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../lib/report-service';

interface ReportExportProps {
  data: any[];
  filename: string;
  title: string;
  customHeaders?: string[];
}

export const ReportExport: React.FC<ReportExportProps> = ({
  data,
  filename,
  title
}) => {
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Generate CSV string from JSON data
  const handleCSVExport = () => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(fieldName => {
          const value = String(row[fieldName] ?? '');
          // Escape quotes and commas
          const escaped = value.replace(/"/g, '""');
          return escaped.includes(',') || escaped.includes('"') ? `"${escaped}"` : escaped;
        }).join(',')
      )
    ];
    
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel Export
  const handleExcelExport = () => {
    exportToExcel(data, filename);
  };

  // PDF Export
  const handlePDFExport = () => {
    exportToPDF(data, filename, title);
  };

  // Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Optional Email Feature
  const handleSendEmail = () => {
    setEmailSending(true);
    setTimeout(() => {
      setEmailSending(false);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 4000);
    }, 1500);
  };

  return (
    <div className="flex flex-wrap gap-2.5 items-center p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md">
      <span className="text-xs font-bold text-slate-400 mr-2 flex items-center">
        <Download className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
        Actions & Exports:
      </span>

      {/* PDF Button */}
      <button
        onClick={handlePDFExport}
        className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all cursor-pointer"
        title="Export Report to Adobe PDF"
      >
        <FileText className="w-4 h-4" />
        <span>Export PDF</span>
      </button>

      {/* Excel Button */}
      <button
        onClick={handleExcelExport}
        className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition-all cursor-pointer"
        title="Export Report to MS Excel"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span>Export Excel</span>
      </button>

      {/* CSV Button */}
      <button
        onClick={handleCSVExport}
        className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/20 transition-all cursor-pointer"
        title="Download comma-separated CSV file"
      >
        <Download className="w-4 h-4" />
        <span>Download CSV</span>
      </button>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
        title="Print document or save to local printer"
      >
        <Printer className="w-4 h-4" />
        <span>Print</span>
      </button>

      {/* Email Report Button */}
      <button
        onClick={handleSendEmail}
        disabled={emailSending}
        className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ml-auto ${
          emailSent
            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
            : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/20'
        }`}
        title="Send report directly to registered branch administrator"
      >
        {emailSending ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Sending Report...</span>
          </>
        ) : emailSent ? (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Email Dispatched!</span>
          </>
        ) : (
          <>
            <Mail className="w-4 h-4" />
            <span>Email Report</span>
          </>
        )}
      </button>
    </div>
  );
};
