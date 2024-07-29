import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import moment from "moment";

export class ValidatorsPersonalizados extends Validators {
    static dateReleaseValidate(
        nombreControl: string, 
    ): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const control = group.get(nombreControl)
            return control?.value >= moment().format("YYYY-MM-DD") ? null : { dateReleaseInvalid: true}
        }
    }
}