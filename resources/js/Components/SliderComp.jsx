import { primaryColor, secondaryColor } from "@/utils";
import InputLabel from "./InputLabel";
import { FormControl, Slider } from "@mui/material";

export default function SliderComp({ label, ...props }) {
    return (
        <>
            < FormControl
                sx={{
                    width: "100%",
                    background: "transparent",
                    borderColor: "black",
                    color: "#4d4d4d",
                }}
            >
                <InputLabel
                    sx={{
                        color: "#a3a3a3",
                        fontWeight: "bold",
                        fontFamily: "monserrat",
                        left: "20px",
                        backgroundColor: "white",
                    }}
                    htmlFor="select-component"
                >
                    {label} - {props.value ?? 0}
                </InputLabel>


                <Slider
                    step={props.steps}
                    valueLabelDisplay="auto"
                    onChange={(e) => props.onChangeFunc(e.target.value)}
                    value={props.value}
                    // color={primaryColor}
                    sx={{
                        color: secondaryColor,
                        height: 8,
                        '& .MuiSlider-track': {
                            border: 'none',
                        },
                        '& .MuiSlider-thumb': {
                            height: 24,
                            width: 24,
                            backgroundColor: '#fff',
                            border: '2px solid currentColor',
                            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                                boxShadow: 'inherit',
                            },
                            '&::before': {
                                display: 'none',
                            },
                        },
                        '& .MuiSlider-valueLabel': {
                            lineHeight: 1.2,
                            fontSize: 10,
                            background: 'unset',
                            padding: 0,
                            width: 25,
                            height: 25,
                            borderRadius: '50% 50% 50% 0',
                            backgroundColor: secondaryColor,
                            transformOrigin: 'bottom left',
                            transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
                            '&::before': { display: 'none' },
                            '&.MuiSlider-valueLabelOpen': {
                                transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
                            },
                            '& > *': {
                                transform: 'rotate(45deg)',
                            },
                        },
                    }}
                />
            </FormControl >
        </>
    )
}