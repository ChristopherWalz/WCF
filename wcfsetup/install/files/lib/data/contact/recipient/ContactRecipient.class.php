<?php

namespace wcf\data\contact\recipient;

use wcf\data\DatabaseObject;
use wcf\system\email\Mailbox;
use wcf\system\WCF;

/**
 * Represents a contact recipient.
 *
 * @author  Alexander Ebert
 * @copyright   2001-2019 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since   3.1
 *
 * @property-read   int $recipientID        unique id of the recipient
 * @property-read   string $name           name of the recipient
 * @property-read   string $email          email address of the recipient
 * @property-read   int $showOrder      position of the recipient in relation to other recipients
 * @property-read   int $isAdministrator    is `1` if the recipient is the administrator and the `email` value equals `MAIL_ADMIN_ADDRESS`, otherwise `0`
 * @property-read   int $isDisabled     is `1` if the recipient is disabled and thus is not available for selection, otherwise `0`
 * @property-read   int $originIsSystem     is `1` if the recipient has been delivered by a package, otherwise `0` (i.e. the recipient has been created in the ACP)
 */
class ContactRecipient extends DatabaseObject
{
    /**
     * @inheritDoc
     */
    protected function handleData($data)
    {
        // dynamically set email address for the administrator
        if (!empty($data['isAdministrator'])) {
            $data['email'] = MAIL_ADMIN_ADDRESS;
        }

        parent::handleData($data);
    }

    /**
     * @inheritDoc
     */
    public function __toString()
    {
        return $this->getName();
    }

    /**
     * @inheritDoc
     */
    public function __wakeup()
    {
        // update the administrator's email address on de-serialization, avoids outdated caches
        if (!empty($this->data['isAdministrator'])) {
            $this->data['isAdministrator'] = MAIL_ADMIN_ADDRESS;
        }
    }

    /**
     * Returns the localized name of this recipient.
     *
     * @since 5.3
     */
    public function getName(): string
    {
        return WCF::getLanguage()->get($this->name);
    }

    /**
     * Returns the localized email address of this recipient.
     *
     * @since 5.3
     */
    public function getEmail(): string
    {
        return WCF::getLanguage()->get($this->email);
    }

    /**
     * Returns a localized Mailbox for this recipient.
     *
     * @since 5.3
     */
    public function getMailbox(): Mailbox
    {
        return new Mailbox(
            $this->getEmail(),
            $this->getName()
        );
    }
}
