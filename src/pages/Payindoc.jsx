import React, { useState } from "react";
import "../css/documents.css";

const payindoc = () => {
  const [activeSection, setActiveSection] = useState("payin-request");

  const apiSections = [
    {
      id: "payin-request",
      title: "Create Payin Payment Request",
      endpoint: "POST https://live.spay.live/api/AP/payin/request",
      headers: "Content-Type: application/json",
      parameters: [
        {
          field: "token",
          type: "String",
          required: "Yes",
          description: "API key/token provided by Spay",
        },
        {
          field: "orderid",
          type: "String",
          required: "Yes",
          description:
            "Unique transaction ID (merchant side) Maximum 20 Characters",
        },
        {
          field: "amount",
          type: "String",
          required: "Yes",
          description: "	Transaction amount in INR",
        },
        {
          field: "buyer_email",
          type: "String",
          required: "Yes",
          description: "Customer's email address",
        },
        {
          field: "buyer_phone	",
          type: "String",
          required: "Yes",
          description: "Customer's 10-digit mobile number",
        },
      ],
      request: {
        curl: [
          "curl --location 'POST https://live.spay.live/api/AP/payin/request'",
          "--form 'token=Q9xRwseKPXXXXXXseUtygT78wnHPji'",
          "--form 'orderid=TXNXXXX1120'",
          "--form 'amount=1'",
          "--form 'buyer_email=customer@enduser.com'",
          "--form 'buyer_phone=1122XXXXX'",
        ].join("\n"),
      },
      successResponse: {
        curl: [
          "{",
          "status_code : 200",
          "data : {",
          "qrcode_string : upi://pay?pa=XXXXXXX@ypbiz&pn=f59d23ac19020c989cd8566a",
          "4ea16646ad4e02f67516cedc3bd7d833efdaXXXx&cu=INR&tn=Pay+to+f59d23ac190",
          "20c9XXXXXea16646ad4e02f67516cedc3bd7d833efda516e&am=10.00&mam=10.00&",
          "mc=5999&mode=04&tr=XXXX 377960382&ver=1",
          "txnid : SPAY2025101711XXXX45",
          "}",
          "}",
        ].join("\n"),
      },
      errorExamples: [
        {
          code: "400",
          message: "Missing required fields: name,mobile, etc",
          cause: "Required fields are not included",
        },
        {
          code: "403",
          message:
            "Your PayIN account is deactivated. Please contact the administrator.",
          cause: "Payin deactivated by Spay",
        },
        {
          code: "409",
          message: "Transaction ID already exists",
          cause: "Duplicate orderid used",
        },
        {
          code: "401",
          message: "Unauthorized",
          cause: "Invalid or expired token or Authorization header",
        },
        {
          code: "422",
          message: "Amount must be a positive numeric value",
          cause: "Invalid or zero amount",
        },
        {
          code: "500",
          message: "Internal Server Error",
          cause: "Unexpected server-side error",
        },
      ],
      type: "api", // Added type to identify different content types
    },
    {
      id: "payment-status",
      title: "Check Payment Status",
      endpoint: "POST https://live.spay.live/api/AP/payin/status",
      headers: "Content-Type: multipart/form-data; boundary=",
      parameters: [
        {
          field: "token",
          type: "String",
          required: "Yes",
          description: "API key/token provided by SPay Dashboard",
        },
        {
          field: "OrderId",
          type: "String",
          required: "Yes",
          description:
            "Unique transaction identifier returned in the request api response",
        },
      ],
      request: {
        curl: [
          "curl --location 'POST https://live.spay.live/api/AP/payin/status'",
          "--form 'token=Q9xRwseKPXXXXXXseUtygT78wnHPji'",
          "--form 'orderid=TXNXXXX1120'",
        ].join("\n"),
      },
      successResponse: {
        curl: [
          "{",
          "message : Transaction Successfully done",
          "success : true",
          "status : success",
          "Amount : 1.00",
          "txnid : SPAY2025101XXXXXXX",
          "}",
        ].join("\n"),
      },
      failedResponse: {
        curl: [
          "{",
          "message : Transaction failed",
          "success : false",
          "status : FAILED",
          "Amount : 1.00",
          "txnid : SPAY2025101XXXXXXX",
          "}",
        ].join("\n"),
      },
      errorExamples: [
        {
          code: "400",
          message: "Missing required fields: name,mobile, etc",
          cause: "Required fields are not included",
        },
        {
          code: "404",
          message:
            "Payin method not found",
          cause: "Incorrect or non-existent orderid",
        },
        {
          code: "401",
          message: "Unauthorized",
          cause: "Invalid or expired token or Authorization header",
        },
        {
          code: "500",
          message: "Internal Server Error",
          cause: "Unexpected server-side error",
        },
      ],      
       errorStatus:[
        {
          code: "success",
          message: "Payment was completed successfully",
        },
        {
          code: "failed",
          message:
            "Payment failed",
      
        },
        {
          code: "pending",
          message: "Payment is in process and pending confirmation",
        
        },

      ],     
      type: "api",
    },
    {
      id: "callback",
      title: "Callback Response",
      type: "callback",
      content: {
        endpoint:
          "https://www.inspay.org/sapi/payment/common/payin/sPay",
        successResponse: `{
  "status": "success",
  "txnid": "SPAYXXXX0004",
  "clientxmld": "Axxxxxxx",
  "amount": "1.00",
  "transactionid": "Vxxxxxxxf",
  "timestamp": "2025-XX-XX 15:27:47"
}`,
        failedResponse: `{
  "status": "failed",
  "build": "SPAYXXXX0004", 
  "clientxmld": "Axxxxxxx",
  "amount": "1.00",
  "transactionid": "Vxxxxxxxf",
  "timestamp": "2025-XX-XX 15:27:47",
  "error_message": "Payment failed reason"
}`,
      },
    },
    {
      id: "important-notes",
      title: "Payin Integration Guidelines",
      type: "notes",
      content: [
        {
          title: "1. API Key & Credentials",
          description:
            "token, Mid and Key: Ensure that these values are securely stored and never shared in public forums or repositories. These credentials are sensitive and must be treated with high security to prevent unauthorized access.",
        },
        {
          title: "2. Consistency in Identifiers",
          description:
            "apitxnid (for request API): This is the unique identifier you provide for each transaction. It should be unique for every transaction request and should not be reused. Reusing an apitxnid for multiple transactions can lead to erroneous results in the payin flow and in status checks.",
        },
        {
          title: "3. Polling & Cron Jobs",
          description:
            "If you have high transaction volumes, consider implementing polling or using a cron job to check the transaction status periodically after the initial request. This ensures that the system remains responsive and reduces manual intervention.",
        },
        {
          title: "4. Error Handling & Retry Logic",
          description:
            "Always implement proper error handling when calling the APIs. Ensure that you have logic in place to gracefully handle any errors that may arise, such as network issues or server downtime.",
        },
        {
          title: "5. Transaction Amount (INR)",
          description:
            "Ensure that the amount parameter is provided accurately in INR (Indian Rupees) and does not exceed the allowable limits specified by SPay. Double-check the transaction amounts before initiating the request.",
        },
        {
          title: "6. Customer Data Validation",
          description:
            "Always validate and sanitize customer input such as name, email, and mobile to ensure no invalid or harmful data is sent. Invalid or incomplete customer data may result in transaction failures or status errors.",
        },
        {
          title: "7. Security",
          description:
            "Always use HTTPS for secure communication to protect sensitive data like API keys, customer information, and transaction details.",
        },
        {
          title: "8. PayIN Account Deactivated",
          description:
            "This means your PayIN account has been deactivated by Spay. Please contact support or the system administrator to reactivate your account.",
        },
      ],
    },
    // {
    //   id: "mid",
    //   title: "Merchant ID",
    //   type: "info",
    //   content: {
    //     description:
    //       "A unique identifier assigned to your business by the Spay. It is used to identify your account during API requests.",
    //     mid: "sp02VMQHJY",
    //     note: "Must match the one shared during onboarding. Do not change or regenerate MID on your end.",
    //     guidelines: [
    //       "Do not expose MID in any frontend code (e.g., mobile apps, JavaScript).",
    //       "Store MID securely using environment variables or a secrets manager.",
    //     ],
    //   },
    // },
  ];

  const activeApi = apiSections.find((section) => section.id === activeSection);

  // Function to render different content based on type
  const renderContent = () => {
    switch (activeApi.type) {
      case "api":
        return (
          <>
            <div className="content-header">
              <h1>{activeApi.title}</h1>
              <br />
              <h4>
                <span
                  style={{
                    color: "green",
                    fontWeight: "700",
                    margin: "0px 0px 100px 0px",
                  }}
                >
                  ENDPOINT :
                </span>
                <br />
                <br />
                {activeApi.endpoint}
              </h4>
              <br />
              <h4>
                <span
                  style={{
                    color: "green",
                    fontWeight: "700",
                    margin: "0px 0px 100px 0px",
                  }}
                >
                  HEADERS :{" "}
                </span>
                <br />
                <br /> {activeApi.headers}
              </h4>
            </div>
            <div className="parameters-section">
              <h2>Request Body Parameters</h2>
              <table className="parameters-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {activeApi.parameters.map((param, index) => (
                    <tr key={index}>
                      <td>
                        <code className="field-code">{param.field}</code>
                      </td>
                      <td>{param.type}</td>
                      <td>
                        <span
                          className={`required-badge ${
                            param.required === "Yes"
                              ? "required-yes"
                              : "required-no"
                          }`}
                        >
                          {param.required}
                        </span>
                      </td>
                      <td>{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="request-section">
              <h2>Sample Request </h2>
              <div className="code-block">
                <pre>{activeApi.request.curl}</pre>
              </div>
            </div>
            <div className="request-section">
              <h2>cURL success Response</h2>
              <div className="code-block">
                <pre>{activeApi.successResponse.curl}</pre>
              </div>
            </div>
            {activeApi.failedResponse && (
              <div className="request-section">
                <h2>cURL failed Response</h2>
                <div className="code-block">
                  <pre>{activeApi.failedResponse.curl}</pre>
                </div>
              </div>
            )}

            {activeApi.errorExamples && (
              <div className="error-examples-section">
                <h2>Error Response Examples</h2>
                <table className="error-examples-table">
                  <thead>
                    <tr>
                      <th>Error Code</th>
                      <th>Message</th>
                      <th>Cause</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeApi.errorExamples.map((error, index) => (
                      <tr key={index}>
                        <td>
                          <code className="error-code-badge">{error.code}</code>
                        </td>
                        <td>{error.message}</td>
                        <td>{error.cause}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeApi.errorStatus && (
              <div className="error-status-section">
                <h2>status values in data.status</h2>
                <table className="error-status-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Meaning</th>
                      {/* <th>Cause</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {activeApi.errorStatus.map((error, index) => (
                      <tr key={index}>
                        <td>
                          <code className="error-status-badge">{error.code}</code>
                        </td>
                        <td>{error.message}</td>
                      
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        );

      case "callback":
        return (
          <div className="content-section">
            <h1>
              <b>{activeApi.title}</b>
            </h1>

            <div className="info-box">
              <h3>User Callback Endpoint</h3>
              <div className="endpoint-block">
                <code>{activeApi.content.endpoint}</code>
              </div>
            </div>

            <div className="response-examples">
              <div className="response-example">
                <h3 style={{ color: "#10b981" }}>
                  ✅ Callback Success Response
                </h3>
                <div className="code-block success-code">
                  <pre>{activeApi.content.successResponse}</pre>
                </div>
              </div>

              <div className="response-example">
                <h3 style={{ color: "#ef4444" }}>
                  ❌ Callback Failed Response
                </h3>
                <div className="code-block error-code">
                  <pre>{activeApi.content.failedResponse}</pre>
                </div>
              </div>
            </div>
          </div>
        );

      case "notes":
        return (
          <div className="content-section">
            <h1>{activeApi.title}</h1>
            <div className="guidelines-box">
              <h3>Integration Guidelines</h3>
              <div className="guidelines-list">
                {activeApi.content.map((guideline, index) => (
                  <div key={index} className="guideline-item">
                    <h4 className="guideline-title">{guideline.title}</h4>
                    <p className="guideline-description">
                      {guideline.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

  
      default:
        return (
          <div className="content-section">
            <h1>{activeApi.title}</h1>
            <p>Content for this section is being prepared.</p>
          </div>
        );
    }
  };

  return (
    <div className="api-doc-container">
      {/* Sidebar */}
      <div className="api-doc-sidebar">
        <div className="sidebar-header">
          <h2>API Documentation</h2>
        </div>
        <nav className="sidebar-nav">
          {apiSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`nav-item ${
                activeSection === section.id ? "nav-item-active" : ""
              }`}
            >
              <div className="nav-title">{section.title}</div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="api-doc-content">
        <div className="content-wrapper">{renderContent()}</div>
      </div>
    </div>
  );
};

export default payindoc;
