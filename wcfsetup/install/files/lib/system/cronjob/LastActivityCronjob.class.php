<?php

namespace wcf\system\cronjob;

use wcf\data\cronjob\Cronjob;
use wcf\system\WCF;

/**
 * Updates the last activity timestamp in the user table.
 *
 * @author  Marcel Werk
 * @copyright   2001-2021 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 */
class LastActivityCronjob extends AbstractCronjob
{
    /**
     * @inheritDoc
     */
    public function execute(Cronjob $cronjob)
    {
        parent::execute($cronjob);

        $sql = "UPDATE  wcf1_user user_table,
                        wcf1_session session
                SET     user_table.lastActivityTime = session.lastActivityTime
                WHERE   user_table.userID = session.userID
                    AND session.userID IS NOT NULL";
        $statement = WCF::getDB()->prepare($sql);
        $statement->execute();
    }
}
