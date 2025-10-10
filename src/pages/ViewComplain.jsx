import { useState } from "react";
import Button from "../components/Button";
import Table from "../components/Table";
import Logo from "../images/logo.png";
import Placeholder from "../images/placeholder.jpeg";

export const ViewComplain = () => {
  const [showModal, setShowModal] = useState(false);
  const [showViewMessageModal, setShowViewMessageModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const complainColumns = [
    { header: "Complain Id", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Subject", accessor: "subject" },
    { header: "Description", accessor: "description" },
    { header: "Status", accessor: "status" },
    { header: "Priority", accessor: "priority" },
    { header: "Send Message", accessor: "send" },
    { header: "View Message", accessor: "view" },
    { header: "Issue Image", accessor: "image" },
  ];

  const dummyData = [
    {
      id: "1",
      name: "Yuvraj",
      subject: "Email Issue",
      description: "Can't send email from your portal.",
      status: "Open",
      priority: "High",
      send: "",
      view: "",
      image: "",
    },
    {
      id: "2",
      name: "Sahil",
      subject: "Register issue",
      description: "Can't register on your portal.",
      status: "Open",
      priority: "High",
      send: "",
      view: "",
      image: "",
    },
  ];

  const [complains, setComplains] = useState(dummyData);

  const statusOptions = ["Open", "In Progress", "Resolved", "Closed"];
  const priorityOptions = ["High", "Medium", "Low"];

  /**Logic to handle the dropdowns, modals and image modals inside table. */
  const complainsWithModifications = complains.map((row) => ({
    ...row,
    status: (
      <select
        className="p-2.5 mb-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
        value={row.status}
        onChange={(e) => {
          const newStatus = e.target.value;
          setComplains((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, status: newStatus } : item
            )
          );
        }}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    ),

    priority: (
      <select
        className="p-2.5 mb-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
        value={row.priority}
        onChange={(e) => {
          const newPriority = e.target.value;
          setComplains((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, priority: newPriority } : item
            )
          );
        }}
      >
        {priorityOptions.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>
    ),

    send: (
      <Button
        onClick={() => setShowSendMessageModal(!showSendMessageModal)}
        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md cursor-pointer"
      >
        Send Message
      </Button>
    ),

    view: (
      <Button
        onClick={() => setShowViewMessageModal(!showViewMessageModal)}
        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md cursor-pointer"
      >
        View Message
      </Button>
    ),

    image: (
      <Button className="cursor-pointer" onClick={() => setShowImageModal(!showImageModal)}>
        <img src={Logo ? Logo : Placeholder} alt="" />
      </Button>
    ),
  }));

  return (
    <>
      <div className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center mb-3 p-2.5">
        <h4 className="font-bold text-white text-lg py-2">View Complain</h4>
        <Button
          type="button"
          variant="AddNewBtn"
          onClick={() => setShowModal(!showModal)}
        >
          Raise Complain
        </Button>
      </div>
      <Table
        columns={complainColumns}
        data={complainsWithModifications}
        showStatusFilter={false}
      />

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white border rounded-lg shadow-lg max-w-3xl w-full mx-2 p-6 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
              font-medium rounded-t-lg text-sm px-5 py-3 flex justify-between items-center"
            >
              <h4 className="font-bold text-white text-lg py-2">
                Register Complain
              </h4>
              <Button
                onClick={() => setShowModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-500 font-bold text-lg shadow-md hover:bg-red-500 hover:text-white transition"
              >
                <i class="fa-solid fa-xmark fa-lg"></i>
              </Button>
            </div>

            <form className="p-6">
              <div className="grid md:grid-cols-1 md:gap-6 px-4">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="subject"
                    id="floating_subject"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    for="floating_subject"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Subject
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <textarea
                    id="floating_description"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    required
                    placeholder=" "
                  />
                  <label
                    for="floating_description"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Description
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="file"
                    name="image"
                    id="floating_image"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  />
                  <label
                    for="floating_image"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Image
                  </label>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSendMessageModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          onClick={() => setShowSendMessageModal(false)}
        >
          <div
            className="bg-white border rounded-lg shadow-lg max-w-3xl w-full mx-2 p-6 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
              font-medium rounded-t-lg text-sm px-5 py-3 flex justify-between items-center"
            >
              <h4 className="font-bold text-white text-lg py-2">
                Send Message
              </h4>
              <Button
                onClick={() => setShowSendMessageModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-500 font-bold text-lg shadow-md hover:bg-red-500 hover:text-white transition"
              >
                <i class="fa-solid fa-xmark fa-lg"></i>
              </Button>
            </div>

            <form className="p-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="message"
                  id="floating_message"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="floating_message"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Send Message
                </label>
              </div>
              <div className="flex justify-center mt-6">
                <Button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewMessageModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 overflow-y-scroll"
          onClick={() => setShowViewMessageModal(false)}
        >
          <div
            className="bg-white border rounded-lg shadow-lg max-w-3xl w-full mx-2 p-6 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
              font-medium rounded-t-lg text-sm px-5 py-3 flex justify-between items-center"
            >
              <h4 className="font-bold text-white text-lg py-2">
                View Message
              </h4>
              <Button
                onClick={() => setShowViewMessageModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-500 font-bold text-lg shadow-md hover:bg-red-500 hover:text-white transition"
              >
                <i class="fa-solid fa-xmark fa-lg"></i>
              </Button>
            </div>

            <div class="flex justify-end mt-3">
              <div class="block relative max-w-xs bg-blue-500 text-white p-3 px-4 rounded-2xl rounded-br-none shadow-md">
                <p class="text-lg leading-relaxed">Chat 1</p>
                <p class="text-xs leading-relaxed text-gray-200">{new Date().toLocaleString()}</p>
                <span class="absolute right-[-3px] bottom-0 w-2 h-2 bg-blue-500 rotate-45 rounded-sm"></span>
              </div>
            </div>

            <div class="flex justify-end mt-3">
              <div class="block relative max-w-xs bg-blue-500 text-white p-3 px-4 rounded-2xl rounded-br-none shadow-md">
                <p class="text-lg leading-relaxed">Chat 2</p>
                <p class="text-xs leading-relaxed text-gray-200">{new Date().toLocaleString()}</p>
                <span class="absolute right-[-3px] bottom-0 w-2 h-2 bg-blue-500 rotate-45 rounded-sm"></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="bg-white border rounded-lg shadow-lg max-w-3xl w-full mx-2 p-6 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
              font-medium rounded-t-lg text-sm px-5 py-3 flex justify-between items-center"
            >
              <h4 className="font-bold text-white text-lg py-2">
                Image of Issue
              </h4>
              <Button
                onClick={() => setShowImageModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-500 font-bold text-lg shadow-md hover:bg-red-500 hover:text-white transition"
              >
                <i class="fa-solid fa-xmark fa-lg"></i>
              </Button>
            </div>

            <img src={Logo ? Logo : Placeholder} alt="" />
          </div>
        </div>
      )}
    </>
  );
};
