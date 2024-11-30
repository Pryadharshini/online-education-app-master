import React from "react";
import Back from "../common/back/Back";
import BlogCard from "./Quiz";
import "./quiz.css";
import "./Gquiz.css";

const Gquiz = () => {
  return (
    <>
      <Back title="Gquiz" />
      <section className="gquiz padding">
        <div className="gquiz-container grid2">
          <BlogCard />
        </div>
      </section>
    </>
  );
};

export default Gquiz;
