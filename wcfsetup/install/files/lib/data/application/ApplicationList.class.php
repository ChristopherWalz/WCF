<?php

namespace wcf\data\application;

use wcf\data\DatabaseObjectList;

/**
 * Represents a list of applications.
 *
 * @author  Alexander Ebert
 * @copyright   2001-2019 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 *
 * @method  Application     current()
 * @method  Application[]       getObjects()
 * @method  Application|null    getSingleObject()
 * @method  Application|null    search($objectID)
 * @property    Application[] $objects
 */
class ApplicationList extends DatabaseObjectList
{
    /**
     * @inheritDoc
     */
    public $className = Application::class;
}
