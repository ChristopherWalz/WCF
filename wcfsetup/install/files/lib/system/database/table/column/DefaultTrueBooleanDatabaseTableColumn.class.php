<?php

namespace wcf\system\database\table\column;

/**
 * Represents a `tinyint` database table column with length `1`, default value `1` and whose values
 * cannot be `null`.
 *
 * @author  Matthias Schmidt
 * @copyright   2001-2019 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since   5.2
 */
final class DefaultTrueBooleanDatabaseTableColumn
{
    public static function create(string $name): IDatabaseTableColumn
    {
        return TinyintDatabaseTableColumn::create($name)
            ->length(1)
            ->notNull()
            ->defaultValue(1);
    }

    private function __construct()
    {
    }
}
