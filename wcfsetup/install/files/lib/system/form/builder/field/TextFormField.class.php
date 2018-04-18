<?php
declare(strict_types=1);
namespace wcf\system\form\builder\field;
use wcf\system\form\builder\field\validation\FormFieldValidationError;
use wcf\system\language\LanguageFactory;

/**
 * Implementation of a form field for single-line text values.
 * 
 * @author	Matthias Schmidt
 * @copyright	2001-2018 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	WoltLabSuite\Core\System\Form\Builder\Field
 * @since	3.2
 */
class TextFormField extends AbstractFormField implements II18nFormField, IMaximumLengthFormField, IMinimumLengthFormField, IPlaceholderFormField {
	use TI18nFormField {
		validate as protected i18nValidate;
	}
	use TMaximumLengthFormField;
	use TMinimumLengthFormField;
	use TPlaceholderFormField;
	
	/**
	 * @inheritDoc
	 */
	protected $templateName = '__textFormField';
	
	/**
	 * @inheritDoc
	 */
	public function validate() {
		if ($this->isI18n()) {
			$this->i18nValidate();
			
			$value = $this->getValue();
			if ($this->hasPlainValue()) {
				$this->validateText($value);
			}
			else {
				foreach ($value as $languageID => $languageValue) {
					$this->validateText($languageValue, LanguageFactory::getInstance()->getLanguage($languageID));
				}
			}
		}
		else {
			if ($this->isRequired() && ($this->getValue() === null || $this->getValue() === '')) {
				$this->addValidationError(new FormFieldValidationError('empty'));
			}
			else {
				$this->validateText($this->getValue());
			}
		}
		
		parent::validate();
	}
	
	/**
	 * Checks the length of the given text with the given language.
	 * 
	 * @param	string		$text		validated text
	 * @param	null|Language	$language	language of validated text or `null` for monolingual text
	 */
	protected function validateText(string $text, Language $language = null) {
		$this->validateMinimumLength($text, $language);
		$this->validateMaximumLength($text, $language);
	}
}
