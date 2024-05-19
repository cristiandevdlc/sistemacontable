import { noty, regex } from "@/utils";

export function validationRules(rules, field, alias = null) {
    // console.log({ "rule": rule }, { "field": field }, { "alias": alias })
    let result = null
    if (Array.isArray(rules)) {
        rules.every(rule => {
            const validationString = rule.split(':')
            const primary = validationString[0];
            switch (primary) {
                case validations.required:
                    // console.log("entra a esta validacion 1")
                    if (field === '' || field === null || field === undefined) {
                        result = { message: `El campo es requerido`, valid: false }
                    }
                    break;
                case validations.max:
                    if (field.length > validationString[1]) {
                        result = { message: `Maximo ${validationString[1]} caracteres`, valid: false }
                    }
                    break;
                case validations.min:
                    if (field.length < validationString[1]) {
                        result = { message: `Mínimo ${validationString[1]} caracteres`, valid: false }
                    }
                    break;
                case validations.number:
                    if (isNaN(field)) {
                        // (!isNaN(eprops.item.d)) ? `${MonthsList.find((month) => month.id === data.month).att}-${eprops.item.d}` : eprops.item.d
                        result = { message: `Campo númerico`, valid: false }
                    }
                    break;
                case validations.rfc:
                    if (regex.minus.test(field)) {
                        result = { message: `El RFC es en mayúsculas`, valid: false }
                        return
                    }
                    if (!regex.rfc.test(field)) {
                        result = { message: `RFC no valido`, valid: false }
                        return
                    }
                    break;
                case validations.rfc:
                    if (regex.mayus.test(field)) {
                        result = { message: `El email es en minusculas`, valid: false }
                        return
                    }
                    if (!regex.email.test(field)) {
                        result = { message: `Email no valido`, valid: false }
                        return
                    }
                    break;
            }
            if (result)
                return false;
            return true;
        })
    } else {
        switch (rules) {
            case validations.required:
                if (field === '' || field === null || field === undefined) {
                    result = { message: `El campo es requerido`, valid: false }
                }
                break;
            case validations.max:
                if (field.length > validationString[1]) {
                    result = { message: `Maximo ${validationString[1]} caracteres`, valid: false }
                }
                break;
            case validations.min:
                if (field.length < validationString[1]) {
                    result = { message: `Maximo ${validationString[1]} caracteres`, valid: false }
                }
                break;
        }
    }

    if (result) {
        return result;
    }
    return { valid: true }
}


const validations = {
    required: 'required',
    number: 'number',
    max: 'max',
    min: 'min',
    number: 'number',
    rfc: 'rfc',
    email: 'email',
}
export default validationRules;