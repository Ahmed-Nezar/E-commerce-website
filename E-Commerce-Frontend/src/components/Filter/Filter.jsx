
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Filter({ fromPrice, toPrice, setFromPrice, setToPrice, cn }) {
    return (
        <>
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
                            <FormControlLabel control={<Checkbox  />} label="In Stock" />
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
                            <FormControlLabel control={<Checkbox checked={cn.toLowerCase() === "gpus"} />} label="GPUs" />
                            <FormControlLabel control={<Checkbox checked={cn.toLowerCase() === "cpus"} />} label="CPUs" />
                            <FormControlLabel control={<Checkbox checked={cn.toLowerCase() === "ram"} />} label="RAM" />
                            <FormControlLabel control={<Checkbox checked={cn.toLowerCase() === "storage"} />} label="Storage" />
                            <FormControlLabel control={<Checkbox checked={cn.toLowerCase() === "psus"} />} label="PSUs" />
                            <FormControlLabel control={<Checkbox checked={cn.toLowerCase() === "networking"} />} label="Networking" />
                            <FormControlLabel control={<Checkbox checked={cn.toLowerCase() === "cases"} />} label="Cases" />
                            <FormControlLabel control={<Checkbox checked={cn.toLowerCase() === "keyboards"} />} label="Keyboards" />
                            <FormControlLabel control={<Checkbox checked={cn.toLowerCase() === "mice"} />} label="Mice" />
                            <FormControlLabel control={<Checkbox checked={cn.toLowerCase() === "headsets"} />} label="Headsets" />
                            <FormControlLabel control={<Checkbox checked={cn.toLowerCase() === "monitors"} />} label="Monitors" />
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
                            <FormControlLabel control={<Checkbox  />} label="Intel" />
                            <FormControlLabel  control={<Checkbox />} label="AMD" />
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
            </div>
        </>
    );
}
