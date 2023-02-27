<?php

namespace wcf\system\email\transport;

use wcf\system\email\Email;
use wcf\system\email\Mailbox;
use wcf\util\FileUtil;

/**
 * DebugFolderEmailTransport is a debug implementation of an email transport which writes emails into
 * a folder.
 * On unix-like operating systems the folder will be a valid Maildir.
 *
 * @author  Tim Duesterhus
 * @copyright   2001-2019 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since   5.2
 */
final class DebugFolderEmailTransport implements IStatusReportingEmailTransport
{
    protected string $folder;

    /**
     * Creates a new DebugFolderTransport using the given folder as target.
     *
     * @param $folder folder or null for default folder
     */
    public function __construct(?string $folder = null)
    {
        if ($folder === null) {
            $folder = WCF_DIR . 'log/Maildir';
        }

        $this->folder = FileUtil::addTrailingSlash($folder);
        FileUtil::makePath($this->folder);
        if (\PHP_EOL != "\r\n") {
            FileUtil::makePath($this->folder . 'new');
            FileUtil::makePath($this->folder . 'cur');
            FileUtil::makePath($this->folder . 'tmp');
        }
    }

    /**
     * Writes the given $email into the folder.
     */
    public function deliver(Email $email, Mailbox $envelopeFrom, Mailbox $envelopeTo): string
    {
        $eml = "Return-Path: <" . $envelopeFrom->getAddress() . ">\r\n";
        $eml .= "Delivered-To: <" . $envelopeTo->getAddress() . ">\r\n";
        $eml .= $email->getEmail();
        $eml .= "\r\n";

        $timestamp = \explode(' ', \microtime());
        // Mangle the envelopeTo address to be a valid hostname, as the
        // Maildir format expects the last dot-separated part to be a valid hostname.
        $mangledTo = \str_replace(
            '@',
            '.',
            \preg_replace(
                '/[^a-z0-9@]/',
                '',
                \strtolower($envelopeTo->getAddress())
            )
        );
        $filename = \sprintf(
            '%d.M%d.%s.eml',
            $timestamp[1],
            \substr($timestamp[0], 2),
            \substr($mangledTo, 0, 25)
        );

        \file_put_contents($this->folder . $filename, $eml);

        if (\PHP_EOL != "\r\n") {
            @\symlink('../' . $filename, $this->folder . 'new/' . $filename);
        }

        return \sprintf("Written to '%s'.", $filename);
    }
}
