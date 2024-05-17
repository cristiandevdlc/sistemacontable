import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import { useRef } from 'react';
import "../../sass/FormsComponent/_inputText.scss"
import { InputNumber } from 'primereact/inputnumber';

const inputTypes = {
    zipCode: 'zipCode',
    number: 'number',
    date: 'date',
    decimal: 'decimal',
    time: 'time',
    datetimeLocal: 'datetime-local',
    color: 'color',
    password: 'password',
}
const defaultFunction = () => { }
export default forwardRef(function TextInput({ prevent = false, type = 'text', customIcon = '', className = '', isFocused = false, disabledState = false, overwrite = false, onlyUppercase = true, allowAsci = true, ...props }, ref) {
    const [focused, setFocused] = useState(false);
    const input = ref ? ref : useRef();

    useEffect(() => {
        if ((props.value !== '' || (type == inputTypes.decimal || type == inputTypes.number))) {
            setFocused(true)
            return
        }
        setFocused(false)
    }, [props.value]);

    const handleInputFocus = (e) => {
        setFocused(true);
        if (overwrite)
            e.target.select()
    };

    const handleInputBlur = () => {
        if (props.value === '' && (type != inputTypes.decimal && type != inputTypes.number) && !isFocused) {
            setFocused(false);
        }
    };

    return (
        <>
            <div className={`containerInputComp ${(focused || type === 'date' || type === 'time' || type === 'datetime-local' || type === 'color') ? "focused" : ""}    `}>


                {(type !== inputTypes.decimal && type !== inputTypes.number) && <label className='labelComp' htmlFor="inputField">{props.label}</label>}
                {
                    (customIcon !== '' && focused) ? (
                        <span className='material-icons custom-input-icon'>{customIcon}</span>
                    ) : null
                }
                {(type !== inputTypes.decimal && type !== inputTypes.number) ?
                    <input
                        disabled={disabledState}
                        className={`${(customIcon === '') ? "inputComp" : 'inputCompIcon'}`}
                        {...props}
                        onChange={(e) => {
                            const copyE = { ...e };
                            const onlyUpper = onlyUppercase

                            if (onlyUpper && type != inputTypes.password)
                                copyE.target.value = String(copyE.target.value ?? '').toUpperCase()

                            if (type == inputTypes.zipCode)
                                return copyE.target.value.length < 6 && props.onChange(copyE)


                            if (!allowAsci)
                                copyE.target.value = `${copyE.target.value}`.replace(/[^a-zA-ZÑñ\s]/g, '');

                            return props.onChange(copyE)
                        }}
                        type={type}
                        onKeyDown={(e) => {
                            if (type === inputTypes.number) {
                                ["e", "E"].includes(e.key)
                            }
                            if (!prevent)
                                ["Enter"].includes(e.key) && e.preventDefault()
                        }}
                        value={props.value || ''}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        ref={input}
                    /> :
                    <InputNumber
                        disabled={disabledState}
                        value={(props.value !== 0 || props.value !== '') ? props.value : '0.00'}
                        // className={`${(customIcon === '') ? "inputComp" : 'inputCompIcon'}`}
                        {...props}
                        onChange={e => {
                            const val = e.value
                            if (props.value == 0) {
                                const nVal = parseFloat(`${val}`.replace('0', ''))
                                return props.onChange({ target: { value: nVal === null ? 0 : nVal } }) || defaultFunction
                            }
                            return props.onChange({ target: { value: val === null ? 0 : val } }) || defaultFunction
                        }}
                        maxFractionDigits={type == inputTypes.decimal ? 4 : 0}
                        // minFractionDigits={type === inputTypes.decimal ? 2 : 0}
                        onFocus={handleInputFocus}
                        // onBlur={handleInputBlur}
                        onBlur={handleInputBlur}
                        ref={input}
                        pt={{
                            root: {
                                style: {
                                    width: '100%'
                                }
                            },
                            input: {
                                root: {
                                    className: (customIcon !== '' && focused) ? 'inputtextIcon' : ''
                                }
                            }
                        }}
                        allowEmpty={false}
                    />
                }
                {(type === inputTypes.decimal || type === inputTypes.number) && <label className='labelComp' htmlFor="inputField">{props.label}</label>}

            </div>
        </>
    )
});
