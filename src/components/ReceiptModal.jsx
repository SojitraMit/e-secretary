import React from "react";

const ReceiptModal = ({ isOpen, onClose, bill }) => {
  if (!isOpen || !bill) return null;

  const isImage = bill.fileType && bill.fileType.startsWith("image/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      <div className="relative z-10 bg-gray-800 border border-gray-700 rounded-xl max-w-3xl w-[92%] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <h3 className="font-semibold text-lg text-white">
            {bill.eventName} - {bill.fileName}
          </h3>
          <button className="btn bg-gray-700 text-gray-200" onClick={onClose}>
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="p-3 overflow-auto flex-1 bg-gray-900 flex justify-center">
          {isImage ? (
            <img
              src={bill.fileData}
              alt="Receipt"
              className="max-w-full rounded"
            />
          ) : (
            <iframe
              src={bill.fileData}
              className="w-full h-[60vh] bg-white rounded"
              title="Receipt PDF"></iframe>
          )}
        </div>
        <div className="p-3 border-t border-gray-700 flex items-center justify-between">
          <a
            href={bill.fileData}
            download={bill.fileName}
            className="btn btn-primary">
            <i className="fa fa-download mr-2"></i> Download
          </a>
          <button className="btn bg-gray-700 text-gray-200" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
