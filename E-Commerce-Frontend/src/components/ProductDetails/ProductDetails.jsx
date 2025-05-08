// ProductDetail.jsx
import React, { useState, useEffect } from "react";
import {
    Container,
    Button
} from "@mui/material";
import { Col, Row, Input } from "reactstrap";
import InnerImageZoom from "react-inner-image-zoom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import s from "./Product.module.scss";
import { ENV } from "../../App.jsx";
import { useParams, useLocation } from "react-router-dom";
import "react-inner-image-zoom/lib/styles.min.css";
import CustomBreadcrumbs from "../CustomBreadcrumbs/CustomBreadcrumbs.jsx";
import Loader from "../Loader/Loader.jsx";
import CustomModal from "../CustomModal/CustomModal.jsx";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {useCart} from "../../context/CartContext.jsx";
import { useNavigate } from 'react-router-dom';

const Star = ({
                  selected = false,
                  onClick = f => f,
                  index,
                  onHover = f => f,
                  className = "",
                  clickable = false
              }) => (
    <div
        className={`${s.star}${selected ? ` ${s.selected}` : ""} ${className}`}
        data-index={index}
        onClick={onClick}
        style={clickable? {cursor: "pointer"} : {}}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(-1)}
    />
);

const loadProduct = async (setLoading, location, setProduct, productId, id) => {
    try {
        setLoading(true);
        location.pathname.includes("/productDetails/") ? scroll(0,0) : {}
        const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/products/getById/${productId || id}`);
        const data = await response.json();

        if (!data.error) {
            setProduct(data.data);
        } else {
            toast.error(data.error);
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        toast.error("Could not load product data.");
    } finally {
        setLoading(false);
    }
};

const loadReviews = async (setLoading2, location, setReviews, productId, id) => {
    try {
        setLoading2(true);
        location.pathname.includes("/productDetails/") ? scroll(0,0) : {}
        const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/reviews/get/${productId || id}`);
        const data = await response.json();

        if (!data.error) {
            setReviews(data.data);
        } else {
            toast.error(data.error);
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        toast.error("Could not load product data.");
    } finally {
        setLoading2(false);
    }
};

const createReview = async (setLoading2, location, setReviews, setModalOpen, productId, id, starsSelected, comment) => {
    try {
        setLoading2(true);
        location.pathname.includes("/productDetails/") ? scroll(0,0) : {}
        const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/reviews/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            },
            body: JSON.stringify({
                productId: productId || id,
                rating: starsSelected,
                comment: comment,
            }),
        });
        const data = await response.json();

        if (!data.error) {
            setReviews(prev => [...prev, data.data]);
            toast.success("Feedback submitted (demo)");
        } else {
            toast.error(data.error);
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        toast.error("Could not load product data.");
    } finally {
        setLoading2(false);
        setModalOpen(false);
    }
}

