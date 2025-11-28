import { useState } from "react";

function SpayGlidePGSuccess() {
    // Get message from state or query param
    const message = "Great Your Transaction was successful.";

return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful</h1>
      <p className="text-gray-700 mb-6">{message}</p>
    </div>
  );
}

export default SpayGlidePGSuccess;