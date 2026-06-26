import Navigation from "Data/Navigation";
import { HandlePathChanged } from "Lib/NavigationHelper";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const PageTitle = ({ suffix }) => {
  const location = useLocation();
  const [title, setTitle] = useState();
  const { t } = useTranslation();
  useEffect(() => {
    const { module, page, subPage } = HandlePathChanged(
      "app",
      location.pathname,
      Navigation
    );

    let ttl =
      (subPage && t(subPage.label_key)) ||
      (page && t(page.label_key)) ||
      (module && t(module.default_page_title_key));
    setTitle(ttl);
  }, [location.key]);

  return (
    <>
      <h1 className="text-primary">
        {title} {suffix}
        {/* Manage {ENTITY_PLURAL}{" "}
          <span className="text-grey text-small">
            (Organisation: <span className="text-danger">{organisation && organisation.name}</span>)
          </span> */}
      </h1>
    </>
  );
};
export default PageTitle;
