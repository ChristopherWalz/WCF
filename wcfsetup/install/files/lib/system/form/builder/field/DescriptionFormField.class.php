<?php
namespace wcf\system\form\builder\field;

/**
 * Implementation of a form field for an object description.
 *
 * @author	Matthias Schmidt
 * @copyright	2001-2018 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	WoltLabSuite\Core\System\Form\Builder\Field
 * @since	3.2
 */
class DescriptionFormField extends MultilineTextFormField {
	/**
	 * Creates a new instance of `DescriptionFormField`.
	 */
	public function __construct() {
		$this->label('wcf.global.description');
	}
}
