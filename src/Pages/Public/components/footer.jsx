import React from "react";
import { useHistory } from "react-router-dom";
export const Footer = () => {
  const { push } = useHistory();
  return (
    <div>
      <div id="footer1">
        <div className="container text-center">
          <div className="column one column_column">
            <a href="" target="_blank">
              <span>
                If you are interested in Sevice Vault <span>Software</span>, do not wait and{" "}
                <span>
                  {" "}
                  <span className="themecolor" onClick={() => push("/pricing")}>
                    BUY IT NOW!
                  </span>
                </span>
              </span>
            </a>
            <br />
            <p>
              <a href="/pdf/Service-Vault-Australian-Privacy-Policy.pdf" target="_blank">
                Privacy Policy
              </a>{" "}
              |{" "}
              <a href="/pdf/Service-Vault-Terms-and-Conditions.pdf" target="_blank">
                Terms &amp; Conditions
              </a>
            </p>{" "}
          </div>
        </div>
      </div>
      {/* <div id='footer'>
                <div classname='container text-center'>
                    <div classname="column one">

                        <a id="back_to_top" classname="footer_button" href=""><i classname="fa fa-arrow-circle-up" aria-hidden="true"></i></a>
                        <div classname="copyright">
                            service vault © 2022 - created by codebooth						</div>

                        <ul classname="social"></ul>
                    </div>
                   
                </div>
            </div> */}
    </div>
  );
};
