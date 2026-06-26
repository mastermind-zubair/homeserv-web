export const About = (props) => {
  return (
    <div id="about" className="boardabout">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-md-12 highlight-left">
            <div className="about-text text-center">

              <h2 > {props.data ? props.data.Heading : "loading..."}</h2>
              <h4 >
                {props.data ? props.data.paragraph : "loading..."}
              </h4>
            </div>
          </div>
          <div className="col-xs-12 col-md-12">

            <img src="/img/diagram_for_homepage.png" className="img-responsive center-block" alt="" />
          </div>

        </div>
      </div>
    </div>
  );
};
