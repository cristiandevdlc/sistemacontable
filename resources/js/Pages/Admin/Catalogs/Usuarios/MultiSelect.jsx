import { useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200,
        },
    },
};

export default function MultiSelect(props) {
    const [rolesName, setRolesName] = useState([]);
    const [roles, setRoles] = useState([]);
    const [labelElevated, setLabelElevated] = useState(false);

    const handleFocus = () => {
        setLabelElevated(true);
    };

    const handleBlur = () => {
        if (!selectedValue) {
            setLabelElevated(false);
        }
    };
    
    const fetchRoles = async () => {
        const rolesResponse = await fetch(route("rolesxmenu.index"));
        const dataRoles = await rolesResponse.json();
        setRoles(dataRoles);
    }

    const fillCheckBoxes = (rol) => {
        props.parentHandleChecker(null, rol, 5);
        // menus.forEach(menu => {
        // });
    }
    
    const handleChange = (event) => {
        const { target: { value } } = event;
        setRolesName(typeof value === "string" ? value.split(",") : value);
    };

    useEffect(() => {
        if (rolesName.length > 0) {
            setLabelElevated(true)
        }
        // console.log('rolesName', rolesName)
    }, [rolesName]);
    
    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <div>
            <FormControl
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
                    }
                }}>

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
                        top: "-10px",
                        transition: "transform 0.2s, font-size 0.2s"
                    }}
                    htmlFor="select-component"
                > Roles</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    sx={{
                        background: "none",
                        borderColor: "white",
                        color: "#4d4d4d",
                        fontSize: "14px",
                        fontFamily: "monserrat",
                        fontWeight: "bold",
                        transform: "",
                        textAlign: "start",
                        marginTop: 'unset',
                    }}
                    value={rolesName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Roles" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                >
                    {roles.map((rol, key) => (
                        <MenuItem key={key} value={rol.roles_descripcion} onClick={() => fillCheckBoxes(rol)} >
                            <Checkbox checked={rolesName.indexOf(rol.roles_descripcion) > -1} />
                            <ListItemText primary={rol.roles_descripcion} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
