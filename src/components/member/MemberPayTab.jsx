import React from "react";
import { useData, formatINR, monthLabel } from "../../DataContext";
import toast from "react-hot-toast";

const MemberPayTab = () => {
  const { currentUser, maintenance, updateMaintenanceStatus } = useData();

  const records = maintenance.records || {};
  const myMaint = records[currentUser.email] || { status: "Pending" };
  const maintAmount = maintenance.amount || 2500;

  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    const isLoaded = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js",
    );

    if (!isLoaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: "rzp_test_VSdp7X3K39GwBK", // TEST KEY
      amount: maintAmount * 100, // paise
      currency: "INR",
      name: "Shop It",
      description: "Thank you for shopping with us",
      image:
        "https://lh3.googleusercontent.com/gg/AIJ2gl9SltPPuk8sHuP9SzOTJUjgmnjrD1005_Sn-YItojA7pubhH9IXYPnjPVUgM4kJuj9zcxhqRjRdfiPCRp4BNgLr1wKfCMOGc6hat95dALBjEPOS3p0wC4QsE034zCuZaS1saE4ck3hOQU7f0lRPtKu9dTplJnV4flTIWasvydQscwOxAzm0BuMBY3UuRL4_K4EZj4NQPDTsYH6KX3INKBu4GaBTj7cv6wfxmJaVpwom-H4Mgp243uXqyAOL2ioCuhJQV66qGRh6S3hPFlP9oq3vbK7K2XsXqMHMO_A10ybmU3neh5_gF-z7uFX7Unw6hoJtZZYoSLtzWuGJWjsYodw=s1024-rj",

      handler: function (response) {
        alert("Payment Successful!");
        console.log("Payment ID:", response.razorpay_payment_id);
      },

      theme: {
        color: "#ef4444",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    // Demo payment
    const txn = "UPI-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    updateMaintenanceStatus(currentUser.email, "Paid", { txnId: txn });
    toast.success("Payment Recorded!");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pay Maintenance</h1>
      <div className="section-card text-center max-w-lg mx-auto">
        <p className="text-lg">
          Maintenance for <span className="font-semibold">{monthLabel()}</span>{" "}
          is{" "}
          <span
            className={`font-bold ${
              myMaint.status === "Paid" ? "text-green-400" : "text-yellow-400"
            }`}>
            {myMaint.status === "Paid" ? "PAID" : "DUE"}
          </span>
        </p>
        <p className="text-3xl font-bold my-3">{formatINR(maintAmount)}</p>
        {myMaint.status !== "Paid" ? (
          <button
            onClick={handlePay}
            className="btn btn-primary btn-lg w-full sm:w-auto">
            <i className="fas fa-qrcode mr-2"></i> Pay via UPI
          </button>
        ) : (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded">
            <p className="text-green-400">
              <i className="fas fa-check-circle mr-2"></i> Payment Complete
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Txn ID: {myMaint.txnId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberPayTab;
