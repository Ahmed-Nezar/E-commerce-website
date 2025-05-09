// noinspection JSIgnoredPromiseFromCall

import {useEffect, useState} from "react";
import CustomBreadcrumbs from "../CustomBreadcrumbs/CustomBreadcrumbs.jsx";
import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import SelectComp from "../SelectComp/SelectComp.jsx";
import {Button, Pagination} from "@mui/material";
import "../Products/Products.css";
import * as React from "react";
import { useParams } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import Drawer from "../Drawer/Drawer.jsx";
import Filter from "../Filter/Filter.jsx";
import {ENV} from "../../App.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import {useSearch} from "../../context/SearchContext.jsx";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const catImgs = {
    "gpus": "/images/products/RTX_4090.jpg",
    "cpus": "/images/products/Intel-Core-i9.jpg",
    "rams": "/images/products/adata-SD-8.0-Express-UE720.jpg",
    "storages": "/images/products/adata-SD-8.0-Express-UE720.jpg",
    "psus": "/images/products/Dark_Power_Pro_13_1600W.jpg",
    "cases": "/images/products/O11VP_000a.png",
    "keyboards": "/images/products/Keychron_Q5_HE.png",
    "mice": "/images/products/Razer_Basilisk_V3.jpg",
    "headsets": "/images/products/Razer_Kraken_V4.jpg",
    "monitors": "/images/products/Samsung-Odyssey-OLED-G8.jpg",
};

const fetchData = async (
    cn, setBrands, selectedCategories, setCategories, showMessage,
    sortVal, inStockOnly, selectedBrands, fromPrice, toPrice,
    setProducts, setCurrentPage, setTotalPages, currentPage, setIsLoading) => {
    try {
        setIsLoading(true);
        scroll(0,0)
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
        query.append("limit", "12");
        query.append("page", currentPage.toString());

        const productRes = await fetch(`${ENV.VITE_BACKEND_URL}/api/products?${query.toString()}`)
            .then(res => res.json());
        setProducts(productRes.data);
        // setCurrentPage(productRes.data.length > 0? currentPage : 1);
        setTotalPages(productRes.totalPages);
    } catch (error) {
        console.error("Failed to fetch data:", error);
        showMessage("Failed to fetch data", true)

    } finally {
        setIsLoading(false);
    }
};

const searchData = async (keyword, setProducts, currentPage=1, setCurrentPage, setTotalPages, showMessage) => {
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
        showMessage("Failed to fetch data", true);
    }
}

const Products = () => {
    const { addToCart, showMessage } = useCart();
    const [addedItems, setAddedItems] = useState({});
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const { cn } = useParams();

    const [sortVal, setSortVal] = useState('')

    const [fromPrice, setFromPrice] = useState(0);
    const [toPrice, setToPrice] = useState(999999);

    const [inStockOnly, setInStockOnly] = useState(true);

    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(cn? [cn] : []);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isLoading, setIsLoading] = useState(false);

    const { searchInput } = useSearch();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("keyword");

    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedItems(prev => ({ ...prev, [product._id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [product._id]: false }));
        }, 2000);
    };

    useEffect(() => {
        fetchData( cn, setBrands, selectedCategories, setCategories, showMessage,
                   sortVal, inStockOnly, selectedBrands, fromPrice, toPrice,
                   setProducts, setCurrentPage, setTotalPages, currentPage, setIsLoading);
    }, [selectedCategories, sortVal, inStockOnly, selectedBrands, fromPrice, toPrice, currentPage]);

    useEffect(() => {
        if (!searchInput) {
            fetchData( cn, setBrands, selectedCategories, setCategories, showMessage,
                sortVal, inStockOnly, selectedBrands, fromPrice, toPrice,
                setProducts, setCurrentPage, setTotalPages, currentPage, setIsLoading);
        }
        navigate(`?keyword=${searchInput}`);
    }, [searchInput]);

    useEffect(() => {
        if (!cn) {
            setSelectedCategories([])
        }
    }, [cn])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const { latitude, longitude } = coords;
                // Call a reverse-geocoding service (e.g. Google Maps, OpenStreetMap)
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );
                const data = await res.json();
                console.log('You are in:', data.address.city || data.address.town);
            },
            err => console.error('Geo error:', err),
            { enableHighAccuracy: true, timeout: 5000 }
        );
    }, [])

    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [sortVal, selectedCategories, inStockOnly, selectedBrands, fromPrice, toPrice]);

    useEffect(() => {
        searchData(keyword, setProducts, currentPage ,setCurrentPage, setTotalPages, showMessage);
    },[location.search]);

    return (
        <>
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
                            route: `products/${cn}?keyword=`,
                            title: cn,
                        }] : []),
                    ]} />
                </div>

                {/* Filters and Products Grid */}
                <div className="d-grid mx-5 gap-6 body">
                    {/* Filters Sidebar */}
                    <Drawer triggerButton={
                            <Button variant="contained"  className="col-lg-12 col-lg-8 mt-4">
                                <FilterAltIcon />
                                Filter
                            </Button>
                        }
                        anchor={"left"}
                        breakpoint={705}
                        defaultView={true}
                    >
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
                        <div className="d-flex mb-5 mx-4 justify-content-end sort align-items-center">
                            <SelectComp sortVal={sortVal} setSortVal={setSortVal}/>
                            {sortVal && (
                            <button
                                onClick={() => setSortVal('')}
                                className={"text-danger fs-3 px-2 py-0 h-75"}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                }}
                                title="Clear sort"
                            >
                                ×
                            </button>
                        )}
                        </div>

                        {/* Products Grid */}
                        <ProductsGrid isLoading={isLoading} products={products} handleAddToCart={handleAddToCart} addedItems={addedItems}/>

                        <Pagination count={totalPages}
                                    page={currentPage}
                                    onChange={(event, value) => {
                                        setCurrentPage(value);
                                    }}
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