<?php
declare(strict_types=1);
namespace wcf\system\form\builder\field;
use wcf\data\IStorableObject;
use wcf\system\form\builder\field\validation\IFormFieldValidationError;
use wcf\system\form\builder\field\validation\IFormFieldValidator;
use wcf\system\form\builder\IFormChildNode;
use wcf\system\form\builder\IFormElement;

/**
 * Represents an actual form field storing a value.
 * 
 * @author	Matthias Schmidt
 * @copyright	2001-2018 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	WoltLabSuite\Core\System\Form\Builder\Field
 * @since	3.2
 */
interface IFormField extends IFormChildNode, IFormElement {
	/**
	 * Adds the given validation error to this field and returns this field.
	 * 
	 * @param	IFormFieldValidationError	$error	validation error
	 * @return	static					this field
	 */
	public function addValidationError(IFormFieldValidationError $error): IFormField;
	
	/**
	 * Sets whether this field is auto-focused and returns this field.
	 * 
	 * @param	bool		$autoFocus	determines if field is auto-focused
	 * @return	static				this field
	 */
	public function autoFocus(bool $autoFocus = true): IFormField;
	
	/**
	 * Adds the given validation error to this field and returns this field.
	 * 
	 * @param	IFormFieldValidator	$validator
	 * @return	static			this field
	 */
	public function addValidator(IFormFieldValidator $validator): IFormField;
	
	/**
	 * Returns the name of the object property this field represents.
	 * 
	 * If no object property has been explicitly set, the field's id is returned.
	 * 
	 * @return	string
	 */
	public function getObjectProperty(): string;
	
	/**
	 * Returns the field value saved in the database.
	 * 
	 * This method is useful if the actual returned by `getValue()`
	 * cannot be stored in the database as-is. If the return value of
	 * `getValue()` is, however, the actual value that should be stored
	 * in the database, this method is expected to call `getValue()`
	 * internally.
	 * 
	 * @return	mixed
	 */
	public function getSaveValue();
	
	/**
	 * Returns the validation errors of this field.
	 * 
	 * @return	IFormFieldValidationError[]	field validation errors
	 */
	public function getValidationErrors(): array;
	
	/**
	 * Returns all field value validators of this field.
	 *
	 * @return	IFormFieldValidator[]		field value validators of this field
	 */
	public function getValidators(): array;
	
	/**
	 * Returns the value of this field or `null` if no value has been set.
	 * 
	 * @return	mixed
	 */
	public function getValue();
	
	/**
	 * Returns `true` if this field has a validator with the given id and
	 * returns `false` otherwise.
	 * 
	 * @param	string		$validatorId	id of the checked validator
	 * @return	bool
	 * 
	 * @throws	\InvalidArgumentException	if the given id is invalid
	 */
	public function hasValidator(string $validatorId): bool;
	
	/**
	 * Returns `true` if this field provides a value that can simply be stored
	 * in a column of the database object's database table and returns `false`
	 * otherwise.
	 * 
	 * Note: If `false` is returned, this field should probabily add its own
	 * `IFormFieldDataProcessor` object to the form document's data processor.
	 * A suitable place to add the processor is the `parent()`
	 * 
	 * @return	bool
	 */
	public function hasSaveValue(): bool;
	
	/**
	 * Sets whether the value of this field is immutable and returns this field.
	 * 
	 * @param	bool		$immutable	determines if field value is immutable
	 * @return	static				this field
	 */
	public function immutable(bool $immutable = true): IFormField;
	
	/**
	 * Returns `true` if this field is auto-focused and returns `false` otherwise.
	 * By default, fields are not auto-focused.
	 * 
	 * @return	bool
	 */
	public function isAutoFocused(): bool;
	
	/**
	 * Returns `true` if the value of this field is immutable and returns `false`
	 * otherwise. By default, fields are mutable.
	 * 
	 * @return	bool
	 */
	public function isImmutable(): bool;
	
	/**
	 * Returns `true` if this field has to be filled out and returns `false` otherwise.
	 * By default, fields do not have to be filled out.
	 * 
	 * @return	bool
	 */
	public function isRequired(): bool;
	
	/**
	 * Loads the field value from the given object and returns this field.
	 * 
	 * @param	IStorableObject		$object		object used to load field value
	 * @return	static					this field
	 */
	public function loadValueFromObject(IStorableObject $object): IFormField;
	
	/**
	 * Sets the name of the object property this field represents. If an empty
	 * string is passed, the object property is unset.
	 * 
	 * The object property allows having different fields (requiring different ids)
	 * that represent the same object property which is handy when available options
	 * of the field's value depend on another field. Having object property allows
	 * to define different fields for each value of the other field and to use form
	 * field dependencies to only show the appropriate field.
	 * 
	 * @param	string		$objectProperty		object property this field represents
	 * @return	IFormField
	 * 
	 * @throws	\InvalidArgumentException	if the passed object property is no valid id 
	 */
	public function objectProperty(string $objectProperty): IFormField;
	
	/**
	 * Reads the value of this field from request data and return this field.
	 * 
	 * @return	static		this field
	 */
	public function readValue(): IFormField;
	
	/**
	 * Removes the field value validator with the given id and returns this field.
	 * 
	 * @param	string		$validatorId	id of the removed validator
	 * @return	static				this field
	 * 
	 * @throws	\InvalidArgumentException	if the given id is invalid or no such validator exists
	 */
	public function removeValidator(string $validatorId): IFormField;
	
	/**
	 * Sets whether it is required to fill out this field and returns this field.
	 * 
	 * @param	bool		$required	determines if field has to be filled out
	 * @return	static				this field
	 */
	public function required(bool $required = true): IFormField;
	
	/**
	 * Sets the value of this field and returns this field.
	 * 
	 * @param	mixed		$value		new field value
	 * @return	static				this field
	 * 
	 * @throws	\InvalidArgumentException	if the given value is of an invalid type or otherwise is invalid
	 */
	public function value($value): IFormField;
}
