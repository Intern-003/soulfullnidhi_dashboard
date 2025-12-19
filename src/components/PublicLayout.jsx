import React from 'react'
import { Outlet } from 'react-router-dom'
import paymentGatewayBg from "../images/login-background.jpg";

const PublicLayout = () => {
  return (
<div className="min-h-screen flex items-center justify-center bg-gray-100 py-12  sm:px-6 lg:px-8"
   style={{ backgroundImage: `url(${paymentGatewayBg})` }}>
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden py-6 px-8"
      >
        <Outlet />
      </div>
    </div>
  )
}

export default PublicLayout