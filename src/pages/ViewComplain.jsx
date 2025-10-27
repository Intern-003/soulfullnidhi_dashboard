import { useEffect, useState } from "react";
import Button from "../components/Button";
import Table from "../components/Table";
import Logo from "../images/logo.png";
import Placeholder from "../images/placeholder.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";

export const ViewComplain = () => {
  const [errors, setErrors] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showViewMessageModal, setShowViewMessageModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [ticketData, setTicketData] = useState([]);
  const [editData, setEditData] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { execute: executeTicket, loading: creating } =
    usePost("/store-ticket");

  const [ticketFormData, setTicketFormData] = useState({
    user_id: "",
    subject: "",
    description: "",
    attachment: "",
    assigned_to: "",
  });

  // ✅ Use your hook to fetch schemes
  const { data, loading, error, refetch } = useGet("/get-tickets");
  const { execute: updateTicket, loading: updating } = usePost(
    editData ? `/update-ticket/${editData.id}` : ""
  );

  console.log("Ticket Data:", data);

  const statusOptions = ["Open", "In Progress", "Resolved", "Closed"];
  const priorityOptions = ["High", "Medium", "Low"];

  // Converts "in_progress" -> "In Progress", "resolved" -> "Resolved"
  const formatForUI = (str) => {
    if (!str) return "N/A";
    return str
      .split("_") // ["in", "progress"]
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // ["In", "Progress"]
      .join(" "); // "In Progress"
  };

  // ✅ Format data whenever "data" changes
  useEffect(() => {
    if (data?.data) {
      const formattedData = data.data.map((item) => ({
        ticket_id: item.ticket_id ?? "N/A",
        user_name: item.user?.name ?? "N/A",
        subject: item.subject ?? "N/A",
        description: item.description ?? "N/A",
        status: formatForUI(item.status),
        priority: formatForUI(item.priority),
        assigned_to: item.assigned_to ?? "N/A",
        created_at: new Date(item.created_at).toLocaleString(),
        action: (
          <Button
            onClick={() => handleEdit(item)}
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md"
          >
            Edit
          </Button>
        ),
      }));

      setTicketData(formattedData);
    }
  }, [data]);

  useEffect(() => {
    if (showModal) {
      if (editData) {
        setTicketFormData({
          user_id: editData.user_id || "",
          subject: editData.subject || "",
          description: editData.description || "",
          attachment: "", // file cannot be prefilled
          assigned_to: editData.assigned_to || "",
        });
      } else {
        // Reset form for new record
        setTicketFormData({
          user_id: "",
          subject: "",
          description: "",
          attachment: "",
          assigned_to: "",
        });
      }
    }
  }, [showModal, editData]);

  const handleEdit = (ticket) => {
    console.log("Editing:", ticket);
    setEditData(ticket);
    setShowModal(true);
  };

  const complainColumns = [
    { header: "Complain Id", accessor: "ticket_id" },
    { header: "Name", accessor: "user_name" },
    { header: "Subject", accessor: "subject" },
    { header: "Description", accessor: "description" },
    { header: "Status", accessor: "status" },
    { header: "Priority", accessor: "priority" },
    { header: "Send Message", accessor: "send" },
    { header: "View Message", accessor: "view" },
    { header: "Issue Image", accessor: "image" },
    { header: "Assigned To", accessor: "assigned_to" },
    { header: "Created At", accessor: "created_at" },
    { header: "Action", accessor: "action" },
  ];

  /**Logic to handle the dropdowns, modals and image modals inside table. */
  const complainsWithModifications = ticketData.map((row) => ({
    ...row,
    status: (
      <select
        className="p-2.5 mb-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
        value={row.status}
        onChange={(e) => {
          const newStatus = e.target.value;
          setTicketData((prev) =>
            prev.map((item) =>
              item.ticket_id === row.ticket_id
                ? { ...item, status: newStatus }
                : item
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
          setTicketData((prev) =>
            prev.map((item) =>
              item.ticket_id === row.ticket_id
                ? { ...item, priority: newPriority }
                : item
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
      <Button
        className="cursor-pointer"
        onClick={() => setShowImageModal(!showImageModal)}
      >
        <img src={Logo ? Logo : Placeholder} alt="" />
      </Button>
    ),
  }));

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setTicketFormData({
      ...ticketFormData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...ticketFormData };

      const res = editData
        ? await updateTicket(payload)
        : await executeTicket(payload);
      console.log("Ticket Submission Response:", res);
      toast.success(
        editData
          ? "Complaint updated successfully!"
          : "Ticket submitted successfully!"
      );
      if (res) {
        setTicketFormData({
          user_id: "",
          subject: "",
          description: "",
          attachment: "",
          assigned_to: "",
        });
        setShowModal(!showModal);
        refetch();
        navigate("/view-complain");
      }
    } catch (err) {
      console.error("Error submitting ticket:", err);
      toast.error(
        Object.values(err?.errors || { error: ["Something went wrong"] })[0][0]
      );
    }
  };

  return (
    <>
      <div className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center mb-3 p-2.5">
        <h4 className="font-bold text-white text-lg py-2">View Complain</h4>
        <Button
          type="button"
          className="cursor-pointer"
          variant="AddNewBtn"
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
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
                {editData ? "Edit Complaint" : "Register Complaint"}
              </h4>
              <Button
                onClick={() => setShowModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-500 font-bold text-lg shadow-md hover:bg-red-500 hover:text-white transition"
              >
                <i class="fa-solid fa-xmark fa-lg"></i>
              </Button>
            </div>

            <form className="p-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-1 md:gap-6 px-4">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="user_id"
                    id="floating_user_id"
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none peer ${
                      errors?.user_id ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder=" "
                    value={ticketFormData.user_id}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="floating_user_id"
                    className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 ${
                      errors?.user_id
                        ? "peer-focus:text-red-600"
                        : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    }`}
                  >
                    User Id
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="subject"
                    id="floating_subject"
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none peer ${
                      errors?.subject ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder=" "
                    value={ticketFormData.subject}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="floating_subject"
                    className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 ${
                      errors?.subject
                        ? "peer-focus:text-red-600"
                        : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    }`}
                  >
                    Subject
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <textarea
                    name="description"
                    id="floating_description"
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none peer ${
                      errors?.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder=""
                    value={ticketFormData.description}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="floating_description"
                    className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 ${
                      errors?.description
                        ? "peer-focus:text-red-600"
                        : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    }`}
                  >
                    Description
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="file"
                    name="attachment"
                    id="floating_attachment"
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none peer ${
                      errors?.attachment ? "border-red-500" : "border-gray-300"
                    }`}
                    value={ticketFormData.attachment}
                    onChange={handleChange}
                    // required
                  />
                  <label
                    htmlFor="floating_attachment"
                    className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 ${
                      errors?.attachment
                        ? "peer-focus:text-red-600"
                        : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    }`}
                  >
                    Attachment
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="assigned_to"
                    id="floating_assigned_to"
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none peer ${
                      errors?.assigned_to ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder=" "
                    value={ticketFormData.assigned_to}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="floating_assigned_to"
                    className={`absolute text-sm duration-300 text-gray-500 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 ${
                      errors?.assigned_to
                        ? "peer-focus:text-red-600"
                        : "peer-focus:text-blue-600 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    }`}
                  >
                    Assigned To
                  </label>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Button
                  type="submit"
                  disabled={creating || updating}
                  className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
                  focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full 
                  sm:w-auto px-5 py-2.5 text-center"
                >
                  {editData
                    ? updating
                      ? "Updating..."
                      : "Update"
                    : creating
                    ? "Submitting..."
                    : "Submit"}
                </Button>
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
                  className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
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
                <p class="text-xs leading-relaxed text-gray-200">
                  {new Date().toLocaleString()}
                </p>
                <span class="absolute right-[-3px] bottom-0 w-2 h-2 bg-blue-500 rotate-45 rounded-sm"></span>
              </div>
            </div>

            <div class="flex justify-end mt-3">
              <div class="block relative max-w-xs bg-blue-500 text-white p-3 px-4 rounded-2xl rounded-br-none shadow-md">
                <p class="text-lg leading-relaxed">Chat 2</p>
                <p class="text-xs leading-relaxed text-gray-200">
                  {new Date().toLocaleString()}
                </p>
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
