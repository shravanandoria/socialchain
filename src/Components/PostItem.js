import React from "react";
export const PostItem = (props) => {
  return (
    <div>
      <div className="max-w-sm rounded overflow-hidden  shadow-lg my-3 bg-gray-600 text-white">
        <div className="text-center p-2 bg-black">{props.author}</div>
        <img
          className="w-full h-52 object-center"
          src={props.hash}
          alt="Image Loading..."
        />

        <div className="px-6 py-4">
          <p className="text-white">{props.description}</p>
        </div>
        <hr />
        <div className="py-2 px-4 flex justify-between items-center">
          <h1>Tips {props.web3.utils.fromWei(props.tipAmount)} Eth</h1>
          <button
            disabled={props.loading}
            onClick={() => {
              props.tipImage(props.id, "0.1");
            }}
            className="bg-yellow-500 text-white p-2 rounded"
          >
            Tip 0.1 ETH
          </button>
        </div>
      </div>
    </div>
  );
};
