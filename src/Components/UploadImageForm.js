import React, { useState } from "react";

const UploadImageForm = (props) => {
  const [buffer, setBuffer] = useState();
  const [description, setDescription] = useState("");

  const onFileChange = async (e) => {
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(e);
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
    };
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    await props.uploadImage(buffer, description);
    setDescription("");
  };
  return (
    <div>
      <form
        action="#"
        className="bg-gray-600 rounded p-3 w-full"
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
        <label
          htmlFor="large-input"
          className="block text-sm my-1 font-medium text-white "
        >
          Select image
        </label>
        <input
          required
          onChange={(e) => {
            onFileChange(e.target.files[0]);
          }}
          className="block w-full text-sm text-white bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-3"
          aria-describedby="user_avatar_help"
          id="user_avatar"
          type="file"
        />
        <div className="my-2">
          <label
            htmlFor="large-input"
            className="block text-sm my-1 font-medium text-white "
          >
            Description
          </label>
          <input
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            required
            type="text"
            id="large-input"
            className="block p-4 w-full text-white bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-yellow-500 text-white py-2 px-3 rounded mt-2 w-full"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadImageForm;
