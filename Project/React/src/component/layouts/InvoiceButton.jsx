// import React from 'react'
// import { generateInvoice } from '../../services/invoiceService';

import { useNavigate } from "react-router-dom";
import { generateInvoice } from "../../services/invoiceService";

// export const InvoiceButton = ({ trip, persons, txnId, formik }) => {

//     const handleDownload = () => {
//         generateInvoice({
//             trip,
//             persons,
//             txnId,
//             passengers: formik.values.passengers,
//             contact: formik.values.contactInfo
//         });
//     };

//     return (
//         <div>
//             <button
//                 onClick={handleDownload}
//                 className="w-full md:w-auto bg-slate-900 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3"
//             >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h10a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
//                 Download Invoice
//             </button>
//         </div>
//     )
// }


export const InvoiceButton = ({ trip, persons, txnId, passengers, contact, variant = "small" }) => {

    const handleDownload = () => {
        generateInvoice({
            trip,
            persons,
            txnId,
            passengers,
            contact
        });
    };

    const styles = {
        small: "px-6 py-3 rounded-2xl font-bold text-[10px] border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-800 transition-all duration-300 uppercase tracking-widest",

        big: "px-12 py-6 rounded-2xl font-black text-[13px] bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-800 transition-all duration-300 shadow-lg uppercase tracking-widest"
    };

    return (
        <>
            <button
                onClick={handleDownload}
                className={styles[variant]}

            >
                ⬇ Invoice
            </button>

        </>
    );
};
