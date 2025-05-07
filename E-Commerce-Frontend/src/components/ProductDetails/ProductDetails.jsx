// ProductDetail.jsx
import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Modal,
    ModalBody,
    Input,
} from "reactstrap";
import InnerImageZoom from "react-inner-image-zoom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import s from "./Product.module.scss";
import { ENV } from "../../App.jsx";
import { useParams, useLocation } from "react-router-dom";
import "react-inner-image-zoom/lib/styles.min.css";
import CircularProgress from "@mui/material/CircularProgress";
import CustomBreadcrumbs from "../CustomBreadcrumbs/CustomBreadcrumbs.jsx";


const Star = ({
                  selected = false,
                  onClick = f => f,
                  index,
                  onHover = f => f,
                  className = "",
              }) => (
    <div
        className={`${s.star}${selected ? ` ${s.selected}` : ""} ${className}`}
        data-index={index}
        onClick={onClick}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(-1)}
    />
);

const mockReviews = [
    {
        id: 1,
        firstname: "Alice",
        lastname: "Johnson",
        rating: 4,
        date: "2025-04-28",
        review: "Great motherboard, super-stable under load.",
    },
    {
        id: 2,
        firstname: "Bob",
        lastname: "Lee",
        rating: 5,
        date: "2025-05-02",
        review: "Exceeded my expectations—I’d buy again!",
    },
    {
        id: 3,
        firstname: "Carol",
        lastname: "Smith",
        rating: 3,
        date: "2025-05-03",
        review: "Good value, but the BIOS UI could be friendlier.",
    },
];

