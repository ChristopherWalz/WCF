<?php
declare(strict_types=1);
namespace wcf\system\form\builder\field;

/**
 * Represents a form field that supports setting the maximum length of the field value.
 * 
 * @author	Matthias Schmidt
 * @copyright	2001-2018 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	WoltLabSuite\Core\System\Form\Builder\Field
 * @since	3.2
 */
interface IMaximumLengthFormField {
	/**
	 * Returns the maximum length of the values of this field or `null` if no maximum
	 * length has been set.
	 * 
	 * @return	null|int
	 */
	public function getMaximumLength();
	
	/**
	 * Sets the maximum length of the values of this field. If `null` is passed, the
	 * maximum length is removed.
	 * 
	 * @param	null|int	$maximumLength	maximum field value length
	 * @return	static				this field
	 * 
	 * @throws	\InvalidArgumentException	if the given maximum length is no integer or otherwise invalid
	 */
	public function maximumLength(int $maximumLength = null): IMaximumLengthFormField;
}
