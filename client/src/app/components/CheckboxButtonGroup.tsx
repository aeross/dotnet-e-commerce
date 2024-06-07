import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { useState } from 'react';

interface Props {
    items: string[];
    checked?: string[];
    onChange: (items: string[]) => void
}

function CheckboxButtonGroup({ items, checked, onChange }: Props) {
    const [checkedItems, setCheckedItems] = useState(checked || []);

    function handleChecked(value: string) {
        let newCheckedItems = [];

        if (checkedItems.findIndex(item => item === value) === -1) {
            // clicking a non-checked item: check the item (add it to the checkedItems array)
            newCheckedItems = [...checkedItems, value];
        } else {
            // clicking a checked item: uncheck the item (remove it from the checkedItems array)
            newCheckedItems = checkedItems.filter(item => item !== value);
        }
        setCheckedItems(newCheckedItems);
        onChange(newCheckedItems);
    }

    return (
        <FormGroup>
            {items.map((item, i) => (
                <FormControlLabel control={<Checkbox
                    checked={checkedItems.indexOf(item) !== -1}
                    onClick={() => handleChecked(item)}
                />} label={item} key={i} />
            ))}
        </FormGroup>
    )
}

export default CheckboxButtonGroup