const ProductDetails = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [starsSelected, setStarsSelected] = useState(0);
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [review, setReview] = useState("");
    const { id } = useParams();
    const location = useLocation();

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/products/getById/${productId || id}`);
                const data = await response.json();

                if (response.ok) {
                    setProduct(data.data);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error("Could not load product data.");
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [productId, id]);

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("products") || "[]");
        cart.push({ product: id, quantity, date: new Date() });
        localStorage.setItem("products", JSON.stringify(cart));
        toast.success("Added to cart");
    };

    const submitFeedback = e => {
        e.preventDefault();
        setModalOpen(false);
        toast.success("Feedback submitted (demo)");
    };

    if (loading) {
        return <Loader />;
    }

    if (!product) {
        return <p className="text-center text-danger">Product not found</p>;
    }

    return (
        <>
            <ToastContainer />

            {location.pathname.includes("/productDetails/") && (
                <div className="p-4 mx-lg-4">
                    <CustomBreadcrumbs locations={[
                        {
                            route: 'products',
                            title: 'Products',
                            onClick: () => {
                                setSelectedCategories([]);
                            },
                        },{
                            route: `products/${product.category}`,
                            title: product.category,
                        },
                    ]} />
                </div>
            )}
            <Container style={{backgroundColor: 'white', padding: '1rem 2rem', borderRadius: '1rem'}}>
                <Row className="mb-5 mt-2 pt-2 position-relative" style={{ marginTop: 32 }}>
                    {/*<Button variant="contained"*/}
                    {/*        className={`${s.backBtn}`}*/}
                    {/*        onClick={() => navigate("/products")}>*/}
                    {/*    <ArrowBackIcon className={s.backIcon} fontSize="small" />*/}
                    {/*    Back to Products*/}
                    {/*</Button>*/}
                    <Col xs={12} lg={6} className="d-flex">
                        <InnerImageZoom
                            src={product.image}
                            zoomSrc={product.image}
                            zoomType="hover"
                            zoomScale={1.8}
                            className={`${s.productImageZoom} ${s.liz}`}
                        />
                    </Col>

                    <Col xs={12} lg={6} className="d-flex flex-column justify-content-around">
                        <div className={`${s.dataContainer}`}>
                            <h6 className={`text-muted ${s.detailCategory}`}>
                                {product.category} > {product.brand}
                            </h6>
                            <h4 className="fw-bold">{product.name}</h4>
                            <div className="d-flex align-items-center">
                                {[1,2,3,4,5].map((n,i) => (
                                    <Star key={i} selected={i < Math.round(product.rating)} />
                                ))}
                                <p className="text-primary ml-3 mb-0 ms-2" >
                                    {product.numReviews} reviews
                                </p>
                            </div>
                            <p>{product.description}</p>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-column mr-5 align-items-center">
                                    <h6 className="fw-bold text-muted text-uppercase">Quantity</h6>
                                    <div className="d-flex align-items-center w-100 justify-content-between">
                                        <Button
                                            className={`border-0 p-1 fw-bold mr-3 ${s.quantityBtn}`}
                                            onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                                        >
                                            −
                                        </Button>
                                        <p className="fw-bold mb-0">{quantity}</p>
                                        <Button
                                            className={`border-0 p-1 fw-bold ml-3 ${s.quantityBtn}`}
                                            onClick={() => setQuantity(q => q + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-center justify-content-center">
                                    <h3 className="fw-bold">${product.price}</h3>
                                </div>
                            </div>
                            <p className="mt-2">
                                {product.stock > 0
                                    ? <span className="text-success">In Stock ({product.stock})</span>
                                    : <span className="text-danger">Out of Stock</span>
                                }
                            </p>
                        </div>

                        <div className={`${s.buttonsWrapper} d-flex gap-4`}>
                            <Button
                                outline
                                color="primary"
                                className="flex-fill mr-4 text-uppercase fw-bold"
                                style={{ width: "50%" }}
                                disabled={product.stock === 0}
                                onClick={addToCart}
                            >
                                Add to Cart
                            </Button>
                            <Button
                                color="primary"
                                className="flex-fill text-uppercase fw-bold"
                                style={{ width: "50%" }}
                                disabled={product.stock === 0}
                                onClick={addToCart}
                            >
                                Buy Now
                            </Button>
                        </div>
                    </Col>
                </Row>

                <hr />

                {/* — Reviews Section — */}
                <Row className="mb-5">
                    <Col sm={12} className="d-flex justify-content-between">
                        <h4 className="fw-bold">Reviews</h4>
                        <Button
                            className={`bg-transparent border-0 fw-bold text-primary p-0 ${s.leaveFeedbackBtn}`}
                            onClick={() => setModalOpen(true)}
                        >
                            + Leave Feedback
                        </Button>
                    </Col>

                    {/* render mock reviews */}
                    {mockReviews.map(item => (
                        <Col sm={12} className="d-flex mt-4 gap-3" key={item.id}>
                            <img
                                src={`${ENV.VITE_BACKEND_URL}/avatar/${item.id}`}
                                className={`mr-4 ${s.reviewImg}`}
                                alt={`${item.firstname} avatar`}
                            />
                            <div className="d-flex flex-column justify-content-between align-items-start">
                                <div className={`d-flex justify-content-between w-100 ${s.reviewMargin}`}>
                                    <h6 className="fw-bold mb-0">
                                        {item.firstname} {item.lastname}
                                    </h6>
                                    <p className="text-muted mb-0">
                                        {new Date(item.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="d-flex">
                                    {[1,2,3,4,5].map((_, i) => (
                                        <Star key={i} selected={i < item.rating} />
                                    ))}
                                </div>
                                <p className="mb-0">{item.review}</p>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>

            <Modal style={{marginTop: "120px"}} isOpen={modalOpen} toggle={() => setModalOpen(o => !o)}>
                <div className="p-5">
                    <Button
                        className="border-0 fw-bold m-3 bg-danger"
                        style={{ position: "absolute", top: 0, right: 0, padding: '10px 15px' }}
                        onClick={() => setModalOpen(o => !o)}
                    >
                        ×
                    </Button>
                    <ModalBody>
                        <h3 className="fw-bold mb-4">Leave Your Feedback</h3>
                        <form onSubmit={submitFeedback}>
                            <div className="d-flex align-items-center mb-3">
                                <h6 className="fw-bold mr-3 mb-0">Rate:</h6>
                                <div className={s.starContainer}>
                                    {[1, 2, 3, 4, 5].map((n, i) => {
                                        const reversedIndex = 4 - i; // Reverse the index for selection
                                        return (
                                            <Star
                                                key={i}
                                                selected={reversedIndex < starsSelected}
                                                onClick={() => setStarsSelected(reversedIndex + 1)}
                                                className={`${s.newReviewStar}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="d-flex mb-3">
                                <Input
                                    type="text"
                                    placeholder="First Name"
                                    className="mr-2"
                                    value={firstname}
                                    onChange={e => setFirstName(e.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastname}
                                    onChange={e => setLastName(e.target.value)}
                                />
                            </div>
                            <Input
                                type="textarea"
                                placeholder="Comment"
                                style={{ height: 100 }}
                                value={review}
                                onChange={e => setReview(e.target.value)}
                            />
                            <div className="text-center mt-4">
                                <Button type="submit" color="primary" className="text-uppercase fw-bold">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </div>
            </Modal>
        </>
    );
};

export default ProductDetails;
