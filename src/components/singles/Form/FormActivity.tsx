// Component: FormActivity
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import { ActivityClient, Validation } from '@/types';

// Scripts (node)
import { useRef, useState } from 'react';

// Scripts (local)
import { classNames, strGenerateUid } from '@/lib/utils';
import { useAuth } from '@/components/base/TheProviderAuth';
import { useCalendar } from '@/components/base/TheProviderCalendar';

// Components (node)
import { ListBulletIcon, PencilIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/outline';

// Components (local)
import MessageRestricted from '@/components/singles/Message/MessageRestricted';
import InputTextarea from '@/components/singles/Input/InputTextarea';
import FormNotice from './_partials/FormNotice';

/*---------- Static Data ----------*/

// Name
const name = 'FormActivity';

/*---------- Template ----------*/

// Types
export type FormActivityProps = {
	id?: string;
	className?: string;
};
export type FormActivityPresenterProps = {
	isAdmin?: boolean;
	isModerator?: boolean;
	currentUserUid?: string;
	id?: string;
	error: Validation;
	errors: {
		note: Validation;
		edit: Validation;
		delete: Validation;
	};
	warning?: string | false;
	isFetching?: boolean;
	isSubmitting?: boolean;
	activities?: ActivityClient[];
	className?: string;
	onClickEdit?: (aid: string, values: any) => void;
	onClickDelete?: (aid: string) => void;
	onInputChange?: (name: string, value: any) => void;
	onSubmit?: (values: any) => void;
};
export type FormActivityItemProps = {
	isOwner?: boolean;
	isSubmitting?: boolean;
	id?: string;
	aid: string;
	creator?: string;
	editor?: string;
	body?: string;
	onClickEdit?: (aid: string, values: any) => void;
	onClickDelete?: (aid: string) => void;
};

// Default component
export default function FormActivity(props: FormActivityProps) {
	/*----- Props -----*/

	// Get props
	const { id, className } = props;

	/*----- Store -----*/

	// Input values
	const [inputValueNote, setInputValueNote] = useState<string>('');

	// Input errors
	const [error, setError] = useState<Validation>(false);
	const [errors, setErrors] = useState<{
		note: Validation;
		edit: Validation;
		delete: Validation;
	}>({
		note: false,
		edit: false,
		delete: false,
	});
	const inputSetters = {
		note: setInputValueNote,
	};

	// Warning
	const [warning, setWarning] = useState<string | false>(false);

	// Form states
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	// Context - auth
	const auth = useAuth();
	const { isAdmin, isModerator, currentUser, token } = auth;

	// Context - useCalender
	const { activities, setActivities } = useCalendar();

	/*----- Methods -----*/

	// Function - validateInput
	const validateInput = (name: string, value: string): Validation => {
		// Define error
		let error = false as Validation;

		// Switch - name
		switch (name) {
			// Note
			case 'note':
				// If empty...
				if (!value) {
					// Set error
					error = {
						error: 'required',
						message: 'Note is required',
					};
				}
				break;

			default:
				break;
		}

		// Return
		return error;
	};

	// Function - validateAll
	const validateAll = () => {
		// Define errors
		const returnValue = {
			note: validateInput('note', inputValueNote),
		};

		// Set errors
		setErrors({
			...errors,
			...returnValue,
		});

		// If any value in returnValue is not false...
		if (Object.values(returnValue).some((v) => v !== false)) {
			// Return returnValue
			return {
				error: 'input/general/form/invalid-input',
				message: 'Please check the form for errors',
			};
		}

		// Return
		return false;
	};

	// Function - handleClickEdit
	const handleClickEdit = async (aid: string, values: any) => {
		// Is submitting
		setIsSubmitting(true);

		// Submit values
		const response = await fetch(`/api/activity/${aid}/submit`, {
			method: 'POST',
			body: JSON.stringify(values),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});

		// If success...
		if (response.ok) {
			// Get responseJson
			const responseJson = await response.json();

			// Set activities
			if (setActivities) setActivities(responseJson);
		} else {
			// Set error
			setError({
				error: `error/api-${response.status}`,
				message: `Error submitting activity (${response.statusText})`,
			});
		}

		// Stop submitting
		setIsSubmitting(false);
	};

	// Function - handleClickDelete
	const handleClickDelete = async (aid: string) => {
		console.log('Delete', aid);

		// Is submitting
		setIsSubmitting(true);

		// Submit values
		const response = await fetch(`/api/activity/${aid}/delete`, {
			method: 'POST',
			body: JSON.stringify({
				id,
			}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});

		// If success...
		if (response.ok) {
			// Get responseJson
			const responseJson = await response.json();

			// Set activities
			if (setActivities) setActivities(responseJson);
		} else {
			// Set error
			setError({
				error: `error/api-${response.status}`,
				message: `Error deleting activity (${response.statusText})`,
			});
		}

		// Stop submitting
		setIsSubmitting(false);
	};

	// Function - handleInputChange
	const handleInputChange = (name: string, value: any) => {
		// Set state
		inputSetters[name as keyof typeof inputSetters](value);
	};

	// Function - handleSubmit
	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		aid: string = strGenerateUid()
	) => {
		// Prevent default
		e.preventDefault();

		// If no uid, return
		if (!auth.currentUser?.uid) return;

		// Validate all
		const error = validateAll();

		// If error...
		if (error) {
			// Set error
			setError(error);

			// Return
			return;
		}

		// Set error
		setError(false);

		// Get values
		const values = {
			uid: auth.currentUser.uid,
			id: id,
			aid: aid,
			note: inputValueNote,
		};

		// Is submitting
		setIsSubmitting(true);

		// Submit values
		const response = await fetch(`/api/activity/${values.aid}/submit`, {
			method: 'POST',
			body: JSON.stringify(values),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});

		// If success...
		if (response.ok) {
			// Get responseJson
			const responseJson = await response.json();

			// Set activities
			if (setActivities) setActivities(responseJson);
		} else {
			// Set error
			setError({
				error: `error/api-${response.status}`,
				message: `Error submitting note (${response.statusText})`,
			});
		}

		// Stop submitting
		setIsSubmitting(false);
	};

	/*----- Init -----*/

	// If no auth...
	if (!auth.token || !auth.currentUser) {
		// Return restricted access
		return (
			<MessageRestricted className="grow" code={'restricted/auth/token'} />
		);
	}

	// If no id, return null
	if (!id) return null;

	// Get presenter props
	const presenterProps: FormActivityPresenterProps = {
		isAdmin,
		isModerator,
		currentUserUid: currentUser?.uid,
		id,
		error,
		errors,
		warning,
		isFetching,
		isSubmitting,
		activities,
		className,
		onClickEdit: handleClickEdit,
		onClickDelete: handleClickDelete,
		onInputChange: handleInputChange,
		onSubmit: handleSubmit,
	};

	// Return default
	return <FormActivityPresenter {...presenterProps} />;
}

// FormActivityPresenter component
export function FormActivityPresenter(props: FormActivityPresenterProps) {
	/*----- Props -----*/

	// Get props
	const {
		isAdmin,
		isModerator,
		currentUserUid,
		id,
		error,
		errors,
		warning,
		isFetching,
		isSubmitting,
		activities = [],
		className,
		onClickEdit = (aid: string, values: any) => {},
		onClickDelete = (aid: string) => {},
		onInputChange = (name: string, value: any) => {},
		onSubmit = () => {},
	} = props;

	/*----- Methods -----*/

	// Function - handleClickEdit
	const handleClickEdit = (aid: string, values: any) => {
		// Callback
		onClickEdit(aid, values);
	};

	// Function - handleClickDelete
	const handleClickDelete = (aid: string) => {
		// Callback
		onClickDelete(aid);
	};

	// Function - handleInputChange
	const handleInputChange = (name: string, value: any) => {
		// Callback
		onInputChange(name, value);
	};

	// Function - handleSubmit
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		// Callback
		onSubmit(e);
	};

	/*----- Init -----*/

	// Return default
	return (
		<form
			className={classNames('form rounded text-left bg-gray-100', className)}
			onSubmit={handleSubmit}
		>
			<div
				className={classNames(
					'form__row flex justify-start items-center p-6 space-x-4 font-bold',
					className
				)}
			>
				<span className="form__team-title-icon">
					<ListBulletIcon className="w-6 h-6 text-gray-400" />
				</span>
				<span className="form__team-title-text">Activity</span>
			</div>

			{/* Errors */}
			{(error || warning) && (
				<div className="px-6 pb-6">
					<FormNotice error={error} warning={warning} />
				</div>
			)}

			{isFetching ? (
				<MessageRestricted code={'restricted/timeout'} />
			) : (
				<>
					<ul className="form__activity flex flex-col border rounded-md mx-6 divide-y overflow-hidden border-gray-300 divide-gray-300">
						{activities.map((activity) => (
							<FormActivityItem
								key={`form-activity-${activity.aid}`}
								isOwner={
									isAdmin || isModerator || activity.uid === currentUserUid
								}
								id={id}
								aid={activity.aid ?? '??'}
								creator={activity.creator}
								editor={activity.editor}
								body={activity.note}
								onClickEdit={handleClickEdit}
								onClickDelete={handleClickDelete}
							/>
						))}
					</ul>
				</>
			)}

			<div className="form__edit p-6 space-y-6">
				{isSubmitting ? (
					<MessageRestricted code={'restricted/timeout'} />
				) : (
					<>
						<div className="form__input space-y-2">
							<InputTextarea
								label="Add note"
								name="note"
								id="note"
								error={errors['note']}
								onChange={handleInputChange}
							/>
						</div>
						<button
							className="form__edit-button inline-flex justify-center items-center rounded-md w-full h-10 px-3 py-2 space-x-2 font-semibold text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 text-white bg-blue-600 lg:hover:bg-blue-500 focus-visible:outline-blue-500"
							type="submit"
						>
							<span className="form__edit-button-text inline-block">
								Submit
							</span>
						</button>
					</>
				)}
			</div>
		</form>
	);
}

