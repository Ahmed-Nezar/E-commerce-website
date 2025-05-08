
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./Filter.css"



export default function Filter({   fromPrice, toPrice, setFromPrice, setToPrice, inStockOnly,
                                   setInStockOnly, categories, selectedCategories, setSelectedBrands,
                                   setSelectedCategories, brands, selectedBrands, cn}) {
    const isFilterCleared = () => {
        const noPriceFilter = fromPrice === 0 && toPrice === 999999;
        const noBrandFilter = selectedBrands.length === 0;
        const isDefaultCategory = cn
            ? selectedCategories.length === 1 && selectedCategories[0] === cn
            : selectedCategories.length === 0;

        return noPriceFilter && noBrandFilter && isDefaultCategory;
    };

    return (
        <>
            <h1>Filter</h1>
            <button
                onClick={() => {
                    if(cn){
                        setFromPrice(0);
                        setToPrice(999999);
                        setInStockOnly(inStockOnly);
                        setSelectedCategories([cn]);
                        setSelectedBrands([]);
                    } else {
                        setFromPrice(0);
                        setToPrice(999999);
                        setInStockOnly(inStockOnly);
                        setSelectedCategories([]);
                        setSelectedBrands([]);
                    }
                }}
                disabled={isFilterCleared()}
                style={{
                    margin: '0.5rem 2rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#d80000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '-webkit-fill-available'
                }}
                className="clearBtn"
            >
                Clear All Filters
            </button>

            <div className="m-4">
                <Accordion sx={{margin: '1px 0 !important'}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        id="panel1-header"
                    >
                        <Typography component="span">Price</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="d-flex flex-wrap justify-content-between gap-3">
                            <div style={{ flex: '1 1 80px', maxWidth: '140px' }}>
                                <TextField
                                    label="From"
                                    variant="filled"
                                    fullWidth
                                    value={fromPrice}
                                    onChange={(e) => setFromPrice(Number(e.target.value))}
                                />
                            </div>
                            <div style={{ flex: '1 1 80px', maxWidth: '140px' }}>
                                <TextField
                                    label="To"
                                    variant="filled"
                                    fullWidth
                                    value={toPrice}
                                    onChange={(e) => setToPrice(Number(e.target.value))}
                                />
                            </div>
                        </div>
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
                            <FormControlLabel control={<Checkbox checked={
                                inStockOnly
                            }
                            onChange={() => setInStockOnly(prev => !prev)}
                            />} label="In Stock" />
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{margin: '1px 0 !important'}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        id="panel3-header"
                    >
                        <Typography component="span">Categories</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup>
                            {categories.map((category) => (
                                <FormControlLabel control={<Checkbox
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => setSelectedCategories(prev => {
                                        // Check if cn is removed
                                        if (cn && cn === category) {
                                            return prev;
                                        }
                                        if (prev.includes(category)) {
                                            return prev.filter((item) => item !== category);
                                        } else {
                                            return [...prev, category]
                                        }
                                    })}/>
                                } key={category} label={category}/>
                            ))}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{margin: '1px 0 !important'}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        id="panel4-header"
                    >
                        <Typography component="span">Brand</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup>
                            {brands.map((brand) => (
                                <FormControlLabel control={<Checkbox
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => setSelectedBrands(prev => {
                                        if (prev.includes(brand)) {
                                            return prev.filter((item) => item !== brand);
                                        } else {
                                            return [...prev, brand]
                                        }
                                    })}/>} key={brand} label={brand}/>
                            ))}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
            </div>
        </>
    );
}
