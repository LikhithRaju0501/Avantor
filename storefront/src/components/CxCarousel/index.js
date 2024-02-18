import React from "react";
import { Button, Card, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

const CxCarousel = ({ title, slides }) => {
  return (
    <div className="container mb-5">
      <h3>{title}</h3>

      <Carousel data-bs-theme="dark">
        {slides?.map(
          ({
            _id,
            title,
            description,
            imgSrc,
            isButton,
            buttonTitle,
            btnUrl,
          }) => {
            return (
              <Carousel.Item className="text-center" key={_id}>
                <img
                  style={{
                    height: "50vh",
                    width: "50%",
                    display: "inline-block",
                  }}
                  src={imgSrc}
                  alt={title}
                />
                <Carousel.Caption>
                  <Card
                    style={{ backgroundColor: "white" }}
                    className="card-border"
                  >
                    <Card.Body>
                      <h5>{title}</h5>
                      <p>{description}</p>
                      {isButton && (
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`${btnUrl}`}
                        >
                          <Button>{buttonTitle}</Button>
                        </Link>
                      )}
                    </Card.Body>
                  </Card>
                </Carousel.Caption>
              </Carousel.Item>
            );
          }
        )}
      </Carousel>
    </div>
  );
};

export default CxCarousel;
