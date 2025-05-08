import Loader from "../Loader/Loader.jsx";
import NoResultsPlaceholder from "../NoResultsPlaceholder/NoResultsPlaceholder.jsx";
import {Grid} from "@mui/material";
import {motion} from "framer-motion";
import Tilt from "react-parallax-tilt";
import ProductCard from "../ProductCard/ProductCard.jsx";
import * as React from "react";

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

const ProductGrid = ({isLoading, products, handleAddToCart, addedItems}) => {

    return (
        <>
            <div className="d-grid gap-4 m-3 products-view justify-content-center">
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '2rem', minHeight: "500px",
                        alignItems: "center" }}>
                        <Loader />
                    </div>
                ) : !products.length ? (
                    <NoResultsPlaceholder />
                ) : (
                    products.map((product, index) => (
                        <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                            <div className="product-card">
                                <motion.div
                                    variants={itemVariants}
                                    custom={index}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Tilt
                                        tiltMaxAngleX={8}
                                        tiltMaxAngleY={8}
                                        scale={1}
                                        transitionSpeed={1500}
                                        gyroscope={true}
                                    >
                                        <ProductCard
                                            product={product}
                                            handleAddToCart={() => handleAddToCart(product._id)}
                                            addedItems={addedItems}
                                        />
                                    </Tilt>
                                </motion.div>
                            </div>
                        </Grid>
                    ))
                )}
            </div>
        </>
    )
}

export default ProductGrid;