// noinspection JSIgnoredPromiseFromCall

import {useEffect, useState} from "react";
import CustomBreadcrumbs from "../CustomBreadcrumbs/CustomBreadcrumbs.jsx";
import ProductCard from "../ProductCard/ProductCard.jsx";
import SelectComp from "../SelectComp/SelectComp.jsx";
import { Grid,  Pagination} from "@mui/material";
import Tilt from 'react-parallax-tilt';
import {motion} from 'framer-motion';
import "../Products/Products.css";
import * as React from "react";
import { useParams } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import Drawer from "../Drawer/Drawer.jsx";
import Filter from "../Filter/Filter.jsx";
import {ENV} from "../../App.jsx";
import NoResultsPlaceholder from "../NoResultsPlaceholder/NoResultsPlaceholder.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";

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
    "rams": "/images/products/adata-SD-8.0-Express-UE720.jpg", // closest match since no dedicated RAM image
    "storages": "/images/products/adata-SD-8.0-Express-UE720.jpg",
    "psus": "/images/products/Dark_Power_Pro_13_1600W.jpg",
    "cases": "/images/products/O11VP_000a.png",
    "keyboards": "/images/products/Keychron_Q5_HE.png",
    "mice": "/images/products/Razer_Basilisk_V3.jpg",
    "headsets": "/images/products/Razer_Kraken_V4.jpg",
    "monitors": "/images/products/Samsung-Odyssey-OLED-G8.jpg",
};

const fetchData = async (
    cn, setBrands, selectedCategories, setCategories,
    sortVal, inStockOnly, selectedBrands, fromPrice, toPrice,
    setProducts, setCurrentPage, setTotalPages, currentPage, setIsLoading) => {
    try {
        setIsLoading(true);
        const category = cn ? cn : selectedCategories;

        let brandQuery = new URLSearchParams();
        if (category) brandQuery.append("category", selectedCategories.join("|"));
        // Fetch Brands
        const brandRes = await fetch(`${ENV.VITE_BACKEND_URL}/api/products/getBrands?${brandQuery.toString()}`).then(res => res.json());

        if(!brandRes.error) {
            setBrands(brandRes.data);
        } else {
            return
        }

        // Fetch Categories
        const categoryRes = await fetch(`${ENV.VITE_BACKEND_URL}/api/products/getCategories`)
            .then(res => res.json())
        if(!categoryRes.error) {
            setCategories(categoryRes.data);
        }else {
            return
        }

        // Fetch Products with filters
        const query = new URLSearchParams();
        if (category) query.append("category", selectedCategories.join("|"));
        if (sortVal) query.append("sortQuery", sortVal);
        if (inStockOnly) query.append("stock", inStockOnly.toString());
        if (selectedBrands.length > 0) query.append("brand", selectedBrands.join("|"));
        if (fromPrice) query.append("minPrice", fromPrice.toString());
        if (toPrice) query.append("maxPrice", toPrice.toString());
        query.append("limit", "10");
        query.append("page", currentPage.toString());

        const productRes = await fetch(`${ENV.VITE_BACKEND_URL}/api/products?${query.toString()}`)
            .then(res => res.json());
        setProducts(productRes.data);
        // setCurrentPage(productRes.data.length > 0? currentPage : 1);
        setTotalPages(productRes.totalPages);
    } catch (error) {
        console.error("Failed to fetch data:", error);
    } finally {
        setIsLoading(false);
    }
};

