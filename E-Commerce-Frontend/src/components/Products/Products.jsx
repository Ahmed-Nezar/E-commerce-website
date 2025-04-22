import CustomBreadcrumbs from "../CustomBreadcrumbs/CustomBreadcrumbs.jsx";
import ProductCard from "../ProductCard/ProductCard.jsx";
import SelectComp from "../SelectComp/SelectComp.jsx";
import {useState} from "react";
import {Grid} from "@mui/material";
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import "../Products/Products.css";


const Products = () => {
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
    const [products] = useState([
        {
            id: 1,
            name: 'Razer Basilisk V3',
            price: 69.99,
            image: '/images/products/Razer_Basilisk_V3.jpg',
            description: 'Pro Gaming Mouse',
            stock: 25,
            rating: 4.7
        },
        {
            id: 2,
            name: 'RTX 5060 Ti',
            price: 499.99,
            image: '/images/products/RTX_5060_Ti.png',
            description: 'Mid-Range Gaming GPU',
            stock: 3,
            rating: 4.9
        },
        {
            id: 3,
            name: 'Razer Kraken V4',
            price: 199.99,
            image: '/images/products/Razer_Kraken_V4.jpg',
            description: 'Wireless Gaming Headset',
            stock: 10,
            rating: 4.8
        },
        {
            id: 4,
            name: 'Samsung Odyssey OLED G8',
            price: 1299.99,
            image: '/images/products/Samsung-Odyssey-OLED-G8.jpg',
            description: '34" Ultra-Wide Gaming Monitor',
            stock: 12,
            rating: 4.9
        },
        {
            id: 5,
            name: 'Keychron Q5 HE',
            price: 199.99,
            image: '/images/products/Keychron_Q5_HE.png',
            description: 'Hot-swappable Mechanical Keyboard',
            stock: 15,
            rating: 4.6
        },
        {
            id: 6,
            name: 'Lian Li O11 Vision',
            price: 219.99,
            image: '/images/products/O11VP_000a.png',
            description: 'Premium ATX PC Case',
            stock: 7,
            rating: 4.8
        },
        {
            id: 7,
            name: 'NVIDIA Quantum X800',
            price: 1499.99,
            image: '/images/products/NVIDIA_Quantum-X800.jpg',
            description: 'Next-gen GPU Technology',
            stock: 5,
            rating: 4.8
        },
        {
            id: 8,
            name: 'Dark Power Pro 13 1600W',
            price: 399.99,
            image: '/images/products/Dark_Power_Pro_13_1600W.jpg',
            description: 'Platinum Rated PSU',
            stock: 8,
            rating: 4.7
        },
        {
            id: 9,
            name: 'ADATA SD 8.0 Express',
            price: 129.99,
            image: '/images/products/adata-SD-8.0-Express-UE720.jpg',
            description: 'High-Speed Storage Solution',
            stock: 20,
            rating: 4.5
        }
    ]);
    return (
        <>
            <div className="w-full">
                {/* Top Banner Image */}
                <div className="d-grid align-content-center headerBG"><h1 className="text-white ">GPU</h1></div>

                {/* Breadcrumbs */}
                <div className="px-6 py-4 mx-lg-4">
                    <CustomBreadcrumbs locations={[
                        {
                            route: 'products',
                            title: 'Products',
                        }
                    ]} />
                </div>

                {/* Filters and Products Grid */}
                <div className="d-grid mx-5 gap-6 body">

                    {/* Filters Sidebar */}
                    <div className="col-lg-12 col-md-6 col-lg-4 mt-3">
                        <div className="font-semibold text-lg mb-4">Filter</div>
                        {/* Add your filters here */}
                    </div>

                    {/* Products Section */}
                    <div className="col-lg-12 col-lg-8 mt-3">
                        {/* Sort Control */}
                        <div className="d-flex mb-5 me-4 justify-content-end">
                            <SelectComp/>
                        </div>

                        {/* Products Grid */}
                        <div className="d-grid gap-4 px-3 products-view justify-content-center">
                            {/*<Grid container spacing={6} justifyContent="center" alignItems="center" sx={{*/}
                            {/*    display: 'flex',*/}
                            {/*    flexWrap: 'wrap',*/}
                            {/*    margin: '0 auto'*/}
                            {/*}}>*/}
                                {products.map((product, index) => (
                                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
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
                                                    handleAddToCart={product.id}
                                                    addedItems={product.id}
                                                />
                                            </Tilt>
                                        </motion.div>
                                    </Grid>
                                ))}
                            {/*</Grid>*/}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Products;