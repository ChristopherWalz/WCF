<?php

namespace wcf\system\email;

use wcf\data\user\User;
use wcf\system\cache\runtime\UserRuntimeCache;
use wcf\system\email\exception\UserDeleted;

/**
 * Default implementation of the IUserMailbox interface.
 *
 * @author  Tim Duesterhus
 * @copyright   2001-2021 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package WoltLabSuite\Core\System\Email
 * @since   3.0
 */
class UserMailbox extends Mailbox implements IUserMailbox
{
    /**
     * User belonging to this Mailbox
     * @var int
     */
    protected $userID;

    /**
     * Creates a new Mailbox.
     *
     * @param User $user User object belonging to this Mailbox
     */
    public function __construct(User $user)
    {
        parent::__construct($user->email, $user->username, $user->getLanguage());

        $this->userID = $user->userID;
    }

    /**
     * Returns the User object belonging to this Mailbox.
     */
    public function getUser(): User
    {
        $user = UserRuntimeCache::getInstance()->getObject($this->userID);

        if ($user === null) {
            throw UserDeleted::forUserId($this->userID);
        }

        return $user;
    }
}
