<?php
declare(strict_types=1);
namespace wcf\system\form\builder\field;
use wcf\data\IStorableObject;
use wcf\system\form\builder\field\validation\FormFieldValidator;
use wcf\system\form\builder\field\validation\IFormFieldValidationError;
use wcf\system\form\builder\field\validation\IFormFieldValidator;
use wcf\system\form\builder\TFormChildNode;
use wcf\system\form\builder\TFormElement;
use wcf\system\WCF;

/**
 * Abstract implementation of a form field.
 * 
 * @author	Matthias Schmidt
 * @copyright	2001-2018 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	WoltLabSuite\Core\System\Form\Builder\Field
 * @since	3.2
 */
abstract class AbstractFormField implements IFormField {
	use TFormChildNode;
	use TFormElement;
	
	/**
	 * `true` if this field is auto-focused and `false` otherwise
	 * @var	bool 
	 */
	protected $__autoFocus = false;
	
	/**
	 * `true` if the value of this field is immutable and `false` otherwise
	 * @var	bool
	 */
	protected $__immutable = false;
	
	/**
	 * `true` if this field has to be filled out and returns `false` otherwise
	 * @var	bool
	 */
	protected $__required = false;
	
	/**
	 * value of the field
	 * @var	mixed
	 */
	protected $__value;
	
	/**
	 * name of the template used to output this field
	 * @var	string 
	 */
	protected $templateName;
	
	/**
	 * validation errors of this field
	 * @var	IFormFieldValidationError[]
	 */
	protected $validationErrors = [];
	
	/**
	 * field value validators of this field
	 * @var	IFormFieldValidator[]
	 */
	protected $validators = [];
	
	/**
	 * @inheritDoc
	 */
	public function addValidationError(IFormFieldValidationError $error): IFormField {
		if (empty($this->validationErrors)) {
			$this->addClass('formError');
		}
		
		$this->validationErrors[] = $error;
		
		return $this;
	}
	
	/**
	 * @inheritDoc
	 */
	public function addValidator(IFormFieldValidator $validator): IFormField {
		if ($this->hasValidator($validator->getId())) {
			throw new \InvalidArgumentException("Validator with id '{$validator->getId()}' already exists.");
		}
		
		$this->validators[$validator->getId()] = $validator;
		
		return $this;
	}
	
	/**
	 * @inheritDoc
	 */
	public function autoFocus(bool $autoFocus = true): IFormField {
		$this->__autoFocus = $autoFocus;
		
		return $this;
	}
	
	/**
	 * @inheritDoc
	 */
	public function getHtml(): string {
		if ($this->templateName === null) {
			throw new \LogicException("\$templateName property has not been set.");
		}
		
		if ($this->requiresLabel() && $this->getLabel() === null) {
			throw new \UnexpectedValueException("Form field '{$this->getPrefixedId()}' requires a label.");
		}
		
		return WCF::getTPL()->fetch(
			$this->templateName,
			'wcf',
			array_merge($this->getHtmlVariables(), ['field' => $this]),
			true
		);
	}
	
	/**
	 * @inheritDoc
	 */
	public function getSaveValue() {
		return $this->getValue();
	}
	
	/**
	 * @inheritDoc
	 */
	public function getValidationErrors(): array {
		return $this->validationErrors;
	}
	
	/**
	 * @inheritDoc
	 */
	public function getValidators(): array {
		return $this->validators;
	}
	
	/**
	 * @inheritDoc
	 */
	public function getValue() {
		return $this->__value;
	}
	
	/**
	 * @inheritDoc
	 */
	public function hasValidator(string $validatorId): bool {
		FormFieldValidator::validateId($validatorId);
		
		return isset($this->validators[$validatorId]);
	}
	
	/**
	 * @inheritDoc
	 */
	public function hasSaveValue(): bool {
		return true;
	}
	
	/**
	 * @inheritDoc
	 */
	public function immutable(bool $immutable = true): IFormField {
		$this->__immutable = $immutable;
		
		return $this;
	}
	
	/**
	 * @inheritDoc
	 */
	public function isAutoFocused(): bool {
		return $this->__autoFocus;
	}
	
	/**
	 * @inheritDoc
	 */
	public function isImmutable(): bool {
		return $this->__immutable;
	}
	
	/**
	 * @inheritDoc
	 */
	public function isRequired(): bool {
		return $this->__required;
	}
	
	/**
	 * @inheritDoc
	 */
	public function loadValueFromObject(IStorableObject $object): IFormField {
		if (isset($object->{$this->getId()})) {
			$this->value($object->{$this->getId()});
		}
		
		return $this;
	}
	
	/**
	 * @inheritDoc
	 */
	public function removeValidator(string $validatorId): IFormField {
		if (!$this->hasValidator($validatorId)) {
			throw new \InvalidArgumentException("Unknown validator with id '{$validatorId}'");
		}
		
		unset($this->validators[$validatorId]);
		
		return $this;
	}
	
	/**
	 * @inheritDoc
	 * @return	static
	 */
	public function required(bool $required = true): IFormField {
		$this->__required = $required;
		
		return $this;
	}
	
	/**
	 * @inheritDoc
	 */
	public function value($value): IFormField {
		$this->__value = $value;
		
		return $this;
	}
	
	/**
	 * @inheritDoc
	 */
	public function validate() {
		// does nothing
	}
}
