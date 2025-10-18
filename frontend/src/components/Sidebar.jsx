import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";


const Sidebar = ({ chats, setChats, setPostResult }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ When sidebar opens, create a new chat automatically
  useEffect(() => {
    if (sidebarOpen) {
      const newChat = { id: Date.now(), content: "" };
      setChats((prev) => {
        const updated = [newChat, ...prev];
        localStorage.setItem("myChats", JSON.stringify(updated));
        return updated;
      });
      setPostResult(""); // clear post generator
    }
  }, [sidebarOpen, setChats, setPostResult]);

  const deleteChat = (id) => {
    const updated = chats.filter((c) => c.id !== id);
    setChats(updated);
    localStorage.setItem("myChats", JSON.stringify(updated));
  };

  const filteredChats = chats?.filter((c) =>
    c.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div
      className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}
      style={{
        width: sidebarOpen ? 300 : 60,
        minWidth: sidebarOpen ? 300 : 60,
      }}
    >
      <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      <div className="sidebar-header">
        {sidebarOpen && <h3>My Chats</h3>}
        {sidebarOpen && (
          <button className="new-chat-btn" onClick={() => setPostResult("")}>
            <FaPlus /> New
          </button>
        )}
      </div>

      <div className="search-chat">
        <FaSearch />
        {sidebarOpen && (
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
      </div>

      <div className="chat-list">
        {filteredChats.length > 0 ? (
          filteredChats.map((c) => (
            <div key={c.id} className="chat-item">
              {sidebarOpen && (
                <p onClick={() => setPostResult(c.content)}>
                  {c.content || "New Chat..."}
                </p>
              )}
              <button onClick={() => deleteChat(c.id)}>
                <FaTrash />
              </button>
            </div>
          ))
        ) : (
          sidebarOpen && <p className="no-chat">No chats found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
