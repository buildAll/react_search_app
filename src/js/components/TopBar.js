import React from 'react'

const SearchBar = ({value, searchContentUpdate}) => (
    <input type="text" placeholder="请输入你想搜索的内容" className="search-bar" value={value}
        onChange={searchContentUpdate}
        onKeyDown={searchContentUpdate}
        onBlur={searchContentUpdate}
    />
);

const TopBar = ({curKeyword, onDeleteContent, onSearchContentUpdated}) => (
    <div className="top-bar">
        <div className="search-icon"></div>
        <SearchBar value={curKeyword} searchContentUpdate={onSearchContentUpdated}/>
        <span className="delete-btn" onClick={onDeleteContent}></span>
    </div>
);

export default TopBar
