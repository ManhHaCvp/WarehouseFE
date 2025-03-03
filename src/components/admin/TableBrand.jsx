import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Pencil } from "lucide-react";

const TableTag = () => {
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDescription, setNewTypeDescription] = useState("");

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("http://localhost:9999/api/brands/get-all");
        if (response.ok) {
          const data = await response.json();
          setTypes(data);
        } else {
          console.error("Failed to load types data");
        }
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };
    fetchTypes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateType = async () => {
    try {
      const response = await fetch("http://localhost:9999/api/brands/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTypeName,
          description: newTypeDescription,
        }),
      });

      if (response.ok) {
        const newType = await response.json();
        setTypes([...types, newType]);
        closeModal();
        console.log("Type created successfully:", newType);
      } else {
        console.error("Failed to create type");
      }
    } catch (error) {
      console.error("Error creating type:", error);
    }
  };

  const handleDeleteType = async (id) => {
    try {
      const response = await fetch(`http://localhost:9999/api/brands/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTypes(types.filter((type) => type._id !== id));
        console.log("Type deleted successfully");
      } else {
        console.error("Failed to delete type");
      }
    } catch (error) {
      console.error("Error deleting type:", error);
    }
  };

  const filteredTypes = types.filter((type) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by type name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-lg w-full sm:w-1/2 lg:w-1/3"
        />
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Create New Type
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Create New Type</h2>
            <input
              type="text"
              placeholder="Type Name"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
            />
            <textarea
              placeholder="Type Description"
              value={newTypeDescription}
              onChange={(e) => setNewTypeDescription(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateType}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTypes.map((type) => (
              <tr key={type._id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{type.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{type.description}</div>
                </td>
              
                <td className="px-6 py-4 whitespace-nowrap">
                  {type.createdAt && (
                    <div className="text-sm text-gray-900">
                      {format(parseISO(type.createdAt), "HH:mm:ss dd-MM-yyyy")}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium flex justify-center">
                 
                  <button
                    onClick={() => handleDeleteType(type._id)}
                    className="ml-4 bg-white hover:bg-gray-50 text-red-600 hover:text-red-900 py-1 px-2 border border-gray-200 rounded shadow"
                  >
                    <p className="text-sm">Delete</p>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableTag;