const searchData = async (keyword, setProducts, currentPage=1, setCurrentPage, setTotalPages) => {
    try {
        const query = new URLSearchParams();
        if (keyword) query.append("keyword", keyword);
        query.append("page", currentPage.toString());

        const productRes = await fetch(`${ENV.VITE_BACKEND_URL}/api/products?${query.toString()}`)
            .then(res => res.json());
        setProducts(productRes.data);
        setCurrentPage(1);
        setTotalPages(productRes.totalPages);
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

const Products = () => {
    const { addToCart } = useCart();
    const [addedItems, setAddedItems] = useState({});

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedItems(prev => ({ ...prev, [product._id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [product._id]: false }));
        }, 2000);
    };

    const [products,setProducts] = useState([
        // {
        //     _id: '1',
        //     name: 'Razer Basilisk V3',
        //     price: 69.99,
        //     image: '/images/products/Razer_Basilisk_V3.jpg',
        //     description: 'Pro Gaming Mouse',
        //     stock: 25,
        //     rating: 4.7
        // },
        // {
        //     _id: '2',
        //     name: 'RTX 5060 Ti',
        //     price: 499.99,
        //     image: '/images/products/RTX_5060_Ti.png',
        //     description: 'Mid-Range Gaming GPU',
        //     stock: 3,
        //     rating: 4.9
        // },
        // {
        //     _id: '3',
        //     name: 'Razer Kraken V4',
        //     price: 199.99,
        //     image: '/images/products/Razer_Kraken_V4.jpg',
        //     description: 'Wireless Gaming Headset',
        //     stock: 10,
        //     rating: 4.8
        // },
        // {
        //     _id: '4',
        //     name: 'Samsung Odyssey OLED G8',
        //     price: 1299.99,
        //     image: '/images/products/Samsung-Odyssey-OLED-G8.jpg',
        //     description: '34" Ultra-Wide Gaming Monitor',
        //     stock: 12,
        //     rating: 4.9
        // },
        // {
        //     _id: '5',
        //     name: 'Keychron Q5 HE',
        //     price: 199.99,
        //     image: '/images/products/Keychron_Q5_HE.png',
        //     description: 'Hot-swappable Mechanical Keyboard',
        //     stock: 15,
        //     rating: 4.6
        // },
        // {
        //     _id: '6',
        //     name: 'Lian Li O11 Vision',
        //     price: 219.99,
        //     image: '/images/products/O11VP_000a.png',
        //     description: 'Premium ATX PC Case',
        //     stock: 7,
        //     rating: 4.8
        // },
        // {
        //     _id: '7',
        //     name: 'NVIDIA Quantum X800',
        //     price: 1499.99,
        //     image: '/images/products/NVIDIA_Quantum-X800.jpg',
        //     description: 'Next-gen GPU Technology',
        //     stock: 5,
        //     rating: 4.8
        // },
        // {
        //     _id: '8',
        //     name: 'Dark Power Pro 13 1600W',
        //     price: 399.99,
        //     image: '/images/products/Dark_Power_Pro_13_1600W.jpg',
        //     description: 'Platinum Rated PSU',
        //     stock: 8,
        //     rating: 4.7
        // },
        // {
        //     _id: '9',
        //     name: 'ADATA SD 8.0 Express',
        //     price: 129.99,
        //     image: '/images/products/adata-SD-8.0-Express-UE720.jpg',
        //     description: 'High-Speed Storage Solution',
        //     stock: 20,
        //     rating: 4.5
        // }
    ]);

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const { cn } = useParams();

    const [sortVal, setSortVal] = useState('')

    const [fromPrice, setFromPrice] = useState(0);
    const [toPrice, setToPrice] = useState(999999);

    const [inStockOnly, setInStockOnly] = useState(true);

    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isLoading, setIsLoading] = useState(false);

    const [searchInput, setSearchInput] = useState("");

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("keyword");

    const navigate = useNavigate();

    useEffect(() => {
        fetchData( cn, setBrands, selectedCategories, setCategories,
                   sortVal, inStockOnly, selectedBrands, fromPrice, toPrice,
                   setProducts, setCurrentPage, setTotalPages, currentPage, setIsLoading);
    }, [selectedCategories, sortVal, inStockOnly, selectedBrands, fromPrice, toPrice, currentPage]);

    useEffect(() => {
        if (cn && !selectedCategories.includes(cn)) {
            setSelectedCategories([...selectedCategories, cn])
        }
        if (!cn) {
            setSelectedCategories([]);
        }
    }, [cn]);

    useEffect(() => {
        navigate(`?keyword=${searchInput}`);
    }, [searchInput]);

    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [sortVal, selectedCategories, inStockOnly, selectedBrands, fromPrice, toPrice]);

    useEffect(() => {
        searchData(keyword, setProducts, currentPage ,setCurrentPage, setTotalPages);
    },[location.search]);

    return (
        <>
            {/*<input type="text" value={searchInput} onInput={(e) => setSearchInput(e.target.value)}/>*/} {/* for testing */}
            <div className="w-full">
                {/* Top Banner Image */}
                <div className="d-grid align-content-center headerBG" style={{backgroundImage: `linear-gradient(to bottom, rgb(0 0 0 / 50%), rgb(1 63 181 / 60%)), `+
                `url(${catImgs[cn?.toLowerCase()]})`}}>
                    <h1 className="text-white" style={{fontSize: "inherit", textShadow: "3px 3px 10px black"}}>{keyword ? "Search" : cn ? `${cn}` : "All Products"}</h1>
                </div>


                {/* Breadcrumbs */}
                <div className="p-4 mx-lg-4">
                    <CustomBreadcrumbs locations={[
                        {
                            route: 'products',
                            title: 'Products',
                            onClick: () => {
                                setSelectedCategories([]);
                            },
                        },...(cn ? [{
                            route: `products/${cn}`,
                            title: cn,
                        }] : []),
                    ]} />
                </div>

                {/* Filters and Products Grid */}
                <div className="d-grid mx-5 gap-6 body">
                    {/* Filters Sidebar */}
                    <Drawer>
                        <Filter
                            fromPrice={fromPrice}
                            toPrice={toPrice}
                            setFromPrice={setFromPrice}
                            setToPrice={setToPrice}
                            inStockOnly={inStockOnly}
                            setInStockOnly={setInStockOnly}
                            categories={categories}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            brands={brands} cn={cn}
                            selectedBrands={selectedBrands}
                            setSelectedBrands={setSelectedBrands}
                        />
                    </Drawer>

                    {/* Products Section */}
                    <div className="col-lg-12 col-lg-8 mt-4">
                        {/* Sort Control */}
                        <div className="d-flex mb-5 mx-4 justify-content-end sort">
                            <SelectComp sortVal={sortVal} setSortVal={setSortVal}/>
                        </div>

                        {/* Products Grid */}
                        <div className="d-grid gap-4 m-3 products-view justify-content-center">
                            {isLoading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '2rem', minHeight: "500px",
                                    alignItems: "center" }}>
                                    <CircularProgress />
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
                                                        handleAddToCart={handleAddToCart}
                                                        addedItems={addedItems}
                                                    />
                                                </Tilt>
                                            </motion.div>
                                        </div>
                                    </Grid>
                                ))
                            )}

                        </div>
                        <Pagination count={totalPages}
                                    page={currentPage}
                                    onChange={(event, value) => setCurrentPage(value)}
                                    showFirstButton
                                    showLastButton
                                    sx={{display: 'flex', justifyContent: 'center', margin: '2rem auto'}}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Products;