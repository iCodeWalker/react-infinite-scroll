import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col } from "react-bootstrap";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const elementRef = useRef(null);

  useEffect(() => {
    function onIntersection(entries) {
      const firstEntey = entries[0];
      if (firstEntey.isIntersecting && hasMore) {
        fetchMoreItems();
      }
    }
    const observer = new IntersectionObserver(onIntersection);

    if (observer && elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect(elementRef.current);
      }
    };
  }, [products]);

  async function fetchMoreItems() {
    const response = await fetch(
      `https://dummyjson.com/products?limit=10&skip=${page * 10}`
    );

    const data = await response.json();

    console.log(data, "data");

    if (data.products.length == 0) {
      setHasMore(false);
    } else {
      setProducts((prevProducts) => [...prevProducts, ...data.products]);
      setPage((prevPage) => prevPage + 1);
    }
  }

  return (
    <>
      {products.map((product) => {
        return (
          <Card
            key={product.id}
            style={{ width: "600px", margin: "0 auto" }}
            className="mb-2"
          >
            <Row>
              <Col md={4}>
                <img
                  src={product.thumbnail}
                  alt="product Image"
                  style={{ width: "100%", margin: "10px" }}
                />
              </Col>
              <Col md={8}>
                <Card.Body>
                  <Card.Text>{product.description}</Card.Text>
                  <Card.Text>$ {product.price}</Card.Text>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        );
      })}
      {hasMore && (
        <div ref={elementRef} style={{ textAlign: "center" }}>
          Load More Data
        </div>
      )}
    </>
  );
};
export default ProductList;
