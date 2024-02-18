import React from "react";
import { useLocation } from "react-router-dom";
import CxParagraph from "../CxParagraph";
import CxCarousel from "../CxCarousel";
import { useGetPage } from "../../api/pages";
import { PageNotFound } from "../../screens";

const CmsComponent = ({ children }) => {
  const location = useLocation();
  const { pathname } = location;

  const { data } = useGetPage(pathname);
  return (
    <div className="container">
      {data?.data?.length ? (
        data.data.map(({ _id, type, ...rest }) => {
          return (
            <div key={_id}>
              {type === "ParagraphComponent" ? (
                <CxParagraph {...rest} />
              ) : type === "CarouselComponent" ? (
                <CxCarousel {...rest} />
              ) : (
                <></>
              )}
            </div>
          );
        })
      ) : !children ? (
        <PageNotFound />
      ) : null}
      {children}
    </div>
  );
};

export default CmsComponent;
