import React from "react";

const Checkbox = () => {
  return (
    <input
      className="row-check"
      type="checkbox"
      onChange={e => {
        console.log(e.target.checked);
        console.log(item);
      }}
    />
  );
};

export default Checkbox;
