import React from "react";

const SearchBar = ({ searchQuery, setSearchQuery, text }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder={text}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
