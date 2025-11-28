import { useState } from "react";

function SpayGlidePGError() {
    //const location = useLocation();

    // Get message from state or query param
    const message = "Sorry, we cannot process your transaction at the moment.";

return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Technical Error</h1>
      <p className="text-gray-700 mb-6">{message}</p>
    </div>
  );
}

export default SpayGlidePGError;