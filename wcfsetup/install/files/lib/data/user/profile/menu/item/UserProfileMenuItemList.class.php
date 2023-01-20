<?php

namespace wcf\data\user\profile\menu\item;

use wcf\data\DatabaseObjectList;

/**
 * Represents a list of user profile menu items.
 *
 * @author  Alexander Ebert
 * @copyright   2001-2019 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 *
 * @method  UserProfileMenuItem     current()
 * @method  UserProfileMenuItem[]       getObjects()
 * @method  UserProfileMenuItem|null    getSingleObject()
 * @method  UserProfileMenuItem|null    search($objectID)
 * @property    UserProfileMenuItem[] $objects
 */
class UserProfileMenuItemList extends DatabaseObjectList
{
}
