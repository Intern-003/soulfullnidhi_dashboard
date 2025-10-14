import React, { useState } from 'react'
import Table from '../components/Table'

const ApiSetting = () => {
  const [activeTab, setActiveTab] = useState('apiToken')
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`flex items-center gap-2 px-4 py-2 font-medium ${
            activeTab === 'apiToken'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('apiToken')}
        >
          <span role="img" aria-label="key">🔑</span> API Tokens
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 font-medium ${
            activeTab === 'webhookConfig'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('webhookConfig')}
        >
          <span role="img" aria-label="link">🔁</span> Webhook Config
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {/* ---- API Token Tab ---- */}
        {activeTab === 'apiToken' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Manage API Tokens</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
              >
                + Add Token
              </button>
            </div>

            <Table/>
          </div>
        )}

        {/* ---- Webhook Config Tab ---- */}
        {activeTab === 'webhookConfig' && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Webhook Configuration</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Payment Received Webhook URL
                </label>
                <div className="flex items-center border rounded-lg px-3">
                  <span className="text-gray-400 mr-2">🔗</span>
                  <input
                    type="text"
                    placeholder="https://yourdomain.com/payment-callback"
                    className="w-full p-2 outline-none"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  We'll POST payment notifications to this URL
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Payout Processed Webhook URL
                </label>
                <div className="flex items-center border rounded-lg px-3">
                  <span className="text-gray-400 mr-2">🔗</span>
                  <input
                    type="text"
                    placeholder="https://yourdomain.com/payout-callback"
                    className="w-full p-2 outline-none"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  We'll POST payout status updates to this URL
                </p>
              </div>
            </div>

            <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
              💾 Save Webhook Settings
            </button>
          </div>
        )}
      </div>

      {/* ---- Modal ---- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-3">Add New API Token</h2>
            <input
              type="text"
              placeholder="Enter token name"
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApiSetting
