import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, InputLabel, Step, StepLabel, Stepper } from "@mui/material";
import SelectComp from "./SelectComp";
import TextInput from "./TextInput";
import { useEffect } from "react";
import '../../sass/Dialog/_dialog.scss'
import Datatable from "./Datatable";
import SliderComp from "./SliderComp";

/**
 * 
 * @param {Object} dialogProps 
 * 
 * {
 *  width: 'lg, md, sm, xl' /// TAMANO MAXIMO DEL DIALOG
 *  fullWidth: boolean /// FUERZA EL DIALOGO A QUE SE MUESTRE CON EL TAMANO MAXIMO
 *  open: boolean /// EL ESTADO DE APERTURA DEL DIALOGO
 *  model: string, /// EL TITULO QUE QUIERES QUE TENGA
 *  style: string, /// LAS CLASES QUE LE PUEDES PASAR
 *  actionState: string, /// EL TIPO MODO DEL DIALOG ('create', 'edit')
 *  activeStep: number
 *  stepperHandler: function /// SE ENCARGA DE AVANZAR EN EL STEP
 *  openStateHandler: function /// SE ENCARGA DE ABRIR Y CERRAR EL STEP
 *  customTitle: boolean /// ES PARA DEFINIT UN TITULO DIFERENTE
 *  customAction: boolean /// ES PARA DEFINIT UN TITULO DIFERENTE
 * }
 * 
 * @param {Array} steps 
 *  {
 *      label: sting, /// El titulo que tendrá el step
 *      fields: fields 
 *      style: string 
 *  }
 * 
 * @param {Array} fields 
 * [{
 *  label: string, /// ES LA ETIQUETA FLOTANTE 
 *  input: boolean, /// SI SE MARCA COMO TRUE MUESTRA UN INPUT EN FUNCION DEL TYPE
 *  select: boolean, /// SI SE MARCA COMO TRUE MUESTRA UN INPUT SELECT
 *  check: boolean, /// SI SE MARCA COMO TRUE MUESTRA UN INPUT CHECK
 *  custom: boolean, /// SI SE MARCA COMO TRUE MUESTRA UN INPUT CHECK
 *  customItems: , /// SI SE MARCA COMO TRUE MUESTRA UN INPUT CHECK
 *  type: string, /// ES EL TIPO DE INPUT (text, date, number)
 *  className: string, ///SON LAS POSIBLES CLASES QUE LE PUEDES ANADIR
 *  value: any, ///ES EL VALOR NORMAL DEL INPUT
 *  options: array, /// SON LAS OPCIONES DENTRO DEL SELECT
 *  data: string, /// ESTE VALOR HACE REFERENCIA AL TEXTO QUE SE MUESTRA DENTO DEL SELECT (DE LA OTRA TABLA)
 *  fieldKey: string, /// ESTE VALOR HACE REFERENCIA AL CAMPO PROPIO DE LA TABLA 
 *  valueKey: string, /// ESTE VALOR HACE REFERENCIA A LA KEY FORANEA DEL INPUT SELECT
 *  onChangeFunc: function /// LA FUNCION QUE QUIERES QUE TENGA EL INPUT
 *  disabled: boolean /// LE DA ESTILO DE DESACTIVACION AL INPUT
 *  labelPlacement: string /// EN CASO DE QUE LA PROPIEDAD CHECK SEA TRUE ENTONCES PUEDES CONFIGURAR LA POSICION
 * } ]
 * @returns 
 */
export const dialogDefaultProps = {
    width: 'md',
    fullWidth: true,
    openState: false,
    fullScreen: false,
    openStateHandler: () => { return; },
    model: '',
    customTitle: false,
    actionState: 'create',
    style: 'grid grid-cols-1 gap-x-4',
    onSubmitState: () => { return; },
    customAction: null,
    _dialogPropsInfo: false,
    _dialogFieldsInfo: false
}


export default function DialogComp({ dialogProps = dialogDefaultProps, steps = [], fields = [], errors = {}, activeStep = 0, stepperHandler = () => { return } }) {

    useEffect(() => {
        stepperHandler(0)
    }, [dialogProps.openState]);

    return (
        <>
            {dialogProps._dialogPropsInfo && console.log("_dialogPropsInfo", { dialogProps, steps, fields, errors, activeStep, stepperHandler })}
            {dialogProps._dialogFieldsInfo && console.log("_dialogFieldsInfo", { dialogProps, steps, fields, errors, activeStep, stepperHandler })}
            <Dialog open={dialogProps.openState ?? false} maxWidth={dialogProps.fullScreen ? false : dialogProps.width} fullWidth={dialogProps.fullScreen ? false : true} fullScreen={dialogProps.fullScreen} onClose={() => {
                if (dialogProps.enableOnClose === false)
                    return
                dialogProps.openStateHandler()
            }} >
                <DialogTitle className="flex justify-between" style={{ backgroundColor: 'white' }}>
                    {
                        dialogProps.customTitle && (dialogProps.model)
                    }
                    {(!dialogProps.customTitle && dialogProps.actionState === "create") && `Crear ${dialogProps.model}`}
                    {(!dialogProps.customTitle && dialogProps.actionState === "edit") && `Editar ${dialogProps.model}`}
                    {(!dialogProps.customTitle && dialogProps.actionState === "show") && `Detalles de ${dialogProps.model}`}

                </DialogTitle>
                <div className='flex justify-center'>
                    <Divider className='w-[95%]' />
                </div>
                <DialogContent key={dialogProps.actionState} style={{ backgroundColor: 'white' }}>
                    {
                        (steps.length > 0) && (
                            <Stepper activeStep={activeStep} className='mb-5'>
                                {
                                    steps.map((step, index) => {
                                        return (
                                            <Step key={index}>
                                                <StepLabel>{step.label}</StepLabel>
                                            </Step>
                                        )
                                    })
                                }
                            </Stepper>
                        )
                    }
                    {
                        dialogProps.actionState !== 'show' ? (
                            (steps.length > 0) ? steps.map((step, index) => {
                                if (activeStep === index) {
                                    return (
                                        <form key={index} className={step.style} autoComplete="off">
                                            <FieldDrawer fields={step.fields} errors={errors}></FieldDrawer>
                                        </form>
                                    )
                                }
                            }) : (
                                <form className={dialogProps.style} autoComplete="off">
                                    <FieldDrawer fields={fields} errors={errors}></FieldDrawer>
                                </form>
                            )
                        ) : (
                            <form className={dialogProps.style}>
                                {
                                    fields.map((field, key) => {
                                        return (
                                            <div key={key} className={`grid grid-cols-1 gap-1 mb-3 ${field.style}`} autoComplete="off">
                                                <InputLabel value={field.label}>{field.label}</InputLabel>
                                                {
                                                    // console.log("opciones", field.options, field.label)
                                                    (field.select && field.options) && field.options.map((f) => {
                                                        if (f[field.valueKey] == field.value) {
                                                            return f[field.data];
                                                        }
                                                    })
                                                }
                                                {/* {console.log(field.data, field.valueKey, field.options)} */}
                                                {
                                                    field.check ? (
                                                        <>
                                                            {!field.checked && 'Inactivo'}
                                                            {field.checked && 'Activo'}
                                                        </>
                                                    ) : null
                                                }
                                                {((!field.select || !field.check) && !field.options) && (field.value || 'SIN DATOS')}
                                            </div>
                                        )
                                    })
                                }
                            </form>
                        )
                    }
                </DialogContent>

                <DialogActions style={{ backgroundColor: 'white' }}>
                    {
                        !dialogProps.customAction && <CancelButton closeHandler={dialogProps.openStateHandler} />
                    }
                    {
                        (steps.length > 0) ? (
                            <>
                                {activeStep === 0 ? null : (
                                    <Button onClick={() => stepperHandler((prevActiveStep) => prevActiveStep - 1)}>Anterior</Button>
                                )}
                                {activeStep === steps.length - 1 ? null : (
                                    <Button onClick={() => stepperHandler((prevActiveStep) => prevActiveStep + 1)}>Siguiente</Button>
                                )}
                                {activeStep === steps.length - 1 ? (
                                    dialogProps.actionState !== 'show' ? (
                                        <Button
                                            color={dialogProps.actionState == "create" ? "success" : "warning"}
                                            onClick={dialogProps.onSubmitState()}
                                        >
                                            {dialogProps.actionState == "create" ? "Crear" : "Actualizar"}
                                        </Button>
                                    ) : null
                                ) : null}
                            </>
                        ) : dialogProps.customAction ? (<dialogProps.customAction />) : (
                            <>
                                {
                                    ((dialogProps.actionState !== 'show') && (dialogProps.actionState !== 'custom')) ? (
                                        <Button
                                            color={dialogProps.actionState == "create" ? "success" : "warning"}
                                            onClick={dialogProps.onSubmitState()}
                                        >
                                            {dialogProps.actionState == "create" ? "Crear" : "Actualizar"}
                                        </Button>
                                    ) : dialogProps.customAction && <dialogProps.customAction />
                                }
                            </>
                        )

                    }
                </DialogActions>
            </Dialog>
        </>
    )
}

