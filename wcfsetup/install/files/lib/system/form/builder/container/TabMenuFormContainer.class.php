<?php
declare(strict_types=1);
namespace wcf\system\form\builder\container;

/**
 * Represents a container whose children are tabs of a tab menu.
 * 
 * @author	Matthias Schmidt
 * @copyright	2001-2018 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	WoltLabSuite\Core\System\Form\Builder\Container
 * @since	3.2
 */
class TabMenuFormContainer extends FormContainer implements ITabMenuFormContainer {
	/**
	 * @inheritDoc
	 */
	protected $templateName = '__tabMenuFormContainer';
}
