import React from "react";
import "./page.css";
const Page = () => {
  return (
    <section class="page_404">
      <div class="container404">
        <div class="four_zero_four_bg">
          <h1 class="text-center ">404</h1>
        </div>
        <div class="contant_box_404">
          <h3 class="h2">Look like you're lost</h3>
          <p>the page you are looking for not avaible!</p>
          <a href="/" class="link_404">
            Go to Home
          </a>
        </div>
      </div>
    </section>
  );
};

export default Page;