// FormActivityItem component
export function FormActivityItem(props: FormActivityItemProps) {
	/*----- Props -----*/

	// Get props
	const {
		isOwner,
		isSubmitting,
		id,
		aid,
		creator,
		editor,
		body,
		onClickEdit = (aid: string, values: any) => {},
		onClickDelete = (aid: string) => {},
	} = props;

	/*----- Store -----*/

	// Input values
	const [inputValueNote, setInputValueNote] = useState<string>(body ?? '');

	// Input errors
	const [errors, setErrors] = useState<{
		note: Validation;
	}>({
		note: false,
	});
	const inputSetters = {
		note: setInputValueNote,
	};

	// State - isEditing
	const [isEditing, setIsEditing] = useState<boolean>(false);

	// State - isDeleting
	const [isDeleting, setIsDeleting] = useState<boolean>(false);

	/*----- Methods -----*/

	// Function - validateInput
	const validateInput = (name: string, value: string): Validation => {
		// Define error
		let error = false as Validation;

		// Switch - name
		switch (name) {
			// Note
			case 'note':
				// If empty...
				if (!value) {
					// Set error
					error = {
						error: 'required',
						message: 'Note is required',
					};
				}
				break;

			default:
				break;
		}

		// Return
		return error;
	};

	// Function - validateAll
	const validateAll = () => {
		// Define errors
		const returnValue = {
			note: validateInput('note', inputValueNote),
		};

		// Set errors
		setErrors({
			...errors,
			...returnValue,
		});

		// If any value in returnValue is not false...
		if (Object.values(returnValue).some((v) => v !== false)) {
			// Return returnValue
			return {
				error: 'input/general/form/invalid-input',
				message: 'Please check the form for errors',
			};
		}

		// Return
		return false;
	};

	// Function - handleInputChange
	const handleInputChange = (name: string, value: any) => {
		// Set state
		inputSetters[name as keyof typeof inputSetters](value);
	};

	// Function - handleClickEdit
	const handleClickEdit = () => {
		// Set isDeleting
		setIsDeleting(false);

		// If first click...
		if (!isEditing) {
			// Set isEditing
			setIsEditing(true);
		} else {
			// Validate all
			const error = validateAll();

			// If error...
			if (error) {
				// Return
				return;
			}

			// Get values
			const values = {
				id,
				note: inputValueNote,
			};

			// Callback
			onClickEdit(aid, values);

			// Set isEditing
			setIsEditing(false);

			// Set isDeleting
			setIsDeleting(false);
		}
	};

	// Function - handleClickDelete
	const handleClickDelete = () => {
		// Set isEditing
		setIsEditing(false);

		// If first click...
		if (!isDeleting) {
			// Set isDeleting
			setIsDeleting(true);
		} else {
			// Callback
			onClickDelete(aid);
		}
	};

	// Function - handleClickCancel
	const handleClickCancel = () => {
		// Set isEditing
		setIsEditing(false);
		// Set isDeleting
		setIsDeleting(false);
	};

	/*----- Init -----*/

	// Return default
	return (
		<li className="form__activity-item w-full p-4 space-y-2">
			{creator && (
				<div className="form__activity-heading flex justify-start items-center space-x-4">
					<p className="form__activity-creator flex justify-between items-center w-full font-button font-semibold text-xs border-gray-600">
						{creator}
						{editor && (
							<span className="pl-2 font-normal opacity-50">
								(Edited
								{editor !== creator && ` by ${editor}`})
							</span>
						)}
					</p>
				</div>
			)}

			{isOwner && isEditing ? (
				<div className="form__input space-y-2">
					<InputTextarea
						name="note"
						id="note"
						defaultValue={body ?? ''}
						error={errors['note']}
						onChange={handleInputChange}
					/>
				</div>
			) : (
				<>{body && <p className="form__activity-note text-sm">{body}</p>}</>
			)}

			{isSubmitting ? (
				<>...</>
			) : (
				<>
					{isOwner && !isEditing && !isDeleting && (
						<div className="form__activity-edit flex justify-end items-center pt-2 space-x-4">
							<button
								className="button inline-flex justify-center items-center space-x-2 font-button font-semibold text-xs lg:hover:underline lg:hover:text-blue-600"
								type="button"
								onClick={handleClickEdit}
							>
								<div className="button__icon">
									<PencilIcon className="inline-block w-3 h-auto" />
								</div>
								<div className="button__text pt-[3px]">Edit</div>
							</button>
							<button
								className="button inline-flex justify-center items-center space-x-1 font-button font-semibold text-xs lg:hover:underline lg:hover:text-error"
								type="button"
								onClick={handleClickDelete}
							>
								<div className="button__icon">
									<TrashIcon className="inline-block w-3 h-auto" />
								</div>
								<div className="button__text pt-[3px]">Delete</div>
							</button>
						</div>
					)}

					{isOwner && isEditing && (
						<div className="form__activity-edit flex justify-end items-center pt-2 space-x-4">
							<button
								className="button inline-flex justify-center items-center space-x-2 font-button font-semibold text-xs lg:hover:underline lg:hover:text-error"
								type="button"
								onClick={handleClickEdit}
							>
								<div className="button__text pt-[3px]">Submit</div>
							</button>
							<button
								className="button inline-flex justify-center items-center space-x-1 font-button font-semibold text-xs lg:hover:underline lg:hover:text-blue-600"
								type="button"
								onClick={handleClickCancel}
							>
								<div className="button__text pt-[3px]">Cancel</div>
							</button>
						</div>
					)}

					{isOwner && isDeleting && (
						<div className="form__activity-edit flex justify-end items-center pt-2 space-x-4">
							<p className="font-button font-semibold text-xs">Are you sure?</p>
							<button
								className="button inline-flex justify-center items-center space-x-1 font-button font-semibold text-xs lg:hover:underline lg:hover:text-error"
								type="button"
								onClick={handleClickDelete}
							>
								<div className="button__text pt-[3px]">Confirm</div>
							</button>
							<button
								className="button inline-flex justify-center items-center space-x-1 font-button font-semibold text-xs lg:hover:underline lg:hover:text-blue-600"
								type="button"
								onClick={handleClickCancel}
							>
								<div className="button__text pt-[3px]">Cancel</div>
							</button>
						</div>
					)}
				</>
			)}
		</li>
	);
}
