<?php

namespace wcf\system\database\table\column;

/**
 * Represents a `longtext` database table column.
 *
 * @author  Matthias Schmidt
 * @copyright   2001-2019 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package WoltLabSuite\Core\System\Database\Table\Column
 * @since   5.2
 */
final class LongtextDatabaseTableColumn extends AbstractDatabaseTableColumn
{
    /**
     * @inheritDoc
     */
    protected string $type = 'longtext';
}
