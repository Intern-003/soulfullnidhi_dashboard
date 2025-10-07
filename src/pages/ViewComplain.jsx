import Table from "../components/Table";

export const ViewComplain = () => {
  const complainColumns = [
    { header: "Complain Id", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Subject", accessor: "subject" },
    { header: "Description", accessor: "description" },
    { header: "Status", accessor: "status" },
    { header: "Priority", accessor: "priority" },
    { header: "View Message", accessor: "message" },
    { header: "Issue Image", accessor: "image" },
  ];

  const complains = [
    {
      id: "1",
      name: "yuvraj",
      subject: "Email Issue",
      description: "Can't Send email from your portal.",
      status: "Open",
      priority: "High",
      message: "Modal",
      image: "image",
    },
  ];

  return (
    <>
      <div
        className="bg-gradient-to-t from-sky-500 to-indigo-500 flex justify-between items-center"
        style={{ margin: "0px  0px 20px 0px", padding: "10px" }}
      >
        <h4 className="font-bold text-white text-lg py-2">View Complain</h4>

      </div>
      <Table columns={complainColumns} data={complains} />
    </>
  );
};
