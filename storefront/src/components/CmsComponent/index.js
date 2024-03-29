import React from "react";
import { useLocation } from "react-router-dom";
import CxParagraph from "../CxParagraph";
import CxCarousel from "../CxCarousel";
import { useGetPage } from "../../api/pages";
import { PageNotFound } from "../../screens";
import CxAccordion from "../CxAccordion";
import CxSpinner from "../CxSpinner";

const CmsComponent = ({ children }) => {
  const location = useLocation();
  const { pathname } = location;

  const firstSlashIndex = pathname.indexOf("/");
  const secondSlashIndex = pathname.indexOf("/", firstSlashIndex + 1);
  const result =
    secondSlashIndex === -1
      ? pathname
      : pathname.substring(-1, secondSlashIndex);

  const { data, isLoading } = useGetPage(result);

  return !isLoading ? (
    <>
      {data?.data?.length ? (
        data.data.map(({ _id, type, ...rest }) => {
          return (
            <div key={_id}>
              {type === "ParagraphComponent" ? (
                <CxParagraph {...rest} />
              ) : type === "AccordionComponent" ? (
                <CxAccordion {...rest} />
              ) : type === "CarouselComponent" ? (
                <CxCarousel {...rest} />
              ) : type === "FlexComponent" ? (
                <>{children}</>
              ) : (
                <></>
              )}
            </div>
          );
        })
      ) : !children ? (
        <PageNotFound />
      ) : (
        <PageNotFound />
      )}
    </>
  ) : (
    <CxSpinner />
  );
};

export default CmsComponent;
