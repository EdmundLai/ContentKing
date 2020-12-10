import React from "react";

import TransferList from "../TransferList/TransferList";

export default function TopicPicker(props) {
  const { username } = props;

  return (
    <div className="TopicPicker">
      <TransferList />
    </div>
  );
}
