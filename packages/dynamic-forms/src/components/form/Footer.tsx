/**
 * Dynamic Forms
 *
 * Form footer component
 */
import { Card, IconWaarschuwing, OutlineButton } from "@some-ui-lib"
import { FormEvent, useCallback, useState } from "react"
import ChevronButton from "~components/generic/ChevronButton/ChevronButton"
import {
	CsFlags,
	IsCsFlagEnabled,
} from "~components/utility/ClientSideFF/ClientSideFF"
import RenderReactHookFormErrors from "~dynamicForms/components/render/RenderReactHookFormErrors"
import { useDynamicFormsContext } from "~dynamicForms/core"
import { navPreventDefaultFn } from "~utils"

const DynamicFormFooter = () => {
	const { resetForm, submitForm, rhf, onCancel, sendLabel, footerComponent } =
		useDynamicFormsContext()

	const [showErrors, setShowErrors] = useState(false)

	const toggleErrors = useCallback(() => {
		setShowErrors((state) => !state)
		rhf.trigger()
	}, [rhf])

	const enableInvalidFormSubmission = IsCsFlagEnabled(
		CsFlags.ALLOW_INVALID_FORMS,
	)

	console.log({ footerComponent, showErrors })

	return (
		<div className="form-footer">
			{(!!footerComponent || showErrors) && (
				<Card>
					{footerComponent}

					{showErrors && <RenderReactHookFormErrors />}
				</Card>
			)}

			<div className="d-flex">
				<OutlineButton
					variant="purple"
					type="button"
					onClick={resetForm}
					disabled={!rhf.formState.isDirty}
				>
					Rubriekinhoud herstellen
				</OutlineButton>

				<span className="spacer"></span>

				<div className="d-flex align-items-center">
					{rhf.formState.isValid && !rhf.formState.isDirty && (
						<div className="d-flex mv-0 mr-3" style={{ opacity: 0.8 }}>
							Het formulier is nog niet aangepast
						</div>
					)}

					{!rhf.formState.isValid && (
						<div className="d-flex mv-0 mr-3" style={{ opacity: 0.8 }}>
							<IconWaarschuwing
								style={{ opacity: 0.4 }}
								className="mr-2"
								size={18}
							/>{" "}
							Het formulier is nog niet correct ingevuld{" "}
							{!showErrors && (
								<>
									-{" "}
									<a
										className="ml-1 font-weight-bold"
										href="#"
										onClick={navPreventDefaultFn(toggleErrors)}
									>
										Toon info
									</a>
								</>
							)}
						</div>
					)}

					{!!onCancel && (
						<OutlineButton variant="purple" type="button" onClick={onCancel}>
							Annuleren
						</OutlineButton>
					)}

					<ChevronButton
						variant={
							!rhf.formState.isValid && enableInvalidFormSubmission
								? "red"
								: "purple"
						}
						type="submit"
						onClick={() => submitForm({} as FormEvent<HTMLFormElement>)}
						disabled={
							!enableInvalidFormSubmission &&
							(!rhf.formState.isValid ||
								(!rhf.formState.isDirty && !rhf.formState.isSubmitting))
						}
					>
						{sendLabel ? sendLabel : "Verzenden"}
					</ChevronButton>
				</div>
			</div>
		</div>
	)
}

export default DynamicFormFooter
