import React from "react";
import searchIcon from "../../assets/icons/search.svg";
import classes from "./SearchBar.module.css";

const SearchBar = () => {
  return (
    <div className={classes.SearchBar}>
      <input
        type="text"
        // value={this.state.inputVal}
        // onChange={this.handleType}
        placeholder="Search for a graph"
      />
      <button>
        <img src={searchIcon} alt="Search" />
      </button>
    </div>
  );
};

export default SearchBar;
