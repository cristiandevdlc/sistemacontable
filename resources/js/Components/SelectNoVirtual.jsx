import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import '../../sass/Select/_virtualizedSelect.scss'

const SelectNoVirtual = ({ label, options, value, onChangeFunc, data, valueKey, className, disabled, fistrOption, firstLabel, isFocused = false, virtual = false, filter = false, filterBy, secondKey }) => {
    const [selectedValue, setSelectedValue] = useState(value);
    const [labelElevated, setLabelElevated] = useState(false);
    const handleChange = (event) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
        onChangeFunc(newValue, options.find(f => f[valueKey] == newValue) ?? {});
        // console.log(newValue, );
        // onChangeFunc(newValue, options[]);
    };
    useEffect(() => {
        handleFocus()
        setSelectedValue(value);
    }, [value])
    const handleFocus = () => {
        setLabelElevated(value ? true : false);
    };
    const handleBlur = () => {
        if (!selectedValue) {
            setLabelElevated(false);
        }
    };
    const ITEM_HEIGHT = 50;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 50
            }
        }
    };

    const optionTemplate = (option) => {
        let newLabel = '';
        if (option) {
            if (Array.isArray(data)) {
                data.forEach(value => {
                    if (option[value]) {
                        newLabel += `${option[value]}`
                    }
                })
            } else {
                newLabel = option[data]
            }
        }
        return (newLabel)
    }
    return (
        < FormControl
            sx={{
                width: "100%",
                background: "transparent",
                marginTop: "2vh",
                borderColor: "black",
                color: "#4d4d4d",
                fontSize: "14px",
                "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: "white",
                    "& .MuiOutlinedInput-notchedOutline": (disabled) ? {
                        borderColor: "#ccc",
                        borderWidth: '2px',
                        borderStyle: "dashed"
                    } : null,
                }
            }}
        >
            <InputLabel
                sx={{
                    color: "#a3a3a3",
                    fontSize: "14px",
                    fontWeight: "bold",
                    fontFamily: "monserrat",
                    left: "20px",
                    padding: "1px 10px",
                    backgroundColor: "white",
                    transform: labelElevated ? 'none' : 'translate(-10px, 25px) ',
                    top: "-15px",
                    transition: "transform 0.2s, font-size 0.2s"
                }}
                htmlFor="select-component"
            >
                {label}
            </InputLabel>
            <Select
                className={className}
                id="select-component"
                sx={{
                    background: "none",
                    borderColor: "white",
                    color: "#4d4d4d",
                    fontSize: "14px",
                    fontFamily: "monserrat",
                    fontWeight: "bold",
                    transform: "",
                    textAlign: "start",
                    height: '45px',
                    marginTop: 'unset',
                }}
                inputProps={{ readOnly: disabled }}
                MenuProps={MenuProps}
                value={selectedValue}
                onChange={handleChange}
                // onChange={(e) => /* handleChange(e.target.value, ) */ console.log(option[selectedValue])}
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                {firstLabel &&
                    <MenuItem
                        value={""}
                        sx={{
                            color: "#4d4d4d",
                            fontSize: "0.9em",
                            fontFamily: "monserrat",
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        {firstLabel}
                    </MenuItem>
                }
                {options &&
                    options.map((option, index) => (
                        <MenuItem
                            key={index}
                            value={option[valueKey]}
                            selected={option[selectedValue]}
                            sx={{
                                color: "#4d4d4d",
                                fontSize: "0.9em",
                                fontFamily: "monserrat",
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            {option[data]}
                        </MenuItem>
                    ))}
            </Select>
        </FormControl >
    )
};
export default SelectNoVirtual;