export const CancelButton = ({ closeHandler }) => {
    return (
        <Button color="error" onClick={() => { closeHandler() }} > Cancelar </Button>
    )
}

export const FieldDrawer = ({ fields = [], errors = [] }) => {
    return (

        fields && fields.map((field, key) => {
            if (field._fieldInfo)
                console.log("field info", field)
            if (field._conditional) {
                if (!field._conditional(field))
                    return <div key={key} className={`grid max-[640px]:col-span-full grid-cols-1 gap-1 ${field.style}`}></div>
            }
            if (field._debug) {
                field._debug({ field })
            }
            if (field.input) {
                return (
                    <div key={key} className={`grid max-[640px]:col-span-full grid-cols-1 gap-1 ${field.style}`}>
                        <TextInput
                            label={field.label}
                            className={"block w-full mt-1 texts"}
                            maxLength={field.maxLength}
                            type={field.type}
                            value={field.value}
                            onChange={field.onChangeFunc}
                            disabled={field.disabled}
                            customIcon={field.customIcon}
                            max={field.max}
                            min={field.min}
                            ref={field.ref}
                            overwrite={field.overwrite}
                            autoComplete={field.autoComplete}
                            onlyUppercase={field.onlyUppercase}
                            allowAsci={field.allowAsci}
                        />

                        {errors[field.fieldKey] && (
                            <span className="text-red-600">
                                {errors[field.fieldKey]}
                            </span>
                        )}
                    </div>

                )
            }
            if (field.select) {
                return (
                    <div key={key} className={`grid max-[640px]:col-span-full grid-cols-1 gap-1 ${field.style}`}>
                        <SelectComp
                            label={field.label}
                            value={field.value}
                            onChangeFunc={field.onChangeFunc}
                            options={field.options}
                            data={field.data}
                            valueKey={field.valueKey}
                            disabled={field.disabled}
                            virtual={field.virtual}
                            firstOption={field.firstOption}
                            firstLabel={field.firstLabel}
                            small={field.small}
                            ref={field.ref}
                        />
                        {errors[field.fieldKey] && (
                            <span className="text-red-600">
                                {errors[field.fieldKey]}
                            </span>
                        )}
                    </div>
                )
            }
            if (field.custom) {
                return (
                    <div key={key} className={`grid max-[640px]:col-span-full grid-cols-1 gap-1 ${field.style}`}>
                        {
                            field.customItem && field.customItem({ ...field })
                            // <field.customItem
                            //     label={field.label}
                            //     value={field.value}
                            //     errors={errors}
                            //     data={field.data}
                            //     onChangeFunc={field.onChangeFunc}
                            //     {...field}
                            // />
                        }
                    </div>
                )
            }
            if (field.check) {
                return (
                    <div key={key} className={`max-[640px]:col-span-full flex gap-1 mt-2  ${field.style}`}>
                        <FormControlLabel
                            label={field.label}
                            labelPlacement={field.labelPlacement || 'end'}
                            defaultChecked={true}
                            disabled={field.disabled}
                            control={
                                <Checkbox
                                    sx={{
                                        "& .MuiSvgIcon-root": {
                                            fontSize: 30,
                                        },
                                    }}
                                    checked={(field.checked === "1" || field.checked === true) ? true : false}
                                    onChange={field.onChangeFunc}
                                />
                            }
                        />
                    </div>
                )
            }
            if (field.table) {
                return (
                    <div key={key} className={`max-[640px]:col-span-full flex gap-1 mt-2  ${field.style}`}>
                        <Datatable
                            searcher={field.searcher ?? false}
                            data={field.data ?? []}
                            virtual={field.virtual ?? true}
                            columns={field.columns ?? []}
                            {...field}

                        />
                    </div>
                )
            }
            if (field.slider) {
                return (
                    <div key={key} className={`max-[640px]:col-span-full flex gap-1 mt-2  ${field.style}`}>
                        <SliderComp
                            steps={field.steps}
                            label={field.label}
                            defaultValue={field.defaultValue}
                            onChangeFunc={field.onChangeFunc}
                            value={field.value}
                            {...field}
                        />
                    </div>
                )
            }
            if (field.blankSpace) {
                return (
                    <div key={key} className={`max-[640px]:col-span-full flex gap-1 mt-2 ${field.style}`} />
                )
            }
            if (field.childs) {
                return (
                    <div key={key} className={`max-[640px]:col-span-full flex gap-1 mt-2  ${field.style}`}>
                        <FieldDrawer fields={field.childs} />

                    </div>
                )
            }
        })
    )
}

