import {useState} from "react";
import CustomBreadcrumbs from "../CustomBreadcrumbs/CustomBreadcrumbs.jsx";
import ProductCard from "../ProductCard/ProductCard.jsx";
import SelectComp from "../SelectComp/SelectComp.jsx";
import SliderComp from "../SliderComp/SliderComp.jsx";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from "@mui/material/Typography";
import {Checkbox, FormControlLabel, Grid, FormGroup, Pagination} from "@mui/material";
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import "../Products/Products.css";
import * as React from "react";
import { useParams } from "react-router-dom";

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

const catImgs = {
    "gpus": "/images/products/RTX_4090.jpg",
    "cpus": "/images/products/Intel-Core-i9.jpg",
    "ram": "/images/products/adata-SD-8.0-Express-UE720.jpg", // closest match since no dedicated RAM image
    "storage": "/images/products/adata-SD-8.0-Express-UE720.jpg",
    "psus": "/images/products/Dark_Power_Pro_13_1600W.jpg",
    "networking": "/images/products/O11VP_000a.png", // No exact networking image, picked general one
    "cases": "/images/products/O11VP_000a.png",
    "keyboards": "/images/products/Keychron_Q5_HE.png",
    "mice": "/images/products/Razer_Basilisk_V3.jpg",
    "headsets": "/images/products/Razer_Kraken_V4.jpg",
    "monitors": "/images/products/Samsung-Odyssey-OLED-G8.jpg",
};


const Products = () => {

    const [products,setProducts] = useState([
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

    const [sortVal, setSortVal] = useState('')

    const { cn } = useParams();

    const sortedProducts = React.useMemo(() => {
        const sorted = [...products];

        switch (sortVal) {
            case 'lowToHigh':
                return sorted.sort((a, b) => a.price - b.price);
            case 'highToLow':
                return sorted.sort((a, b) => b.price - a.price);
            case 'nameAsc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'nameDesc':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case 'ratingHigh':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'ratingLow':
                return sorted.sort((a, b) => a.rating - b.rating);
            default:
                return sorted;
        }
    }, [sortVal, products]);

    const [priceRange, setPriceRange] = useState([0, 999999]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState([]);

    return (
        <>
            <div className="w-full">
                {/* Top Banner Image */}
                <div className="d-grid align-content-center headerBG" style={{backgroundImage: `linear-gradient(to bottom, rgb(0 0 0 / 80%), rgb(1 63 181 / 80%)), `+
                `url(${catImgs[cn.toLowerCase()]})`}}>
                    <h1 className="text-white">{cn[0].toUpperCase()+cn.slice(1)}</h1>
                </div>


                {/* Breadcrumbs */}
                <div className="p-4 mx-lg-4">
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
                    <div className="col-lg-12 col-lg-4 mt-4 d-flex flex-column">
                        <h1>Filter</h1>
                        <div className="m-4">
                            <Accordion sx={{margin: '1px 0 !important'}}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    id="panel1-header"
                                >
                                    <Typography component="span">Price</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <SliderComp min={0} max={999999} rangeText="EGP" sx={ "width: 65%" }/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{margin: '1px 0 !important'}}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    id="panel2-header"
                                >
                                    <Typography component="span">Stock</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox  />} label="In Stock" />
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{margin: '1px 0 !important'}}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    id="panel2-header"
                                >
                                    <Typography component="span">Brand</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox  />} label="Intel" />
                                        <FormControlLabel  control={<Checkbox />} label="AMD" />
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="col-lg-12 col-lg-8 mt-4">
                        {/* Sort Control */}
                        <div className="d-flex mb-5 me-4 justify-content-end">
                            <SelectComp sortVal={sortVal} setSortVal={setSortVal}/>
                        </div>

                        {/* Products Grid */}
                        <div className="d-grid gap-4 m-3 products-view justify-content-center">
                                {sortedProducts.map((product, index) => (
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
                                                <ProductCard className="product-card"
                                                    product={product}
                                                    handleAddToCart={product.id}
                                                    addedItems={product.id}
                                                />
                                            </Tilt>
                                        </motion.div>
                                    </Grid>
                                ))}
                        </div>
                        <Pagination count={10} showFirstButton showLastButton sx={{display: 'flex', justifyContent: 'center', margin: '2rem auto'}}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Products;