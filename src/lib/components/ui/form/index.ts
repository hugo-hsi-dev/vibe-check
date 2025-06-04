import * as FormPrimitive from "formsnap";

import ElementField from "./form-element-field.svelte";
import FieldErrors from "./form-field-errors.svelte";
import Description from "./form-description.svelte";
import Fieldset from "./form-fieldset.svelte";
import Button from "./form-button.svelte";
import Legend from "./form-legend.svelte";
import Field from "./form-field.svelte";
import Label from "./form-label.svelte";

const Control = FormPrimitive.Control;

export {
	ElementField as FormElementField,
	Description as FormDescription,
	FieldErrors as FormFieldErrors,
	Fieldset as FormFieldset,
	Control as FormControl,
	Button as FormButton,
	Legend as FormLegend,
	//
	Field as FormField,
	Label as FormLabel,
	ElementField,
	Description,
	FieldErrors,
	Fieldset,
	Control,
	Button,
	Legend,
	Field,
	Label,
};
