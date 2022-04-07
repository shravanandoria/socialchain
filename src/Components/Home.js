import React from "react";
import { PostItem } from "./PostItem";
import UploadImageForm from "./UploadImageForm";
import Spinner from "./Spinner";
import Alert from "./Alert";
const Home = (props) => {
  return (
    <>
      {props.error && <Alert message={props.error} />}
      {props.loading && <Spinner />}
      <div className="m-4 md:grid md:grid-cols-3 justify-items-center">
        <div className="col-span-2 ">
          {props.posts.map((e) => {
            return (
              <PostItem
                web3={props.web3}
                setReload={props.setReload}
                loading={props.loading}
                tipImage={props.tipImage}
                key={e.id}
                author={e.author}
                description={e.description}
                hash={e.hash}
                id={e.id}
                tipAmount={e.tipAmount}
              />
            );
          })}
        </div>
        <div>
          <UploadImageForm uploadImage={props.uploadImage} />
        </div>
      </div>
    </>
  );
};

export default Home;