/******************** 
 EJEMPLO DE USO  BASICO
 


            <DialogComp
                dialogProps={{
                    model: 'zona',
                    width: 'sm',
                    openState: open,
                    style: 'grid grid-cols-1 gap-x-4',
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[ 
                    {
                        label: "Número zona",
                        input: true,
                        type: 'text',
                        fieldKey: 'zona_numero',
                        value: data.zona_numero,
                        onChangeFunc: (e) => setData({ ...data, zona_numero: e.target.value })
                    },
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'zona_descripcion',
                        value: data.zona_descripcion,
                        onChangeFunc: (e) => setData({ ...data, zona_descripcion: e.target.value })
                    },
                    {
                        label: "Empresa",
                        select: true,
                        options: empresas,
                        data: 'empresa_razonSocial',
                        fieldKey: 'zona_idEmpresa',
                        valueKey: 'empresa_idEmpresa',
                        value: data.zona_idEmpresa || "",
                        onChangeFunc: (newValue) => setData({ ...data, zona_idEmpresa: newValue }),
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'zona_estatus',
                        checked: data.zona_estatus,
                        style: 'justify-center',
                        onChangeFunc: (e) => setData({ 
                            ...data, 
                            zona_estatus: e.target.checked ? "1" : "0",
                        })
                    }
                ]}
                errors={errors}
            />

*/


/* EJEMPLO DE USO CON STEPPER


            <DialogComp
                dialogProps={{
                    model: 'zona',
                    width: 'sm',
                    openState: open,
                    style: 'grid grid-cols-1 gap-x-4',
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                steps={[ 
                    {
                        title: "Step 1",
                        fields: {[
                            {
                                label: "Número zona",
                                input: true,
                                type: 'text',
                                fieldKey: 'zona_numero',
                                value: data.zona_numero,
                                onChangeFunc: (e) => setData({ ...data, zona_numero: e.target.value })
                            },
                            {
                                label: "Número zona",
                                input: true,
                                type: 'text',
                                fieldKey: 'zona_numero',
                                value: data.zona_numero,
                                onChangeFunc: (e) => setData({ ...data, zona_numero: e.target.value })
                            },
                        ]}
                    },
                    {
                        title: "Step 2",
                        fields: {[
                            {
                                label: "Número zona",
                                input: true,
                                type: 'text',
                                fieldKey: 'zona_numero',
                                value: data.zona_numero,
                                onChangeFunc: (e) => setData({ ...data, zona_numero: e.target.value })
                            },
                            {
                                label: "Número zona",
                                input: true,
                                type: 'text',
                                fieldKey: 'zona_numero',
                                value: data.zona_numero,
                                onChangeFunc: (e) => setData({ ...data, zona_numero: e.target.value })
                            },
                        ]}
                    },
                    {
                        title: "Step 3",
                        fields: {[
                            {
                                label: "Número zona",
                                input: true,
                                type: 'text',
                                fieldKey: 'zona_numero',
                                value: data.zona_numero,
                                onChangeFunc: (e) => setData({ ...data, zona_numero: e.target.value })
                            },
                            {
                                label: "Número zona",
                                input: true,
                                type: 'text',
                                fieldKey: 'zona_numero',
                                value: data.zona_numero,
                                onChangeFunc: (e) => setData({ ...data, zona_numero: e.target.value })
                            },
                        ]}
                    },
                ]}
                errors={errors}
            />
*/