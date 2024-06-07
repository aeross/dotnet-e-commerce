import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material"
import { ProductSortOptions } from "../models/product";

interface Props {
    options: ProductSortOptions[];
    onChange: (event: any) => void;
    selectedValue: string;
}

function RadioButtonGroup({ options, onChange, selectedValue }: Props) {
    return (
        <FormControl>
            <FormLabel>Sort by</FormLabel>
            <RadioGroup onChange={onChange} value={selectedValue}>
                {options.map(({ value, label }, i) => (
                    <FormControlLabel value={value} control={<Radio />} label={label} key={i} />
                ))}
            </RadioGroup>
        </FormControl>
    )
}

export default RadioButtonGroup