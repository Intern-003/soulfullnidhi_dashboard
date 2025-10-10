import React from 'react'
import Table from '../components/Table'

const Acc_topup_settlement = () => {
      const payoutcolumn = [
        // {header:"order id" ,accessor:"order_id"},
        // { header:"Type", accessor:"type"},
        { header:"Merchant Details", accessor:"merchantdetails"},
        { header:"Payer-Payee Details", accessor:"payerpayeedetails"},
        { header:"Transaction Details", accessor:"Txndetails"},
        { header:"Amount/Commission", accessor:"amt_comm"},
        // { header:"Status", accessor:"status"},
    ];
 const payoutdata = [
  {
    // order_id: "ORD12345 " ,
    // type: "UPI",
    merchantdetails: "Amazon Pvt Ltd",
    payerpayeedetails: "akash Sharma (akash@upi)",
    Txndetails: "Txn ID: TXN001234, Date:07-Oct-2025, 10:30 AM ",
    amt_comm: "₹1,500 / ₹15",
    // status: "Success",
  },
  {
    // order_id: "ORD12346",
    // type: "UPI",
    merchantdetails: "Flipkart India",
    payerpayeedetails: "Rahul Mehta (rahul@upi)",
    Txndetails: "Txn ID: TXN001235, Date: 07-Oct-2025, 11:10 AM",
    amt_comm: "₹2,250 / ₹22",
    // status: "Pending",
  },
  {
    // order_id: "ORD12347",
    // type: "UPI",
    merchantdetails: "Zomato Ltd",
    payerpayeedetails: "Sneha Gupta (sneha@upi)",
    Txndetails: "Txn ID: TXN001236, Date: 07-Oct-2025, 12:45 PM",
    amt_comm: "₹980 / ₹9",
    // status: "Failed",
  },
  {
    // order_id: "ORD12348",
    // type: "UPI",
    merchantdetails: "Myntra Online",
    payerpayeedetails: "Aman Verma (aman@upi)",
    Txndetails: "Txn ID: TXN001237, Date: 07-Oct-2025, 1:30 PM",
    amt_comm: "₹3,600 / ₹36",
    // status: "Success",
  },
];
  return (
    <div>
                    <div
        className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center"
        style={{ margin: "0px  0px 20px 0px", padding: "10px" }}  >
        <h4 className="font-bold text-white text-lg py-2">Topup Settlement Statement</h4></div>

        {/* <Button variant="AddNewBtn" onClick={()=> alert("button clicked")}>primary button</Button> */}

        <Table columns={payoutcolumn} data={payoutdata}/>
    </div>
  )
}

export default Acc_topup_settlement