const ProductDetails = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [starsSelected, setStarsSelected] = useState(0);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const { addToCart, user } = useCart();
    const [addedItems, setAddedItems] = useState({});
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (productId || id) {
            const fetchData = async () => {
                await loadProduct(setLoading, location, setProduct, productId, id);
                await loadReviews(setLoading2, location, setReviews, productId, id);
            }
            fetchData();
        }
    }, [productId, id]);

    const addItemToCart = (product) => {
        setIsLoading(true);
        try {
            addToCart(product, quantity);
            setAddedItems(prev => ({ ...prev, [product._id]: true }));
            setTimeout(() => {
                setAddedItems(prev => ({ ...prev, [product._id]: false }));
            }, 2000);
            toast.success("Item added to cart");
        } finally {
            setIsLoading(false);
        }
    };

    const submitFeedback = e => {
        e.preventDefault();
        createReview(setLoading2, location, setReviews, setModalOpen, productId, id, starsSelected, comment);
    };

    if (loading) {
        return <Loader />;
    }

    if (!product) {
        return <p className="text-center text-danger">Product not found</p>;
    }

    return (
        <>
            <Container style={{backgroundColor: 'white', padding: '1rem 2rem', borderRadius: '1rem', maxWidth: 1400, marginTop: '2rem'}}>
                {location.pathname.includes("/productDetails/") && (
                    <div className="p-2">
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
                <Row className="mb-5 mt-2 pt-2 position-relative" style={{ marginTop: 32 }}>
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
                                    {reviews?.length || 0} {(reviews?.length || 0) !== 1? 'reviews' : 'review'}
                                </p>
                            </div>
                            <p>{product.description}</p>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-column mr-5 align-items-center">
                                    <h6 className="fw-bold text-muted text-uppercase">Quantity</h6>
                                    <div className="d-flex align-items-center w-100 justify-content-between">
                                        <Button
                                            className={`fw-bold me-2 ${s.quantityBtn}`}
                                            onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                                        >
                                            −
                                        </Button>
                                        <p className="fw-bold mb-0">{quantity}</p>
                                        <Button
                                            className={`fw-bold ms-2 ${s.quantityBtn}`}
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
                                variant="contained"
                                className="add-to-cart-button"
                                startIcon={<ShoppingCartIcon />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addItemToCart(product)}
                                }
                                disabled={product.stock === 0 || isLoading || addedItems[product._id]}
                                sx={{
                                    borderRadius: '12px',
                                    width: "50%",
                                    px: 2,
                                    py: 1,
                                    background: addedItems[product._id]
                                        ? 'linear-gradient(45deg, #2e7d32, #4caf50)'
                                        : 'linear-gradient(45deg, #091540, #3D518C)',
                                    boxShadow: '0 4px 15px rgba(9, 21, 64, 0.3)',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    opacity: isLoading ? 0.7 : 1,
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    '&:hover': {
                                        background: addedItems[product._id]
                                            ? 'linear-gradient(45deg, #1b5e20, #2e7d32)'
                                            : 'linear-gradient(45deg, #091540, #1B2CC1)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(9, 21, 64, 0.4)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {isLoading ? 'Adding...' : (addedItems[product._id] ? 'Added!' : 'Add to Cart')}
                            </Button>
                            <Button
                                variant="contained"
                                className="add-to-cart-button"
                                onClick={(e) => {
                                        e.stopPropagation();
                                        addItemToCart(product)
                                        navigate('/cart')
                                    }
                                }
                                disabled={product.stock === 0 || isLoading || addedItems[product._id]}
                                sx={{
                                    borderRadius: '12px',
                                    width: "50%",
                                    px: 2,
                                    py: 1,
                                    background: addedItems[product._id]
                                        ? 'linear-gradient(45deg, #2e7d32, #4caf50)'
                                        : 'linear-gradient(45deg, #091540, #3D518C)',
                                    boxShadow: '0 4px 15px rgba(9, 21, 64, 0.3)',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    opacity: isLoading ? 0.7 : 1,
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    '&:hover': {
                                        background: addedItems[product._id]
                                            ? 'linear-gradient(45deg, #1b5e20, #2e7d32)'
                                            : 'linear-gradient(45deg, #091540, #1B2CC1)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(9, 21, 64, 0.4)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
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
                        {
                            user && user._id && (
                                <Button
                                    className={`bg-transparent border-0 fw-bold text-primary p-0 ${s.leaveFeedbackBtn}`}
                                    onClick={() => setModalOpen(true)}
                                >
                                    + Leave Feedback
                                </Button>
                            )
                        }
                    </Col>

                    {/* render mock reviews */}
                    {
                        !loading2 ? (
                            reviews.map(item => (
                                <Col sm={12} className="d-flex mt-4 gap-3" key={item.id}>
                                    <img
                                        src={item.image}
                                        className={`mr-4 ${s.reviewImg}`}
                                        alt={`${item.name} avatar`}
                                    />
                                    <div className="d-flex flex-column justify-content-between align-items-start w-100">
                                        <div className={`d-flex justify-content-between w-100 ${s.reviewMargin}`}>
                                            <h6 className="fw-bold mb-0">
                                                {item.name}
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
                                        <p className="mb-0">{item.comment}</p>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <Loader />
                        )
                    }
                </Row>
            </Container>

            <CustomModal open={modalOpen} onClose={() => setModalOpen(false)} sx={{width:'40%'}}>
                <div className="p-4">
                    <h3 className="fw-bold mb-4">Leave Your Feedback</h3>
                    <form onSubmit={submitFeedback}>
                        <div className="d-flex align-items-center mb-3">
                            <h6 className="fw-bold mr-3 mb-0">Rate:</h6>
                            <div className={s.starContainer}>
                                {[1, 2, 3, 4, 5].map((n, i) => {
                                    const reversedIndex = 4 - i;
                                    return (
                                        <Star
                                            key={i}
                                            selected={reversedIndex < starsSelected}
                                            onClick={() => setStarsSelected(reversedIndex + 1)}
                                            className={`${s.newReviewStar}`}
                                            clickable={true}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        <Input
                            type="textarea"
                            placeholder="Comment"
                            style={{ height: 100, maxHeight: 180, minHeight: 80 }}
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <div className="text-center mt-4">
                            <Button type="submit" color="primary" className="text-uppercase fw-bold">
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </CustomModal>
        </>
    );
};

export default ProductDetails;
