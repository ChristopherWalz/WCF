<?php

namespace wcf\system\database\table\column;

use wcf\system\database\table\TDroppableDatabaseComponent;

/**
 * Abstract implementation of a database table column.
 *
 * @author  Matthias Schmidt
 * @copyright   2001-2022 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package WoltLabSuite\Core\System\Database\Table\Column
 * @since   5.2
 */
abstract class AbstractDatabaseTableColumn implements IDatabaseTableColumn
{
    use TDroppableDatabaseComponent;

    /**
     * name of the database table column
     * @var string
     */
    protected $name;

    /**
     * new name of the database table column
     * @var ?string
     */
    protected $newName;

    /**
     * is `true` if the values of the column may not be `null`
     * @var bool
     */
    protected $notNull = false;

    /**
     * type of the database table column
     * @var string
     */
    protected $type;

    /**
     * @inheritDoc
     */
    public function getData()
    {
        $data = [
            'notNull' => $this->isNotNull() ? 1 : 0,
            'type' => $this->getType(),
        ];

        if ($this instanceof IDefaultValueDatabaseTableColumn) {
            if ($this->getDefaultValue() !== null) {
                $data['default'] = "'" . \str_replace(
                    ["'", '\\'],
                    ["''", '\\\\'],
                    $this->getDefaultValue()
                ) . "'";
            } else {
                $data['default'] = null;
            }
        }

        if ($this instanceof IAutoIncrementDatabaseTableColumn) {
            $data['autoIncrement'] = $this->isAutoIncremented() ? 1 : 0;

            // MySQL requires that there is only a single auto column per table *AND*
            // that this column is defined as the primary key.
            if ($data['autoIncrement'] === 1) {
                $data['key'] = 'PRIMARY';
            }
        }

        if ($this instanceof IDecimalsDatabaseTableColumn && $this->getDecimals() !== null) {
            $data['decimals'] = $this->getDecimals();
        }

        if ($this instanceof IEnumDatabaseTableColumn) {
            $values = \array_map(static function ($value) {
                return \str_replace(["'", '\\'], ["''", '\\\\'], $value);
            }, $this->getEnumValues());

            $data['values'] = "'" . \implode("','", $values) . "'";
        }

        if ($this instanceof ILengthDatabaseTableColumn) {
            $data['length'] = $this->getLength();
        }

        return $data;
    }

    /**
     * @inheritDoc
     * @since       5.4
     */
    public function getNewName(): ?string
    {
        return $this->newName;
    }

    /**
     * @inheritDoc
     */
    public function getName()
    {
        if ($this->name === null) {
            throw new \BadMethodCallException("Name of the database table column has not been set yet");
        }

        return $this->name;
    }

    /**
     * @inheritDoc
     */
    public function getType()
    {
        if ($this->type === null) {
            throw new \BadMethodCallException(
                "Type of the database table column " . static::class . " has not been set yet"
            );
        }

        return $this->type;
    }

    /**
     * @inheritDoc
     */
    public function isNotNull()
    {
        return $this->notNull;
    }

    /**
     * @inheritDoc
     */
    public function name($name)
    {
        if ($this->name !== null) {
            throw new \BadMethodCallException("Name of the database table column has already been set.");
        }

        $this->name = $name;

        return $this;
    }

    /**
     * @inheritDoc
     */
    public function notNull($notNull = true)
    {
        $this->notNull = $notNull;

        return $this;
    }

    /**
     * @inheritDoc
     * @since       5.4
     */
    public function renameTo(string $newName)
    {
        if ($newName === $this->getName()) {
            throw new \InvalidArgumentException("'{$newName}' is the current name of the column.");
        }

        $this->newName = $newName;

        return $this;
    }

    /**
     * @inheritDoc
     * @return  static
     */
    public static function create($name)
    {
        return (new static())->name($name);
    }

    /**
     * @inheritDoc
     */
    public static function createFromData($name, array $data)
    {
        $column = static::create($name)
            ->notNull($data['notNull']);

        if ($column instanceof IDefaultValueDatabaseTableColumn) {
            $column->defaultValue($data['default']);
        }

        if ($column instanceof IAutoIncrementDatabaseTableColumn) {
            $column->autoIncrement($data['autoIncrement'] ?: false);
        }

        if ($column instanceof ILengthDatabaseTableColumn) {
            $column->length($data['length'] ?: null);
        }

        if ($column instanceof IDecimalsDatabaseTableColumn) {
            $column->decimals($data['decimals'] ?: null);
        }

        if ($column instanceof IEnumDatabaseTableColumn && !empty($data['enumValues'])) {
            $values = \explode(',', $data['enumValues'] ?? '');

            $values = \array_map(static function ($value) {
                // trim one leading and one trailing `'`
                $value = \substr($value, 1, -1);

                return \str_replace(['\\\\', "''"], ['\\', "'"], $value);
            }, $values);

            $column->enumValues($values);
        }

        return $column;
    }
}
