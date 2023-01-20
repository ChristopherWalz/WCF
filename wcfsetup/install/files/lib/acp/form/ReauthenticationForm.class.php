<?php

namespace wcf\acp\form;

use wcf\system\WCF;

/**
 * Represents the reauthentication form.
 *
 * @author  Tim Duesterhus
 * @copyright   2001-2020 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since   5.4
 */
class ReauthenticationForm extends \wcf\form\ReauthenticationForm
{
    public function assignVariables()
    {
        parent::assignVariables();

        WCF::getTPL()->assign(['__wcfAcpIsLogin' => true]);
    }
}
