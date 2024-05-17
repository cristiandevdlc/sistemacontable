import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import { FormControl, InputLabel } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import { VariableSizeList } from 'react-window';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useRef } from 'react';
import SelectNoVirtual from './SelectNoVirtual';
import { forwardRef } from 'react';

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty('group')) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Typography key={dataSet.key} component="li" {...dataSet[0]} noWrap style={inlineStyle}>
      {`${dataSet[1][dataSet[2]]}`}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (child.hasOwnProperty('group')) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

// ListboxComponent.propTypes = {
//   children: PropTypes.node,
// };

const SelectComp = forwardRef(({ label, options, value, onChangeFunc, data, valueKey, disabled, firstLabel, small = false, virtual = true }, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const [labelElevated, setLabelElevated] = useState(false);
  const [allOptionArray, setAllOptionArray] = useState([])
  const [labelColor, setLabelColor] = useState(false)
  const [defVal, setDefVal] = useState(false)
  const inputRef = useRef()
  const allOption = {}

  const validateValue = () => {
    if (Array.isArray(options)) {
      const found = options.find((v) => { return v[valueKey] == value })
      setDefVal(found ? true : false)
    }
  }

  const handleChange = (newValue, objectValue) => {
    setSelectedValue(newValue);
    onChangeFunc(newValue, objectValue);
  };

  const handleFocus = (a) => {
    setLabelColor(true)
    setLabelElevated(a);
  };

  const handleBlur = () => {
    if (!selectedValue) {
      setLabelElevated(false);
    }
  };

  const getOptions = () => {
    for (const propiedad in options[0]) {
      if (options[0].hasOwnProperty(propiedad)) {
        allOption[propiedad] = propiedad === data ? firstLabel : (propiedad === valueKey) ? 0 : '0';
      }
    }
    const alloptions = [
      allOption,
      ...options
    ]
    // console.log(alloptions)
    return alloptions
  }

  useEffect(() => {
  }, [value]);

  useEffect(() => {
    setSelectedValue(value);
    if (Array.isArray(options)) {
      if (firstLabel && options.length > 0) {
        setAllOptionArray(getOptions)
      } else {
        setAllOptionArray(options)
      }
    }
  }, [options]);

  useEffect(() => {
    setSelectedValue(value);
    validateValue();
    if (!selectedValue || !value)
      setLabelElevated(false);

    handleFocus(value ? true : false)


    // const a = {
    //   label: label,
    //   value: JSON.stringify(defVal ? ((selectedValue && allOptionArray) ? [...allOptionArray].find((reg) => reg[valueKey] == selectedValue) : null) : null),
    //   selectedValue: selectedValue,
    //   labelElevated: labelElevated,
    //   elevated: !selectedValue
    // }
    // console.table(a);
  }, [value])


  useEffect(() => {
    if (virtual) {
      const input = inputRef.current.querySelector('.MuiInputBase-input')
      // const valAutoComp = `${label + data + disabled + small}`
      input.setAttribute('autocomplete', 'off')
      input.setAttribute('aria-autocomplete', 'off')
    }
  }, [label, data, disabled, small]);

  return (<>
    <div className='w-full' ref={inputRef}>
      {
        virtual ? (<>
          < FormControl
            sx={{
              width: "100%",
              background: "transparent",
              marginTop: "2vh",
              borderColor: "black",
              color: "#4d4d4d",
              fontSize: "12px",
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
                fontSize: small ? "11px" : "12px",
                fontWeight: "bold",
                fontFamily: "monserrat",
                left: small ? '12px' : "20px",
                padding: "0px 8px",
                backgroundColor: "white",
                transform: labelElevated ? 'none' : 'translate(-1px, 22px) ',
                top: small ? "-6px" : "-8px",
                transition: "transform 0.2s, font-size 0.2s"
              }}
              htmlFor="select-component"
            >
              {label}
            </InputLabel>
            <Autocomplete
              // id="virtualize-demo"
              sx={{
                width: '100%',
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  background: "white",
                  fontSize: "14px",

                  height: '45px',
                  fontFamily: "monserrat",

                  "& .MuiOutlinedInput-notchedOutline": (disabled) ? {
                    borderColor: "#ccc",
                    borderWidth: '2px',
                    borderStyle: "dashed",
                    fontFamily: "monserrat",

                  } : null,
                },
                "& .MuiFormLabel-root": {
                  marginLeft: '15px',
                },
                "& .MuiInputBase-input": {
                  height: '10px',
                  ":focus": {
                    // borderColor: '#FFFFF !important'
                  }
                },
                background: "none",
                borderColor: "white",
                color: "#4d4d4d",
                fontSize: "14px",
                fontFamily: "monserrat",
                fontWeight: "bold",
                transform: "",
                textAlign: "start",
                marginTop: 'unset',

                // MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused css-nxo287-MuiInputBase-input-MuiOutlinedInput-input
              }}
              ref={ref}
              className='selectAutocomplete'
              disableListWrap
              ListboxComponent={ListboxComponent}
              options={allOptionArray || []}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
              // defaultValue={defVal ? ((selectedValue && allOptionArray) ? [...allOptionArray].find((reg) => reg[valueKey] == selectedValue) : null) : null}
              value={defVal ? ((selectedValue && allOptionArray) ? [...allOptionArray].find((reg) => reg[valueKey] == selectedValue) : null) : null}
              getOptionLabel={(newReg) => String(newReg[data])}
              renderInput={(params) => <TextField {...params} />}
              renderOption={(props, option, state) => [props, option, data]}
              onChange={(event, newValue) => handleChange(newValue ? newValue[valueKey] : null, newValue)}

            />

          </FormControl >
        </>) : (<>
          <SelectNoVirtual
            label={label}
            options={options}
            value={value}
            onChangeFunc={onChangeFunc}
            data={data}
            valueKey={valueKey}
            disabled={disabled}
            firstLabel={firstLabel}
          // virtual={true}

          />
        </>)
      }
    </div>
  </>
  );
})
export default SelectComp;