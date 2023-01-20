<?php

namespace wcf\data\ad;

use wcf\data\DatabaseObjectList;

/**
 * Represents a list of ads.
 *
 * @author  Matthias Schmidt
 * @copyright   2001-2019 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 *
 * @method  Ad      current()
 * @method  Ad[]        getObjects()
 * @method  Ad|null     getSingleObject()
 * @method  Ad|null     search($objectID)
 * @property    Ad[] $objects
 */
class AdList extends DatabaseObjectList
{
}
