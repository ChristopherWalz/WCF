<?php
declare(strict_types=1);
namespace wcf\system\form\builder\field;
use wcf\system\WCF;

/**
 * Provides default implementations of `IPlaceholderFormField` methods.
 * 
 * @author	Matthias Schmidt
 * @copyright	2001-2018 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	WoltLabSuite\Core\System\Form\Builder\Field
 * @since	3.2
 */
trait TPlaceholderFormField {
	/**
	 * placeholder value of this element
	 * @var	string
	 */
	protected $__placeholder;
	
	/**
	 * Returns the placeholder value of this field or `null` if no placeholder has
	 * been set.
	 *
	 * @return	null|string
	 */
	public function getPlaceholder() {
		return $this->__placeholder;
	}
	
	/**
	 * Sets the placeholder value of this field using the given language item
	 * and returns this element. If `null` is passed, the placeholder value is
	 * removed.
	 * 
	 * @param	null|string	$languageItem	language item containing the placeholder or `null` to unset description
	 * @param	array		$variables	additional variables used when resolving the language item
	 * @return	IPlaceholderFormField		this field
	 * 
	 * @throws	\InvalidArgumentException	if the given value is no string or otherwise invalid
	 */
	public function placeholder(string $languageItem = null, array $variables = []): IPlaceholderFormField {
		if ($languageItem === null) {
			if (!empty($variables)) {
				throw new \InvalidArgumentException("Cannot use variables when unsetting placeholder of field '{$this->getId()}'");
			}
			
			$this->__placeholder = null;
		}
		else {
			if (!is_string($languageItem)) {
				throw new \InvalidArgumentException("Given placeholder language item is no string, " . gettype($languageItem) . " given.");
			}
			
			$this->__placeholder = WCF::getLanguage()->getDynamicVariable($languageItem, $variables);
		}
		
		return $this;
	}
}
